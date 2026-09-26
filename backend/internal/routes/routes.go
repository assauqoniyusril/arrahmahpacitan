package routes

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"reportase-foto/backend/internal/config"
	"reportase-foto/backend/internal/handlers"
	"reportase-foto/backend/internal/middleware"
	"reportase-foto/backend/internal/services"
)

func Setup(db *gorm.DB, cfg config.Config) *gin.Engine {
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()
	r.Use(gin.Logger(), gin.Recovery(), middleware.SecurityHeaders())
	r.SetTrustedProxies([]string{"127.0.0.1", "::1", "172.16.0.0/12"})
	origins := []string{cfg.FrontendURL}
	if cfg.Environment == "development" {
		origins = append(origins, "http://localhost", "http://localhost:8080", "http://localhost:3004", "http://localhost:8005", "http://127.0.0.1", "http://127.0.0.1:8080", "http://127.0.0.1:3004")
	}

	r.Use(cors.New(cors.Config{
		AllowOrigins:     origins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Accept", "X-Requested-With"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	authService := services.NewAuthService(cfg.JWTSecret, cfg.JWTTTL)
	authHandler := handlers.NewAuthHandler(db, authService)
	newsHandler := handlers.NewNewsHandler(db, cfg)

	r.GET("/health", func(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"status": "ok"}) })
	r.Static("/uploads", cfg.UploadDir)

	api := r.Group("/api")
	{
		api.GET("/news", newsHandler.ListPublic)
		api.GET("/news/:slug", newsHandler.DetailPublic)
		api.POST("/admin/login", authHandler.Login)

		admin := api.Group("/admin")
		admin.Use(middleware.RequireAuth(authService))
		{
			admin.GET("/me", authHandler.Me)
			admin.GET("/news", newsHandler.ListAdmin)
			admin.GET("/news/:id", newsHandler.GetAdmin)
			admin.POST("/news", newsHandler.Create)
			admin.PUT("/news/:id", newsHandler.Update)
			admin.DELETE("/news/:id", newsHandler.Delete)
			admin.POST("/uploads", middleware.MaxBodyBytes(cfg.MaxUploadMB*1024*1024), newsHandler.Upload)
		}
	}
	return r
}
