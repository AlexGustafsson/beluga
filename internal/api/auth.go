package api

import (
	"net/http"
)

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
