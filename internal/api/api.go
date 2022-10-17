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

	// TODO: Configurable CORS origins
	api.handler = handlers.CORS(handlers.AllowedOrigins([]string{"*"}), handlers.AllowedHeaders([]string{"Auth0-Client", "Content-Type"}), handlers.AllowedMethods([]string{http.MethodGet, http.MethodHead, http.MethodPost, http.MethodPut, http.MethodPatch, http.MethodDelete}))(HandlerFromMux(api, router))

	return api
}

func (a *API) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	a.handler.ServeHTTP(w, r)
}

func (a *API) GetSearch(w http.ResponseWriter, r *http.Request, params GetSearchParams) (*SummaryPage, *Error) {
	page := Page{
		Count:    100,
		Next:     nil,
		Page:     0,
		PageSize: 25,
		Previous: nil,
	}

	result := &SummaryPage{
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
				CreatedAt:        time.Now(),
				Id:               "",
				Name:             "foo/bar",
				Slug:             "foo/bar",
				ShortDescription: "A Debian-based Linux operating system based on free software.",
				PullCount:        100,
				StarCount:        150,
				UpdatedAt:        time.Now(),
			},
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
				CreatedAt:        time.Now(),
				Id:               "",
				Name:             "foo/bar",
				Slug:             "foo/bar",
				ShortDescription: "A Debian-based Linux operating system based on free software.",
				PullCount:        100,
				StarCount:        150,
				UpdatedAt:        time.Now(),
			},
		},
	}

	return result, nil
}

func (a *API) GetRepositories(w http.ResponseWriter, r *http.Request, namespace string, params GetRepositoriesParams) (*RepositoryPage, *Error) {
	page := Page{
		Count:    1,
		Next:     nil,
		Page:     0,
		Previous: nil,
		PageSize: 25,
	}

	repositories := []Repository{
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

	result := &RepositoryPage{
		Page:    page,
		Results: repositories,
	}

	return result, nil
}

func (a *API) GetRepository(w http.ResponseWriter, r *http.Request, namespace string, repository string) (*RepositoryWithDetails, *Error) {
	affiliation := "owner"
	result := &RepositoryWithDetails{
		Repository: Repository{
			DateRegistered: time.Now(),
			IsPrivate:      false,
			LastUpdated:    time.Now(),
			Name:           "Foo",
			Namespace:      "Bar",
			PullCount:      100,
			StarCount:      10,
			Status:         1,
			Affiliation:    &affiliation,
		},
		Description:     "A little repo",
		FullDescription: "# Hello!",
		HubUser:         "foo",
	}
	return result, nil
}

func (a *API) PatchRepository(w http.ResponseWriter, r *http.Request, namespace string, repository string) (*RepositoryWithDetails, *Error) {
	affiliation := "owner"
	result := &RepositoryWithDetails{
		Repository: Repository{
			DateRegistered: time.Now(),
			IsPrivate:      false,
			LastUpdated:    time.Now(),
			Name:           "Foo",
			Namespace:      "Bar",
			PullCount:      100,
			StarCount:      10,
			Status:         1,
			Affiliation:    &affiliation,
		},
		Description:     "A little repo",
		FullDescription: "# Hello!",
		HubUser:         "foo",
	}
	return result, nil
}

func (a *API) DeleteRepository(w http.ResponseWriter, r *http.Request, namespace string, repository string) *Error {
	// TODO: won't include content type from result, right?
	// One solution is to wrap http.ResponseWriter and pick the status from WriteHeader without writing it
	w.WriteHeader(http.StatusAccepted)
	return nil
}

func (a *API) GetDockerfile(w http.ResponseWriter, r *http.Request, namespace string, repository string) (*Dockerfile, *Error) {
	return nil, &Error{
		Message: "not implemented",
		Status:  http.StatusNotImplemented,
	}
}

func (a *API) GetTags(w http.ResponseWriter, r *http.Request, namespace string, repository string, params GetTagsParams) (*TagPage, *Error) {
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

	result := &TagPage{
		Page: page,
		Results: []Tag{
			tag,
		},
	}
	return result, nil
}

func (a *API) GetTag(w http.ResponseWriter, r *http.Request, namespace string, repository string, tag string) (*Tag, *Error) {
	result := &Tag{
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
	return result, nil
}

func (a *API) GetImages(w http.ResponseWriter, r *http.Request, namespace string, repository string, tag string) ([]ImageWithDetails, *Error) {
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
	return result, nil
}

func (a *API) GetOrganization(w http.ResponseWriter, r *http.Request, organization string) (*Organization, *Error) {
	result := &Organization{
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
	return result, nil
}

func (a *API) GetOrganizations(w http.ResponseWriter, r *http.Request, params GetOrganizationsParams) (*OrganizationsPage, *Error) {
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

	result := &OrganizationsPage{
		Page: page,
		Results: []Organization{
			organization,
		},
	}

	return result, nil
}

func (a *API) PostRepositories(w http.ResponseWriter, r *http.Request) (*Repository, *Error) {
	var repository Repository
	if err := json.NewDecoder(r.Body).Decode(&repository); err != nil {
		return nil, &Error{
			Message: err.Error(),
			Status:  http.StatusBadRequest,
		}
	}
	// TODO: won't include content type from result, right?
	// One solution is to wrap http.ResponseWriter and pick the status from WriteHeader without writing it
	w.WriteHeader(http.StatusCreated)
	return &repository, nil
}

func (a *API) GetCurrentUser(w http.ResponseWriter, r *http.Request) (*User, *Error) {
	result := &User{
		Company:    "test",
		DateJoined: time.Now(),
		FullName:   "Bla Bla",
		Id:         "",
		Location:   "Sweden",
		ProfileUrl: "http://example.com",
		Type:       "org-type",
		Username:   "test-user",
	}
	return result, nil
}

func (a *API) UpdateCurrentUser(w http.ResponseWriter, r *http.Request) (*User, *Error) {
	var update UserUpdate
	if err := json.NewDecoder(r.Body).Decode(&update); err != nil {
		return nil, &Error{
			Message: err.Error(),
			Status:  http.StatusBadRequest,
		}
	}

	result := &User{
		Company:    "test",
		DateJoined: time.Now(),
		FullName:   "Bla Bla",
		Id:         "",
		Location:   "Sweden",
		ProfileUrl: "http://example.com",
		Type:       "org-type",
		Username:   "test-user",
	}
	return result, nil
}

func (a *API) GetUser(w http.ResponseWriter, r *http.Request, user string) (*User, *Error) {
	result := &User{
		Company:    "test",
		DateJoined: time.Now(),
		FullName:   "Bla Bla",
		Id:         "",
		Location:   "Sweden",
		ProfileUrl: "http://example.com",
		Type:       "org-type",
		Username:   "test-user",
	}
	return result, nil
}

func (a *API) GetUserStarred(w http.ResponseWriter, r *http.Request, user string, params GetUserStarredParams) (*RepositoryPage, *Error) {
	page := Page{
		Count:    1,
		Next:     nil,
		Page:     0,
		Previous: nil,
		PageSize: 25,
	}

	repositories := []Repository{
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

	result := &RepositoryPage{
		Page:    page,
		Results: repositories,
	}

	return result, nil
}

func (a *API) GetUserContributed(w http.ResponseWriter, r *http.Request, user string, params GetUserContributedParams) (*RepositoryPage, *Error) {
	page := Page{
		Count:    1,
		Next:     nil,
		Page:     0,
		Previous: nil,
		PageSize: 25,
	}

	repositories := []Repository{
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

	result := &RepositoryPage{
		Page:    page,
		Results: repositories,
	}

	return result, nil
}

func (a *API) CreateAccessToken(w http.ResponseWriter, r *http.Request) (*Token, *Error) {
	token := "beluga_pat_0hlJIJwMtum2YF16nNc6zxfHmwx3wzSo9j0iVkI8uRk"
	result := &Token{
		TokenLabel: "test-token",
		Token:      &token,
		Scopes:     []string{"repo:admin"},
	}
	return result, nil
}

func (a *API) GetAccessTokens(w http.ResponseWriter, r *http.Request) (*TokenPage, *Error) {
	result := &TokenPage{
		Page:        Page{},
		ActiveCount: 1,
		Results: []Token{
			{
				Uuid:       "token-a",
				TokenLabel: "test-token",
				IsActive:   true,
				Scopes:     []string{"repo:admin"},
			},
			{
				Uuid:       "token-b",
				TokenLabel: "test-token",
				IsActive:   false,
				Scopes:     []string{"repo:admin"},
			},
		},
	}
	return result, nil
}
