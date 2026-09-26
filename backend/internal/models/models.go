package models

import "time"

type User struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	Name         string    `json:"name" gorm:"size:120;not null"`
	Email        string    `json:"email" gorm:"size:190;uniqueIndex;not null"`
	PasswordHash string    `json:"-" gorm:"size:255;not null"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type News struct {
	ID             uint      `json:"id" gorm:"primaryKey"`
	Title          string    `json:"title" gorm:"size:240;not null"`
	Slug           string    `json:"slug" gorm:"size:260;uniqueIndex;not null"`
	Summary        string    `json:"summary" gorm:"type:text;not null"`
	Content        string    `json:"content" gorm:"type:text;not null"`
	FeaturedImage  string    `json:"featured_image" gorm:"size:500"`
	ImageCaption   string    `json:"image_caption" gorm:"size:500"`
	Category       string    `json:"category" gorm:"size:100;index;not null"`
	Published      bool      `json:"published" gorm:"default:true;index"`
	CreatedAt      time.Time `json:"created_at" gorm:"index"`
	UpdatedAt      time.Time `json:"updated_at"`
}
