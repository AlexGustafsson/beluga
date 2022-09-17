package api

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/AlexGustafsson/beluga/internal/logging"
	"github.com/AlexGustafsson/beluga/internal/store"
	"github.com/gorilla/mux"
)

//go:generate oapi-codegen --config ../../oapi-codegen.yaml ../../openapi.yaml

type API struct {
	store   *store.Store
	log     logging.Logger
	handler http.Handler
}

func New(store *store.Store, log logging.Logger) *API {
	api := &API{
		store: store,
		log:   log,
	}

	api.handler = HandlerFromMux(api, mux.NewRouter())

	return api
}

func (a *API) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	a.handler.ServeHTTP(w, r)
}

func (a *API) GetSearch(w http.ResponseWriter, r *http.Request, params GetSearchParams) {

}

func (a *API) GetRepositories(w http.ResponseWriter, r *http.Request, namespace string) {
	repositories, err := a.store.ListRepositories(namespace)
	if err != nil {
		httpError(w, fmt.Errorf("internal server error"), 500)
		return
	}

	result := make([]Repository, 0, len(repositories))
	for _, repository := range repositories {
		result = append(result, Repository{
			Namespace: repository.Namespace,
			Name:      repository.Name,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func (a *API) GetRepository(w http.ResponseWriter, r *http.Request, namespace string, repository string) {

}

func (a *API) GetDockerfile(w http.ResponseWriter, r *http.Request, namespace string, repository string) {

}

func (a *API) GetTags(w http.ResponseWriter, r *http.Request, namespace string, repository string) {

}

func (a *API) GetImages(w http.ResponseWriter, r *http.Request, namespace string, repository string, tag string) {

}

func (a *API) GetOrganization(w http.ResponseWriter, r *http.Request, organization string) {

}

func (a *API) GetUser(w http.ResponseWriter, r *http.Request, user string) {

}
