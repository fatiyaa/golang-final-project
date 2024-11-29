package migrations

import (
	"encoding/json"
	"errors"
	"io"
	"log"
	"os"

	"github.com/fatiyaa/golang-final-project/entity"
	"github.com/fatiyaa/golang-final-project/migrations/seeds"
	"gorm.io/gorm"
)

func Seeder(db *gorm.DB) error {
	if err := seeds.ListUserSeeder(db); err != nil {
		return err
	}

	if err := SeedAll(db); err != nil {
		log.Printf("Seeder error: %v", err)
		return err
	}
	log.Println("Seeding completed successfully")
	return nil
}

// Execute all seed data
func SeedAll(db *gorm.DB) error {
	if err := seedHotels(db, "./migrations/json/hotels.json"); err != nil {
		return err
	}

	if err := seedRooms(db, "./migrations/json/rooms.json"); err != nil {
		return err
	}

	if err := seedOrders(db, "./migrations/json/orders.json"); err != nil {
		return err
	}

	return nil
}

func seedHotels(db *gorm.DB, filePath string) error {
	return seedData[entity.Hotel](db, filePath)
}

func seedRooms(db *gorm.DB, filePath string) error {
	return seedData[entity.Room](db, filePath)
}

func seedOrders(db *gorm.DB, filePath string) error {
	return seedData[entity.Order](db, filePath)
}

// Generic function to handle seeding for different entitys
func seedData[T any](db *gorm.DB, filePath string) error {
	log.Printf("Attempting to open file: %s\n", filePath)
	jsonFile, err := os.Open(filePath)
	if err != nil {
		return err
	}
	defer jsonFile.Close()

	jsonData, err := io.ReadAll(jsonFile)
	if err != nil {
		return err
	}

	var records []T
	if err := json.Unmarshal(jsonData, &records); err != nil {
		return err
	}

	for _, record := range records {
		var existing T
		err := db.Where("id = ?", getId(record)).First(&existing).Error
		if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
			return err
		}
		if getId(existing) == 0 {
			if err := db.Create(&record).Error; err != nil {
				return err
			}
		}
	}
	return nil
}

// Helper function to get PKID from any type (T)
func getId(record interface{}) int64 {
	switch v := record.(type) {
	case entity.Hotel:
		return v.ID
	case entity.Room:
		return v.ID
	case entity.Order:
		return v.ID
	default:
		return 0
	}
}
