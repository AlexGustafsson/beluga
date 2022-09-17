package logging

import (
	"io"
	"strings"

	"github.com/sirupsen/logrus"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// LogrusAdapter implements logrus.Hook to send logs to a Logger.
type LogrusAdapter struct {
	log Logger
}

func NewLogrusAdapter(log Logger) *LogrusAdapter {
	return &LogrusAdapter{
		log: log,
	}
}

// AdaptLogrus applies a log adapter to logrus.
func AdaptLogrus(log Logger) {
	// Skip the hook wrapper when logging callers
	// TODO: This feels a bit dangerous. Logrus can technically change the depth without changing the API, so it can
	// occur in patch versions. Unfortunately there doesn't seem to be a good way of setting the caller manually with
	// information received in the logrus entry.
	adapter := NewLogrusAdapter(log.WithOptions(zap.AddCallerSkip(7)))
	logrus.AddHook(adapter)
	logrus.SetOutput(io.Discard)
}

// Levels returns all levels.
func (a *LogrusAdapter) Levels() []logrus.Level {
	return logrus.AllLevels
}

// Fire logs the message using the configured logger.
func (a *LogrusAdapter) Fire(entry *logrus.Entry) error {
	fields := make([]zapcore.Field, 0)
	for k, v := range entry.Data {
		// Logrus typically has keys delimited with periods, remove this and format camel case
		parts := strings.Split(k, ".")
		for i := 1; i < len(parts); i++ {
			parts[i] = strings.ToUpper(parts[i][0:1]) + parts[i][1:]
		}
		k = strings.Join(parts, "")
		fields = append(fields, zap.Any(k, v))
	}

	switch entry.Level {
	case logrus.TraceLevel:
		fallthrough
	case logrus.DebugLevel:
		a.log.Debug(entry.Message, fields...)
	case logrus.InfoLevel:
		a.log.Info(entry.Message, fields...)
	case logrus.WarnLevel:
		a.log.Warn(entry.Message, fields...)
	case logrus.ErrorLevel:
		a.log.Error(entry.Message, fields...)
	case logrus.PanicLevel:
		fallthrough
	case logrus.FatalLevel:
		a.log.Fatal(entry.Message, fields...)
	}

	return nil
}
