package logging

import (
	"fmt"
	"net/http"
	"time"

	"go.uber.org/zap"
)

type responseRecorder struct {
	http.ResponseWriter
	status   int
	bodySize int
}

func (r *responseRecorder) WriteHeader(status int) {
	r.status = status
	r.ResponseWriter.WriteHeader(status)
}

func (r *responseRecorder) Write(data []byte) (int, error) {
	r.bodySize += len(data)
	return r.ResponseWriter.Write(data)
}

func WithAccessLogs(handler http.Handler, log Logger) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		recorder := &responseRecorder{ResponseWriter: w}
		handler.ServeHTTP(recorder, r)
		log.With(
			zap.String("peer", r.RemoteAddr),
			zap.String("identity", "-"),
			zap.String("user", "-"),
			zap.String("method", r.Method),
			zap.String("path", r.URL.Path),
			zap.String("protocol", r.Proto),
			zap.String("userAgent", r.UserAgent()),
			zap.Int("status", recorder.status),
			zap.Duration("duration", time.Since(start)),
			zap.Int("bodySize", recorder.bodySize),
		).Info(fmt.Sprintf("%s %s %s", r.Method, r.URL.Path, r.Proto))
	})
}
