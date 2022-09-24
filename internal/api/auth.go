package api

import (
	"net/http"
)

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

// TODO: prior to this we need to authenticate
func (a *API) Authorize(w http.ResponseWriter, r *http.Request) {
	a.authorizer.Authorize(w, r)
}

func (a *API) Token(w http.ResponseWriter, r *http.Request) {
	a.authorizer.Token(w, r)
}

func (a *API) Logout(w http.ResponseWriter, r *http.Request) {
	a.authorizer.Logout(w, r)
}
