package registry

import (
	"context"
	"encoding/base64"
	"fmt"
	"net/http"
	"strings"

	dcontext "github.com/distribution/distribution/v3/context"
	"github.com/distribution/distribution/v3/registry/auth"
	_ "github.com/distribution/distribution/v3/registry/storage/driver/filesystem" // Include filesystem
)

type Challenge struct {
	err    error
	status int
}

func (c *Challenge) Error() string {
	return c.err.Error()
}

func (c *Challenge) SetHeaders(r *http.Request, w http.ResponseWriter) {
	// TODO: Docker uses www-authenticate: Bearer realm="https://auth.docker.io/token",service="registry.docker.io",scope="registry:catalog:*"
	w.Header().Add("WWW-Authenticate", "Basic")
}

func (c *Challenge) Status() int {
	return c.status
}

type Authorizer struct{}

func (a *Authorizer) Authorized(ctx context.Context, access ...auth.Access) (context.Context, error) {
	req, err := dcontext.GetRequest(ctx)
	if err != nil {
		return nil, err
	}

	authorizationHeader := req.Header.Get("Authorization")
	if authorizationHeader == "" {
		return nil, &Challenge{
			err:    fmt.Errorf("no auth set"),
			status: http.StatusUnauthorized,
		}
	}

	scheme, credentials, ok := strings.Cut(authorizationHeader, " ")
	if !ok || scheme != "Basic" {
		return nil, &Challenge{
			err:    fmt.Errorf("invalid auth scheme"),
			status: http.StatusBadRequest,
		}
	}

	credentialsBytes, err := base64.RawStdEncoding.DecodeString(credentials)
	if err != nil {
		return nil, &Challenge{
			err:    err,
			status: http.StatusBadRequest,
		}
	}
	credentials = string(credentialsBytes)

	if credentials != "test:test" {
		return nil, &Challenge{
			err:    fmt.Errorf("invalid credentials"),
			status: http.StatusUnauthorized,
		}
	}

	// TODO: Don't allow pushing non-existing repositories?

	return auth.WithUser(ctx, auth.UserInfo{Name: "test"}), nil
}
