package oauth2

import (
	"crypto/rand"
	"encoding/hex"
)

func GenerateCode() (string, error) {
	var buffer [32]byte
	if _, err := rand.Read(buffer[:]); err != nil {
		return "", err
	}

	return hex.EncodeToString(buffer[:]), nil
}
