package main

import (
	"log"

	"reportase-foto/backend/internal/config"
	"reportase-foto/backend/internal/database"
	"reportase-foto/backend/internal/routes"
)

func main() {
	cfg := config.Load()
	if err := cfg.Validate(); err != nil {
		log.Fatal(err)
	}
	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatal(err)
	}
	router := routes.Setup(db, cfg)
	log.Printf("reportase API listening on :%s", cfg.AppPort)
	if err := router.Run(":" + cfg.AppPort); err != nil {
		log.Fatal(err)
	}
}
