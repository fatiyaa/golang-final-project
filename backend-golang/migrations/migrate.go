package migrations

import (
	"log"

	"github.com/fatiyaa/golang-final-project/entity"
	"gorm.io/gorm"
)

func Migrate(db *gorm.DB) error {
	if !typeExists(db, "order_status") {
		if err := db.Exec(`CREATE TYPE order_status AS ENUM (
			'PENDING',
			'BOOKED',
			'CHECKED_IN',
			'CHECKED_OUT',
			'CANCELED'
		)`).Error; err != nil {
			log.Printf("Failed to create enum type: %v", err)
			return err
		}
	}

	if !typeExists(db, "room_type") {
		if err := db.Exec(`CREATE TYPE room_type AS ENUM (
			'STANDARD',
			'DELUXE',
			'SUITE'
			'PRESIDENTIAL'
		)`).Error; err != nil {
			log.Printf("Failed to create enum type: %v", err)
			return err
		}
	}

	if err := db.AutoMigrate(
		&entity.User{},
		&entity.Hotel{},
		&entity.Room{},
		&entity.Order{},
	); err != nil {
		return err
	}

	return nil
}

func dropAllTables(db *gorm.DB) error {
	if err := db.Migrator().DropTable(
		&entity.User{},
		&entity.Hotel{},
		&entity.Room{},
		&entity.Order{},
	); err != nil {
		return err
	}

	log.Println("All tables dropped successfully.")
	return nil
}

func Fresh(db *gorm.DB) error {
	if err := dropAllTables(db); err != nil {
		log.Printf("Error dropping tables: %v", err)
		return err
	}

	if err := Migrate(db); err != nil {
		log.Printf("Error during migration: %v", err)
		return err
	}

	log.Println("Fresh migration completed successfully.")
	return nil
}

func typeExists(db *gorm.DB, typeName string) bool {
	var count int
	db.Raw(`SELECT COUNT(*) FROM pg_type WHERE typname = ?`, typeName).Scan(&count)
	return count > 0
}