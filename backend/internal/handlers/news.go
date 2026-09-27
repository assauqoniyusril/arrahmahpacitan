package handlers

import (
	"errors"
	"fmt"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"reportase-foto/backend/internal/config"
	"reportase-foto/backend/internal/models"
	"reportase-foto/backend/internal/services"
)

type NewsHandler struct {
	db        *gorm.DB
	uploadDir string
}

func NewNewsHandler(db *gorm.DB, cfg config.Config) *NewsHandler {
	return &NewsHandler{db: db, uploadDir: cfg.UploadDir}
}

type newsInput struct {
	Title         string `json:"title" binding:"required,min=5,max=240"`
	Summary       string `json:"summary" binding:"required,min=10"`
	Content       string `json:"content" binding:"required,min=20"`
	FeaturedImage string `json:"featured_image"`
	ImageCaption  string `json:"image_caption"`
	Category      string `json:"category" binding:"required,max=100"`
	Published     *bool  `json:"published"`
}

func (h *NewsHandler) ListPublic(c *gin.Context) {
	page := positiveInt(c.DefaultQuery("page", "1"), 1)
	limit := positiveInt(c.DefaultQuery("limit", "9"), 9)
	if limit > 50 {
		limit = 50
	}
	search := strings.TrimSpace(c.Query("search"))
	category := strings.TrimSpace(c.Query("category"))

	query := h.db.Model(&models.News{}).Where("published = ?", true)
	if search != "" {
		term := "%" + search + "%"
		query = query.Where("title ILIKE ? OR summary ILIKE ? OR content ILIKE ?", term, term, term)
	}
	if category != "" {
		query = query.Where("LOWER(category) = ?", strings.ToLower(category))
	}

	var total int64
	if err := query.Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "gagal menghitung berita"})
		return
	}
	var news []models.News
	if err := query.Order("created_at DESC").Limit(limit).Offset((page - 1) * limit).Find(&news).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "gagal memuat berita"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": news, "meta": gin.H{"page": page, "limit": limit, "total": total, "total_pages": (total + int64(limit) - 1) / int64(limit)}})
}

func (h *NewsHandler) DetailPublic(c *gin.Context) {
	var article models.News
	if err := h.db.Where("slug = ? AND published = ?", c.Param("slug"), true).First(&article).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "berita tidak ditemukan"})
		return
	}
	var related []models.News
	h.db.Where("published = ? AND id <> ? AND category = ?", true, article.ID, article.Category).Order("created_at DESC").Limit(3).Find(&related)
	c.JSON(http.StatusOK, gin.H{"data": article, "related": related})
}

func (h *NewsHandler) ListAdmin(c *gin.Context) {
	page := positiveInt(c.DefaultQuery("page", "1"), 1)
	limit := positiveInt(c.DefaultQuery("limit", "20"), 20)
	search := strings.TrimSpace(c.Query("search"))
	query := h.db.Model(&models.News{})
	if search != "" {
		term := "%" + search + "%"
		query = query.Where("title ILIKE ? OR category ILIKE ?", term, term)
	}
	var total int64
	query.Count(&total)
	var news []models.News
	if err := query.Order("updated_at DESC").Limit(limit).Offset((page - 1) * limit).Find(&news).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "gagal memuat berita"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": news, "meta": gin.H{"page": page, "limit": limit, "total": total}})
}

func (h *NewsHandler) GetAdmin(c *gin.Context) {
	var article models.News
	if err := h.db.First(&article, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "berita tidak ditemukan"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": article})
}

func (h *NewsHandler) Create(c *gin.Context) {
	var input newsInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "data berita tidak valid", "detail": err.Error()})
		return
	}
	slug, err := services.UniqueSlug(h.db, input.Title, 0)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "gagal membuat slug"})
		return
	}
	published := true
	if input.Published != nil {
		published = *input.Published
	}
	article := models.News{Title: strings.TrimSpace(input.Title), Slug: slug, Summary: strings.TrimSpace(input.Summary), Content: strings.TrimSpace(input.Content), FeaturedImage: input.FeaturedImage, ImageCaption: input.ImageCaption, Category: strings.TrimSpace(input.Category), Published: published}
	if err := h.db.Create(&article).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "gagal menyimpan berita"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": article})
}

func (h *NewsHandler) Update(c *gin.Context) {
	var article models.News
	if err := h.db.First(&article, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "berita tidak ditemukan"})
		return
	}
	var input newsInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "data berita tidak valid", "detail": err.Error()})
		return
	}
	slug := article.Slug
	if strings.TrimSpace(input.Title) != article.Title {
		var err error
		slug, err = services.UniqueSlug(h.db, input.Title, article.ID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "gagal memperbarui slug"})
			return
		}
	}
	published := article.Published
	if input.Published != nil {
		published = *input.Published
	}
	updates := map[string]any{"title": strings.TrimSpace(input.Title), "slug": slug, "summary": strings.TrimSpace(input.Summary), "content": strings.TrimSpace(input.Content), "featured_image": input.FeaturedImage, "image_caption": input.ImageCaption, "category": strings.TrimSpace(input.Category), "published": published}
	if err := h.db.Model(&article).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "gagal memperbarui berita"})
		return
	}
	h.db.First(&article, article.ID)
	c.JSON(http.StatusOK, gin.H{"data": article})
}

func (h *NewsHandler) Delete(c *gin.Context) {
	var article models.News
	if err := h.db.First(&article, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "berita tidak ditemukan"})
		return
	}
	if err := h.db.Delete(&article).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "gagal menghapus berita"})
		return
	}
	removeLocalUpload(article.FeaturedImage, h.uploadDir)
	c.Status(http.StatusNoContent)
}

func (h *NewsHandler) Upload(c *gin.Context) {
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file gambar diperlukan"})
		return
	}
	if err := validateImage(file); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := os.MkdirAll(h.uploadDir, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "gagal menyiapkan direktori unggahan"})
		return
	}
	ext := strings.ToLower(filepath.Ext(file.Filename))
	filename := fmt.Sprintf("%d%s", time.Now().UnixNano(), ext)
	destination := filepath.Join(h.uploadDir, filename)
	if err := c.SaveUploadedFile(file, destination); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "gagal menyimpan gambar",
			"details": err.Error(),
			"path":    destination,
			"upload":  h.uploadDir,
		})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"url": "/uploads/" + filename})
}

func validateImage(file *multipart.FileHeader) error {
	allowedExt := map[string]bool{".jpg": true, ".jpeg": true, ".png": true, ".webp": true}
	ext := strings.ToLower(filepath.Ext(file.Filename))
	if !allowedExt[ext] {
		return errors.New("format gambar harus JPG, PNG, atau WebP")
	}
	src, err := file.Open()
	if err != nil {
		return errors.New("gagal membaca gambar")
	}
	defer src.Close()
	buffer := make([]byte, 512)
	n, _ := src.Read(buffer)
	contentType := http.DetectContentType(buffer[:n])
	allowedType := map[string]bool{"image/jpeg": true, "image/png": true, "image/webp": true}
	if !allowedType[contentType] {
		return errors.New("konten file bukan gambar yang didukung")
	}
	return nil
}

func removeLocalUpload(url, uploadDir string) {
	if !strings.HasPrefix(url, "/uploads/") {
		return
	}
	name := filepath.Base(url)
	_ = os.Remove(filepath.Join(uploadDir, name))
}

func positiveInt(value string, fallback int) int {
	n, err := strconv.Atoi(value)
	if err != nil || n < 1 {
		return fallback
	}
	return n
}
