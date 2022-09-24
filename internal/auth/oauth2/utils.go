package oauth2

import (
	"crypto/rand"
	"encoding/base64"
)

func GenerateCode() (string, error) {
	var buffer [32]byte
	if _, err := rand.Read(buffer[:]); err != nil {
		return "", err
	}

	return base64.RawURLEncoding.EncodeToString(buffer[:]), nil
}
