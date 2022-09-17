package store

import (
	"fmt"
	"time"

	"github.com/timshannon/badgerhold"
)

type Store struct {
	store *badgerhold.Store
}

type Repository struct {
	Affiliation    *string
	DateRegistered time.Time
	IsPrivate      bool
	LastUpdated    time.Time
	MediaTypes     []string
	Name           string
	Namespace      string
	PullCount      int
	RepositoryType *string
	StarCount      int
	Status         int
}

type Image struct {
	Namespace    string
	Repository   string
	Architecture string
	Digest       string
	Features     *string
	LastPulled   time.Time
	LastPushed   time.Time
	Os           string
	OsFeatures   string
	OsVersion    *string
	Size         int64
	Status       string
	Variant      *string
}

func Open(path string) (*Store, error) {
	options := badgerhold.DefaultOptions
	options.Dir = path
	options.ValueDir = path

	store, err := badgerhold.Open(options)
	if err != nil {
		return nil, err
	}

	return &Store{
		store: store,
	}, nil
}

func (s *Store) Close() error {
	return s.store.Close()
}

func (s *Store) CreateRepository(namespace string, name string) error {
	return s.store.Insert(fmt.Sprintf("repository/%s/%s", namespace, name), &Repository{
		Namespace: namespace,
		Name:      name,
	})
}

func (s *Store) CreateImage(namespace string, repository string, digest string, size int64, tag string, architecture string, os string) error {
	return s.store.Insert(fmt.Sprintf("image/%s", digest), &Image{
		Namespace:    namespace,
		Repository:   repository,
		Digest:       digest,
		Size:         size,
		Architecture: architecture,
		Os:           os,
	})
}

func (s *Store) DeleteImage(digest string) error {
	return s.store.Delete(fmt.Sprintf("image/%s", digest), &Image{})
}

func (s *Store) ListRepositories(namespace string) ([]*Repository, error) {
	var result []*Repository
	if err := s.store.Find(&result, badgerhold.Where("Namespace").Eq(namespace)); err != nil {
		return nil, err
	}

	return result, nil
}

func (s *Store) GetRepository(owner string, repository string) (*Repository, error) {
	var result *Repository
	return result, s.store.Get(fmt.Sprintf("repository/%s/%s", owner, repository), &result)
}

func (s *Store) GetImage(digest string) (*Image, error) {
	var result *Image
	return result, s.store.Get(fmt.Sprintf("image/%s", digest), &result)
}

func (s *Store) ListImages(owner string, repository string) ([]*Image, error) {
	var result []*Image
	if err := s.store.Find(&result, badgerhold.Where("Owner").Eq(owner).And("Repository").Eq(repository)); err != nil {
		return nil, err
	}

	return result, nil
}
