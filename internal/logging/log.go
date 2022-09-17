package logging

import (
	"context"
	"runtime"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// Documentation of some Logger fields is under a MIT license.
// See: https://github.com/uber-go/zap

type Logger interface {
	// With creates a child logger and adds structured context to it. Fields added
	// to the child don't affect the parent, and vice versa.
	With(fields ...zapcore.Field) Logger
	// WithContext creates a child logger and adds contextual information to it.
	WithContext(ctx context.Context) Logger
	// WithOptions clones the current Logger, applies the supplied Options, and returns the resulting Logger. It's safe to use concurrently.
	WithOptions(opts ...zap.Option) Logger
	// Sync calls the underlying Core's Sync method, flushing any buffered log
	// entries. Applications should take care to call Sync before exiting.
	Sync() error
	// Fatal logs a message at FatalLevel. The message includes any fields passed
	// at the log site, as well as any fields accumulated on the logger.
	//
	// The logger then calls os.Exit(1), even if logging at FatalLevel is
	// disabled.
	Fatal(msg string, fields ...zapcore.Field)
	// Error logs a message at ErrorLevel. The message includes any fields passed
	// at the log site, as well as any fields accumulated on the logger.
	Error(msg string, fields ...zapcore.Field)
	// Warn logs a message at WarnLevel. The message includes any fields passed
	// at the log site, as well as any fields accumulated on the logger.
	Warn(msg string, fields ...zapcore.Field)
	// Info logs a message at InfoLevel. The message includes any fields passed
	// at the log site, as well as any fields accumulated on the logger.
	Info(msg string, fields ...zapcore.Field)
	// Debug logs a message at DebugLevel. The message includes any fields passed
	// at the log site, as well as any fields accumulated on the logger.
	Debug(msg string, fields ...zapcore.Field)
}

type logger struct {
	*zap.Logger
}

type traceIdKeyType struct{}

var traceIdKey = traceIdKeyType{}

func (l *logger) With(fields ...zapcore.Field) Logger {
	return &logger{Logger: l.Logger.With(fields...)}
}

func (l *logger) WithContext(ctx context.Context) Logger {
	traceIdValue := ctx.Value(traceIdKey)
	if traceIdValue == nil {
		return l
	} else {
		traceId := traceIdValue.(string)
		return &logger{Logger: l.Logger.With(zap.String("traceId", traceId))}
	}
}

func (l *logger) WithOptions(opts ...zap.Option) Logger {
	return &logger{Logger: l.Logger.WithOptions(opts...)}
}

func createConfig(verbose bool) (*zap.Logger, error) {
	if verbose {
		return zap.NewDevelopmentConfig().Build()
	}

	return zap.NewProductionConfig().Build()
}

// NewLogger returns a new logger.
func NewLogger(verbose bool) (Logger, error) {
	log, err := createConfig(verbose)
	if err != nil {
		return nil, err
	}

	// Docker adds the go version to all logs, enfore them to be added to all logs for consistency
	log = log.With(zap.String("goVersion", runtime.Version()))

	return &logger{Logger: log}, nil
}

// WrapWithTraceID wraps a context with a log trace id.
func WrapWithTraceID(ctx context.Context, traceId string) context.Context {
	return context.WithValue(ctx, traceIdKey, traceId)
}

// GetTraceID returns the trace id of the context, if any.
func GetTraceID(ctx context.Context) (string, bool) {
	traceIdValue := ctx.Value(traceIdKey)
	if traceIdValue == nil {
		return "", false
	} else {
		return traceIdValue.(string), true
	}
}
