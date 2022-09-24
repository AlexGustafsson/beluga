package oauth2

import (
	"crypto/rsa"
	"crypto/sha256"
	"encoding/base64"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

const (
	DefaultTokenLifetime time.Duration = 30 * time.Second
)

type Token struct {
	AccessToken  string
	IDToken      string
	RefreshToken string
	Scope        string
	Lifetime     time.Duration
}

type Session struct {
	ID            string
	ClientID      string
	ProfileClaims ProfileClaims
	AuthCode      string
	AuthTime      time.Time
	Scope         string
	Issuer        string
	Subject       string
	SigningKey    *rsa.PrivateKey
	Nonce         string
}

func (s *Session) NewToken() (*Token, error) {
	accessToken, err := GenerateCode()
	if err != nil {
		return nil, err
	}

	refreshToken, err := GenerateCode()
	if err != nil {
		return nil, err
	}

	accessTokenSum := sha256.Sum256([]byte(accessToken))
	accessTokenHash := base64.RawURLEncoding.EncodeToString(accessTokenSum[0:16])

	authCodeSum := sha256.Sum256([]byte(s.AuthCode))
	authCodeHash := base64.RawURLEncoding.EncodeToString(authCodeSum[0:16])

	now := time.Now()
	tokenExpiry := now.Add(DefaultTokenLifetime)

	idTokenClaims := &IDTokenClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			Audience:  jwt.ClaimStrings{s.ClientID},
			ExpiresAt: jwt.NewNumericDate(tokenExpiry),
			IssuedAt:  jwt.NewNumericDate(now),
			Issuer:    s.Issuer,
			NotBefore: jwt.NewNumericDate(now),
			Subject:   s.Subject,
		},

		ProfileClaims: s.ProfileClaims,

		Nonce:           s.Nonce,
		AuthorizedParty: s.ClientID,
		AuthTime:        s.AuthTime.Unix(),
		AccessTokenHash: accessTokenHash,
		CodeHash:        authCodeHash,
		SessionID:       s.ID,
	}

	idToken := jwt.NewWithClaims(jwt.SigningMethodRS256, idTokenClaims)
	idTokenString, err := idToken.SignedString(s.SigningKey)
	if err != nil {
		return nil, err
	}

	token := &Token{
		AccessToken:  accessToken,
		IDToken:      idTokenString,
		RefreshToken: refreshToken,
		Scope:        s.Scope,
		Lifetime:     DefaultTokenLifetime,
	}

	return token, nil
}
