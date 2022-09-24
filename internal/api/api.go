package api

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/AlexGustafsson/beluga/internal/auth"
	"github.com/AlexGustafsson/beluga/internal/logging"
	"github.com/AlexGustafsson/beluga/internal/store"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

//go:generate oapi-codegen --config ../../oapi-codegen.yaml ../../openapi.yaml

type API struct {
	store      *store.Store
	log        logging.Logger
	handler    http.Handler
	authorizer *auth.Authorizer
}

func New(store *store.Store, log logging.Logger) *API {
	api := &API{
		store:      store,
		log:        log,
		authorizer: auth.NewAuthorizer(log),
	}

	router := mux.NewRouter()
	router.HandleFunc("/authorize", api.Authorize).Methods(http.MethodGet)
	router.HandleFunc("/oauth/token", api.Token).Methods(http.MethodPost)
	router.HandleFunc("/v2/logout", api.Logout).Methods(http.MethodGet)

	api.handler = handlers.CORS(handlers.AllowedOrigins([]string{"*"}), handlers.AllowedHeaders([]string{"Auth0-Client", "Content-Type"}))(HandlerFromMux(api, router))

	return api
}

func (a *API) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	a.handler.ServeHTTP(w, r)
}

func (a *API) GetSearch(w http.ResponseWriter, r *http.Request, params GetSearchParams) {
	page := Page{
		Count:    100,
		Next:     nil,
		Page:     0,
		PageSize: 25,
		Previous: nil,
	}

	result := SummaryPage{
		Page: page,
		Summaries: []Summary{
			{
				Architectures: []Label{
					{
						Label: "amd64",
						Name:  "amd64",
					},
				},
				Categories: []Label{
					{
						Label: "image",
						Name:  "image",
					},
				},
				CreatedAt: time.Now(),
				Id:        "",
				Name:      "foo/bar",
				Slug:      "foo/bar",
			},
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func (a *API) GetRepositories(w http.ResponseWriter, r *http.Request, namespace string) {
	result := []Repository{
		{
			DateRegistered: time.Now(),
			IsPrivate:      false,
			LastUpdated:    time.Now(),
			Name:           "Foo",
			Namespace:      "Bar",
			PullCount:      100,
			StarCount:      10,
			Status:         1,
		},
		{
			DateRegistered: time.Now(),
			IsPrivate:      false,
			LastUpdated:    time.Now(),
			Name:           "Test",
			Namespace:      "Test",
			PullCount:      100,
			StarCount:      10,
			Status:         1,
		},
		{
			DateRegistered: time.Now(),
			IsPrivate:      false,
			LastUpdated:    time.Now(),
			Name:           "Bar",
			Namespace:      "Baz",
			PullCount:      100,
			StarCount:      10,
			Status:         1,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func (a *API) GetRepository(w http.ResponseWriter, r *http.Request, namespace string, repository string) {
	result := RepositoryWithDetails{
		Repository: Repository{
			DateRegistered: time.Now(),
			IsPrivate:      false,
			LastUpdated:    time.Now(),
			Name:           "Foo",
			Namespace:      "Bar",
			PullCount:      100,
			StarCount:      10,
			Status:         1,
		},
		Description:     "A little repo",
		FullDescription: "# Hello!",
		HubUser:         "foo",
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func (a *API) GetDockerfile(w http.ResponseWriter, r *http.Request, namespace string, repository string) {

}

func (a *API) GetTags(w http.ResponseWriter, r *http.Request, namespace string, repository string, params GetTagsParams) {
	page := Page{
		Count:    1,
		Next:     nil,
		Page:     0,
		Previous: nil,
		PageSize: 25,
	}

	tag := Tag{
		Creator:  0,
		Digest:   "01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b",
		FullSize: 10000,
		Id:       10,
		Images: []Image{
			{
				Architecture: "amd64",
				Digest:       "01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b",
				LastPulled:   time.Now(),
				LastPushed:   time.Now(),
				Os:           "Darwin",
				Size:         1000,
			},
		},
		LastUpdated:         time.Now(),
		LastUpdatedUsername: "test-user",
		Name:                "latest",
		Repository:          1,
		TagLastPulled:       time.Now(),
		TagLastPushed:       time.Now(),
		V2:                  true,
	}

	result := TagPage{
		Page: page,
		Results: []Tag{
			tag,
		},
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func (a *API) GetTag(w http.ResponseWriter, r *http.Request, namespace string, repository string, tag string) {
	result := Tag{
		Creator:  0,
		Digest:   "01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b",
		FullSize: 10000,
		Id:       10,
		Images: []Image{
			{
				Architecture: "amd64",
				Digest:       "01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b",
				LastPulled:   time.Now(),
				LastPushed:   time.Now(),
				Os:           "Darwin",
				Size:         1000,
			},
		},
		LastUpdated:         time.Now(),
		LastUpdatedUsername: "test-user",
		Name:                "latest",
		Repository:          1,
		TagLastPulled:       time.Now(),
		TagLastPushed:       time.Now(),
		V2:                  true,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func (a *API) GetImages(w http.ResponseWriter, r *http.Request, namespace string, repository string, tag string) {
	image := Image{
		Architecture: "amd64",
		Digest:       "01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b",
		LastPulled:   time.Now(),
		LastPushed:   time.Now(),
		Os:           "Darwin",
		Size:         1000,
	}

	result := []ImageWithDetails{
		{
			Image: image,
			Layers: []Layer{
				{
					Instruction: "CMD echo 'hello world'",
					Size:        1000,
				},
				{
					Instruction: "CMD echo 'hello world'",
					Size:        1000,
				},
				{
					Instruction: "CMD echo 'hello world'",
					Size:        1000,
				},
			},
		},
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func (a *API) GetOrganization(w http.ResponseWriter, r *http.Request, organization string) {
	result := Organization{
		Badge:      "test",
		Company:    "test",
		DateJoined: time.Now(),
		FullName:   "Bla Bla",
		Id:         "",
		IsActive:   true,
		Location:   "Sweden",
		Orgname:    "Org",
		ProfileUrl: "http://example.com",
		Type:       "org-type",
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func (a *API) GetOrganizations(w http.ResponseWriter, r *http.Request, params GetOrganizationsParams) {
	page := Page{
		Count:    100,
		Next:     nil,
		Page:     0,
		PageSize: 25,
		Previous: nil,
	}

	organization := Organization{
		Badge:      "test",
		Company:    "test",
		DateJoined: time.Now(),
		FullName:   "Bla Bla",
		Id:         "",
		IsActive:   true,
		Location:   "Sweden",
		Orgname:    "Org",
		ProfileUrl: "http://example.com",
		Type:       "org-type",
	}

	result := OrganizationsPage{
		Page: page,
		Results: []Organization{
			organization,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func (a *API) PostRepositories(w http.ResponseWriter, r *http.Request) {
	var repository Repository
	if err := json.NewDecoder(r.Body).Decode(&repository); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(repository)
}

func (a *API) GetUser(w http.ResponseWriter, r *http.Request, user string) {
	result := User{
		Company:    "test",
		DateJoined: time.Now(),
		FullName:   "Bla Bla",
		Id:         "",
		Location:   "Sweden",
		ProfileUrl: "http://example.com",
		Type:       "org-type",
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}
