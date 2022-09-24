package auth

import (
	"crypto/rand"
	"crypto/rsa"
	"encoding/json"
	"net/http"
	"net/url"
	"time"

	"github.com/AlexGustafsson/beluga/internal/auth/oauth2"
	"github.com/AlexGustafsson/beluga/internal/logging"
	"go.uber.org/zap"
)

type Authorizer struct {
	authorizer *oauth2.Authorizer
	log        logging.Logger
}

type TokenRequest struct {
	ClientID     string `json:"client_id"`
	CodeVerifier string `json:"code_verifier"`
	GrantType    string `json:"grant_type"`
	Code         string `json:"code"`
	RedirectURI  string `json:"redirect_uri"`
}

type TokenResponse struct {
	AccessToken     string `json:"access_token"`
	RefreshToken    string `json:"refresh_token"`
	IDToken         string `json:"id_token"`
	Scope           string `json:"scope"`
	LifetimeSeconds int    `json:"expires_in"`
	TokenType       string `json:"token_type"`
}

func NewAuthorizer(log logging.Logger) *Authorizer {
	clients := oauth2.ClientStoreFunc(func(id string) (*oauth2.Client, error) {
		// TODO: Actual store
		return &oauth2.Client{
			ID: "61ce816dd7194b4bbbbb41ed55e102b3",
			PermittedRedirectWildcards: []string{
				"http://localhost:3000",
				"http://localhost:3000/*",
			},
		}, nil
	})

	users := oauth2.UserStoreFunc(func(id string) (oauth2.ProfileClaims, error) {
		// TODO: Actual store
		return oauth2.ProfileClaims{
			Name:              "Test User",
			PreferredUsername: "test-user",
		}, nil
	})

	// TODO: config
	signingKey, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		panic(err)
	}

	return &Authorizer{
		authorizer: oauth2.NewAuthorizer(clients, users, "http://localhost:8081/", signingKey),
		log:        log,
	}
}

func (a *Authorizer) Authorize(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	clientID := query.Get("client_id")
	redirectURIString := query.Get("redirect_uri")
	scope := query.Get("scope")
	responseType := query.Get("response_type")
	responseMode := query.Get("response_mode")
	state := query.Get("state")
	codeChallenge := query.Get("code_challange")
	codeChallangeMethod := query.Get("code_challenge_method")
	nonce := query.Get("nonce")
	// prompt := query.Get("prompt")

	redirectURI, err := url.Parse(redirectURIString)
	if err != nil {
		w.Header().Set("Content-Type", "text/raw")
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}

	// Only support what's provided by the Auth0 SPA client
	if responseMode != "query" {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}

	code, err := a.authorizer.RequestCode(&oauth2.RequestCodeOptions{
		ClientID:            clientID,
		RedirectURI:         redirectURIString,
		Scope:               scope,
		ResponseType:        responseType,
		State:               state,
		CodeChallenge:       codeChallenge,
		CodeChallengeMethod: codeChallangeMethod,
		Nonce:               nonce,
		Time:                time.Now(),
		Subject:             "todo",
	})
	switch err {
	case oauth2.ErrUnsupportedRequest:
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	case oauth2.ErrNoSuchClient:
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	case oauth2.ErrRedirectURINotPermitted:
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	case nil:
		// Do nothing
	default:
		a.log.Error("Failed to generate token", zap.Error(err))
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	redirectURIQuery := redirectURI.Query()
	redirectURIQuery.Add("code", code)
	redirectURIQuery.Add("state", state)
	redirectURI.RawQuery = redirectURIQuery.Encode()

	w.Header().Set("Location", redirectURI.String())
	w.WriteHeader(http.StatusTemporaryRedirect)
}

func (a *Authorizer) Token(w http.ResponseWriter, r *http.Request) {
	var request TokenRequest
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}

	token, err := a.authorizer.RequestToken(&oauth2.RequestTokenOptions{
		ClientID:     request.ClientID,
		Code:         request.Code,
		CodeVerifier: request.CodeVerifier,
		RedirectURI:  request.RedirectURI,
	})
	switch err {
	case oauth2.ErrUnsupportedRequest:
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	case oauth2.ErrNoSuchClient:
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	case nil:
		// Do nothing
	default:
		a.log.Error("Failed to generate token", zap.Error(err))
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	response := TokenResponse{
		AccessToken:     token.AccessToken,
		RefreshToken:    token.RefreshToken,
		IDToken:         token.IDToken,
		Scope:           token.Scope,
		LifetimeSeconds: int(token.Lifetime.Seconds()),
		TokenType:       "Bearer",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(&response)
}

func (a *Authorizer) Logout(w http.ResponseWriter, r *http.Request) {
	// TODO: OAuth log out
	query := r.URL.Query()
	redirectURI := query.Get("returnTo")
	clientID := query.Get("client_id")

	client, err := a.authorizer.Client(clientID)
	switch err {
	case oauth2.ErrNoSuchClient:
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	case nil:
		// Do nothing
	default:
		a.log.Error("Failed to generate token", zap.Error(err))
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	if !client.PermitsRedirectURI(redirectURI) {
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	}

	w.Header().Set("Location", redirectURI)
	w.WriteHeader(http.StatusTemporaryRedirect)
}
