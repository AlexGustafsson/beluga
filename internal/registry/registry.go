package registry

import (
	"context"
	"net/http"

	"github.com/AlexGustafsson/beluga/internal/logging"
	"github.com/distribution/distribution/v3/configuration"
	"github.com/distribution/distribution/v3/registry"
	"github.com/distribution/distribution/v3/registry/auth"
	_ "github.com/distribution/distribution/v3/registry/storage/driver/filesystem" // Include filesystem storage driver
	"github.com/docker/go-events"
)

type Registry struct {
	registry *registry.Registry
	log      logging.Logger
}

func New(ctx context.Context, path string, log logging.Logger, sinks ...events.Sink) (*Registry, error) {
	// https://docs.docker.com/registry/configuration/
	config := &configuration.Configuration{}
	config.Version = "0.1"
	config.Log.Level = "info"
	config.Log.Formatter = "text"
	config.Storage = configuration.Storage{
		"filesystem": configuration.Parameters{
			"rootdirectory": path,
			"maxthreads":    5,
		},
	}
	config.Auth = configuration.Auth{
		"beluga": configuration.Parameters{
			"foo": "bar",
		},
	}
	config.HTTP.Addr = ":8081"
	config.HTTP.Secret = "tempsecret"
	config.HTTP.Debug.Addr = ":8082"
	config.HTTP.Debug.Prometheus.Enabled = true
	config.HTTP.Debug.Prometheus.Path = "/metrics"
	config.Log.Formatter = "json"
	// Doesn't use logrus - prints directly to stdout which is not nice.
	// Use a custom access logger instead which unfortunately lacks identities
	// right now
	config.Log.AccessLog.Disabled = true
	auth.Register("beluga", func(options map[string]interface{}) (auth.AccessController, error) {
		return &Authorizer{}, nil
	})
	// TODO: Use redirect for S3?

	registry, err := registry.NewRegistry(ctx, config, sinks...)
	if err != nil {
		return nil, err
	}

	return &Registry{
		registry: registry,
		log:      log,
	}, nil
}

func (r *Registry) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	r.registry.ServeHTTP(w, req)
}
