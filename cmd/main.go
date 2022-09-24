package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"

	"github.com/AlexGustafsson/beluga/internal/api"
	"github.com/AlexGustafsson/beluga/internal/logging"
	"github.com/AlexGustafsson/beluga/internal/registry"
	"github.com/AlexGustafsson/beluga/internal/store"
	"github.com/docker/go-metrics"
	"go.uber.org/zap"
)

func main() {
	log, err := logging.NewLogger(true)
	if err != nil {
		panic(err)
	}
	// Adapt logrus logs used by the Docker registry
	logging.AdaptLogrus(log)

	ctx := context.Background()

	dataStore, err := store.Open("db")
	if err != nil {
		log.Fatal("Failed to open database", zap.Error(err))
	}
	defer dataStore.Close()
	adapter := store.NewStoreAdapter(dataStore, log)

	log.Debug("Creating registry")
	registry, err := registry.New(ctx, ".", log, adapter)
	if err != nil {
		panic(err)
	}

	api := api.New(dataStore, log)

	mux := http.NewServeMux()
	mux.Handle("/v2/repositories", api)
	mux.Handle("/v2/repositories/", api)
	mux.Handle("/v2/orgs", api)
	mux.Handle("/v2/orgs/", api)
	mux.Handle("/v2/users/", api)
	mux.Handle("/api/", api)
	mux.Handle("/authorize", api)
	mux.Handle("/oauth/token", api)
	mux.Handle("/v2/logout", api)
	mux.Handle("/v2/", registry)
	mux.Handle("/metrics", metrics.Handler())

	// TODO: Handle graceful shutdown
	go func() {
		http.ListenAndServe(":8081", mux)
	}()

	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt)

	<-interrupt

	log.Info("Shutting down")
}
