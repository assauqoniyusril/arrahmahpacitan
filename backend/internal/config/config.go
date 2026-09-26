package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"
)

type Config struct {
	Environment   string
	AppPort      string
	FrontendURL  string
	DBHost       string
	DBPort       string
	DBUser       string
	DBPassword   string
	DBName       string
	DBSSLMode    string
	JWTSecret    string
	JWTTTL        time.Duration
	AdminName    string
	AdminEmail   string
	AdminPassword string
	UploadDir    string
	MaxUploadMB  int64
}

func Load() Config {
	ttlHours := int64Value("JWT_TTL_HOURS", 24)
	return Config{
		Environment:   value("GO_ENV", "development"),
		AppPort:      value("APP_PORT", "8005"),
		FrontendURL:  value("FRONTEND_URL", "http://localhost:3004"),
		DBHost:       value("DB_HOST", "localhost"),
		DBPort:       value("DB_PORT", "5432"),
		DBUser:       value("DB_USER", "reportase"),
		DBPassword:   value("DB_PASSWORD", "reportase"),
		DBName:       value("DB_NAME", "reportase_foto"),
		DBSSLMode:    value("DB_SSLMODE", "disable"),
		JWTSecret:    value("JWT_SECRET", "development-secret-change-me"),
		JWTTTL:        time.Duration(ttlHours) * time.Hour,
		AdminName:    value("ADMIN_NAME", "T Dedy Prastyo"),
		AdminEmail:   value("ADMIN_EMAIL", "[EMAIL_ADDRESS]"),
		AdminPassword: value("ADMIN_PASSWORD", "55c3a05e"),
		UploadDir:    value("UPLOAD_DIR", "./uploads"),
		MaxUploadMB:  int64Value("MAX_UPLOAD_MB", 10),
	}
}

func (c Config) DSN() string {
	return fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=Asia/Jakarta", c.DBHost, c.DBUser, c.DBPassword, c.DBName, c.DBPort, c.DBSSLMode)
}

func (c Config) Validate() error {
	if c.Environment == "production" {
		if len(c.JWTSecret) < 32 || c.JWTSecret == "development-secret-change-me" {
			return fmt.Errorf("JWT_SECRET must contain at least 32 characters in production")
		}
		if len(c.AdminPassword) < 12 || c.AdminPassword == "admin12345" {
			return fmt.Errorf("ADMIN_PASSWORD must contain at least 12 characters in production")
		}
		if strings.Contains(c.DBPassword, "change-this") || c.DBPassword == "reportase" {
			return fmt.Errorf("DB_PASSWORD must be changed for production")
		}
	}
	return nil
}

func value(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func int64Value(key string, fallback int64) int64 {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}
	parsed, err := strconv.ParseInt(value, 10, 64)
	if err != nil {
		return fallback
	}
	return parsed
}
