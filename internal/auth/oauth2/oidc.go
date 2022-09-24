package oauth2

import "github.com/golang-jwt/jwt/v4"

type IDTokenClaims struct {
	jwt.RegisteredClaims

	ProfileClaims

	// OIDC claims

	Nonce                               string   `json:"nonce,omitempty"`
	AuthorizedParty                     string   `json:"azp,omitempty"`
	AuthTime                            int64    `json:"auth_time,omitempty"`
	AccessTokenHash                     string   `json:"at_hash,omitempty"`
	CodeHash                            string   `json:"c_hash,omitempty"`
	AuthenticationContextClassReference string   `json:"acr,omitempty"`
	AuthenticationMethodsReference      []string `json:"amr,omitempty"`
	SubjectJWK                          string   `json:"sub_jwk,omitempty"`
	Confirmation                        string   `json:"cnf,omitempty"`
	SessionID                           string   `json:"sid,omitempty"`
	OrganizationID                      string   `json:"org_id,omitempty"`
}

// ProfileClaims contains OIDC profile claims.
type ProfileClaims struct {
	Name                string `json:"name,omitempty"`
	GivenName           string `json:"given_name,omitempty"`
	FamilyName          string `json:"family_name,omitempty"`
	MiddleName          string `json:"middle_name,omitempty"`
	Nickname            string `json:"nickname,omitempty"`
	PreferredUsername   string `json:"preferred_username,omitempty"`
	Profile             string `json:"profile,omitempty"`
	Picture             string `json:"picture,omitempty"`
	Website             string `json:"website,omitempty"`
	Email               string `json:"email,omitempty"`
	EmailVerified       bool   `json:"email_verified"`
	Gender              string `json:"gender,omitempty"`
	BirthDate           string `json:"birthdate,omitempty"`
	ZoneInfo            string `json:"zoneinfo,omitempty"`
	Locale              string `json:"locale,omitempty"`
	PhoneNumber         string `json:"phone_number,omitempty"`
	PhoneNumberVerified bool   `json:"phone_number_verified"`
	Address             string `json:"address,omitempty"`
	UpdatedAt           string `json:"update_at,omitempty"`
}
