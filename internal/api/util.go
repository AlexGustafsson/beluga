package api

import (
	"encoding/json"
	"net/http"
)

type httpErrorOption func(err *Error)

func withInfo(key string, value any) httpErrorOption {
	return func(err *Error) {
		err.Errinfo[key] = value
	}
}

func httpError(w http.ResponseWriter, err error, code int, options ...httpErrorOption) {
	result := &Error{
		Errinfo: make(map[string]any),
		Message: err.Error(),
	}

	for _, option := range options {
		option(result)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}
