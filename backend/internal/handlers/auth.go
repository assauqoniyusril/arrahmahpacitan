package handlers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"reportase-foto/backend/internal/models"
	"reportase-foto/backend/internal/services"
)

type AuthHandler struct {
	db   *gorm.DB
	auth *services.AuthService
}

func NewAuthHandler(db *gorm.DB, auth *services.AuthService) *AuthHandler {
	return &AuthHandler{db: db, auth: auth}
}

type loginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "email atau kata sandi tidak valid"})
		return
	}

	var user models.User
	if err := h.db.Where("LOWER(email) = ?", strings.ToLower(req.Email)).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "email atau kata sandi salah"})
		return
	}
	if bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)) != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "email atau kata sandi salah"})
		return
	}

	token, err := h.auth.Generate(user.ID, user.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "gagal membuat token"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"token": token, "user": user})
}

func (h *AuthHandler) Me(c *gin.Context) {
	userID, _ := c.Get("user_id")
	var user models.User
	if err := h.db.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "pengguna tidak ditemukan"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"user": user})
}
