package services

import (
	"fmt"
	"regexp"
	"strings"
	"unicode"

	"gorm.io/gorm"
	"reportase-foto/backend/internal/models"
)

var nonSlug = regexp.MustCompile(`[^a-z0-9]+`)

func Slugify(input string) string {
	var b strings.Builder
	for _, r := range strings.ToLower(strings.TrimSpace(input)) {
		if r <= unicode.MaxASCII {
			b.WriteRune(r)
		}
	}
	slug := strings.Trim(nonSlug.ReplaceAllString(b.String(), "-"), "-")
	if slug == "" {
		return "berita"
	}
	return slug
}

func UniqueSlug(db *gorm.DB, title string, excludeID uint) (string, error) {
	base := Slugify(title)
	candidate := base
	for suffix := 2; ; suffix++ {
		var count int64
		query := db.Model(&models.News{}).Where("slug = ?", candidate)
		if excludeID > 0 {
			query = query.Where("id <> ?", excludeID)
		}
		if err := query.Count(&count).Error; err != nil {
			return "", err
		}
		if count == 0 {
			return candidate, nil
		}
		candidate = fmt.Sprintf("%s-%d", base, suffix)
	}
}
