package store

import (
	"fmt"
	"strings"

	"github.com/AlexGustafsson/beluga/internal/logging"
	"github.com/distribution/distribution/v3/notifications"
	"github.com/docker/go-events"
	"go.uber.org/zap"
)

// TODO: This should listen for changes and use the docker API to get all information
// and act accordingly. The events simply don't contain enough information.
// Better yet would probably be to modify the notifications so that they do contain
// all information - how does the filesystem storage driver work? Surely it must
// know everything - can we hook in there?

// StoreAdapter implements events.Sink
type StoreAdapter struct {
	store *Store
	log   logging.Logger
}

func NewStoreAdapter(store *Store, log logging.Logger) *StoreAdapter {
	return &StoreAdapter{
		store: store,
		log:   log,
	}
}

func (l *StoreAdapter) Write(event events.Event) error {
	e, ok := event.(notifications.Event)
	if !ok {
		l.log.Error("Unhandled event - not of the event type")
		return nil
	}

	l.log.Debug("StoreAdapter got event", zap.String("action", e.Action), zap.Any("target", e.Target))

	switch e.Action {
	case notifications.EventActionPull:
	case notifications.EventActionPush:
		owner, repository, ok := strings.Cut(e.Target.Repository, "/")
		if !ok {
			err := fmt.Errorf("expected owner/repository")
			l.log.Error("Push event had bad repository format", zap.Error(err))
			return err
		}

		arch := ""
		os := ""
		if e.Target.Platform != nil {
			arch = e.Target.Platform.Architecture
			os = e.Target.Platform.OS
		}

		l.store.CreateRepository(owner, repository)
		l.store.CreateImage(owner, repository, e.Target.Digest.String(), e.Target.Size, e.Target.Tag, arch, os)
	case notifications.EventActionMount:
	case notifications.EventActionDelete:
		l.store.DeleteImage(e.Target.Digest.String())
	}

	return nil
}

// Close the sink, possibly waiting for pending events to flush.
func (l *StoreAdapter) Close() error {
	return nil
}
