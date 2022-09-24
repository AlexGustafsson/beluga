package oauth2

import (
	"crypto/rsa"
	"errors"
	"regexp"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/patrickmn/go-cache"
)

const (
	DefaultCodeLifetime time.Duration = 2 * time.Minute
)

const (
	DefaultRefreshTokenLifetime time.Duration = 5 * time.Minute
)

var (
	ErrNoSuchClient            error = errors.New("no such client")
	ErrRedirectURINotPermitted error = errors.New("the client does not permit the redirect uri")
	ErrUnsupportedRequest      error = errors.New("the auth request is not supported")
	ErrInvalidAuthCode         error = errors.New("invalid auth code")
	ErrInvalidRequest          error = errors.New("invalid request")
)

// Client is an OAuth client.
type Client struct {
	ID                         string
	PermittedRedirectWildcards []string
}

// PermitsRedirectURI returns whether or not the redirect URI is permitted by the client.
func (c *Client) PermitsRedirectURI(uri string) bool {
	for _, wildcard := range c.PermittedRedirectWildcards {
		expanded := strings.ReplaceAll(regexp.QuoteMeta(wildcard), "*", ".*")
		expression, err := regexp.Compile(expanded)
		if err != nil {
			continue
		}
		if expression.MatchString(uri) {
			return true
		}
	}

	return false
}

type ClientStore interface {
	Client(id string) (*Client, error)
}

type ClientStoreFunc func(id string) (*Client, error)

func (s ClientStoreFunc) Client(id string) (*Client, error) {
	return s(id)
}

type UserStore interface {
	User(id string) (ProfileClaims, error)
}

type UserStoreFunc func(id string) (ProfileClaims, error)

func (s UserStoreFunc) User(id string) (ProfileClaims, error) {
	return s(id)
}

// Authorizer is an OAuth authorizer.
// It implements the subset of OAuth as used by the React Auth0 provider.
// See: https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow
type Authorizer struct {
	signingKey   *rsa.PrivateKey
	clientStore  ClientStore
	userStore    UserStore
	issuer       string
	codeCache    *cache.Cache
	sessionCache *cache.Cache
}

func NewAuthorizer(clientStore ClientStore, userStore UserStore, issuer string, signingKey *rsa.PrivateKey) *Authorizer {
	return &Authorizer{
		signingKey:   signingKey,
		clientStore:  clientStore,
		issuer:       issuer,
		userStore:    userStore,
		codeCache:    cache.New(DefaultCodeLifetime, 5*time.Minute),
		sessionCache: cache.New(DefaultRefreshTokenLifetime, 5*time.Minute),
	}
}

type RequestCodeOptions struct {
	ClientID            string
	RedirectURI         string
	Scope               string
	ResponseType        string
	State               string
	CodeChallenge       string
	CodeChallengeMethod string
	Nonce               string
	// Time represents the auth time
	Time time.Time
	// Subject represents an ID of the subject
	Subject string
}

func (a *Authorizer) RequestCode(options *RequestCodeOptions) (string, error) {
	// Only support what's provided by the Auth0 SPA client
	if options.ResponseType != "code" || options.CodeChallengeMethod != "S256" {
		return "", ErrUnsupportedRequest
	}

	client, err := a.clientStore.Client(options.ClientID)
	if err != nil {
		return "", err
	}

	// TODO: Allow empty redirect URI, use client's redirect URI instead?
	if ok := client.PermitsRedirectURI(options.RedirectURI); !ok {
		return "", ErrRedirectURINotPermitted
	}

	// TODO: Revisit - is it really safe? Should be given 256bit entropy of code.
	// One option is to embed the challenge in the code
	code, err := GenerateCode()
	if err != nil {
		return "", err
	}

	a.codeCache.Set(code, options, cache.DefaultExpiration)

	return code, nil
}

type RequestTokenOptions struct {
	ClientID     string
	Code         string
	CodeVerifier string
	RedirectURI  string
}

func (a *Authorizer) RequestToken(options *RequestTokenOptions) (*Token, error) {
	requestOptionsValue, ok := a.codeCache.Get(options.Code)
	if !ok {
		return nil, ErrInvalidAuthCode
	}

	requestOptions := requestOptionsValue.(*RequestCodeOptions)

	// The code and token requests had different client ids
	if options.ClientID != requestOptions.ClientID {
		return nil, ErrInvalidRequest
	}

	client, err := a.clientStore.Client(options.ClientID)
	if err != nil {
		return nil, err
	}

	// TODO: Allow empty redirect URI, use client's redirect URI instead?
	if ok := client.PermitsRedirectURI(options.RedirectURI); !ok {
		return nil, ErrRedirectURINotPermitted
	}

	// TODO: Code verifier

	sessionID, err := uuid.NewRandom()
	if err != nil {
		return nil, err
	}

	user, err := a.userStore.User(requestOptions.Subject)
	if err != nil {
		return nil, err
	}

	session := &Session{
		ID:            sessionID.String(),
		ClientID:      client.ID,
		ProfileClaims: user,
		AuthCode:      options.Code,
		AuthTime:      requestOptions.Time,
		Scope:         requestOptions.Scope,
		Issuer:        a.issuer,
		Subject:       requestOptions.Subject,
		SigningKey:    a.signingKey,
		Nonce:         requestOptions.Nonce,
	}

	token, err := session.NewToken()
	if err != nil {
		return nil, err
	}

	a.sessionCache.Set(token.AccessToken, token, cache.DefaultExpiration)
	return token, nil
}

func (a *Authorizer) Client(id string) (*Client, error) {
	return a.clientStore.Client(id)
}
