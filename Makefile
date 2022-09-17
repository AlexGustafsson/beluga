.PHONY: build generate lint spectral storepatch generate-clients generate-typescript-client

build:
	go build -o beluga ./cmd/*.go

# TODO: strict gorilla not released. Merged to master 2022-08-12
# go install github.com/deepmap/oapi-codegen/cmd/oapi-codegen@9c600dddea334bff2fa527dd14af1aa2900917a8
generate:
	go generate ./...

lint: spectral

# yarn global add @stoplight/spectral-cli
spectral:
	spec

storepatch:
	GIT_DIR=distribution/.git git diff > distribution.patch

generate-clients: generate-typescript-client

generate-typescript-client:
	npx openapi-typescript-codegen --input openapi.yaml --output clients/typescript --client fetch --indent 2 --name ApiClient
