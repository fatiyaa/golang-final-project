package migrations

import (
	"log"

	"github.com/fatiyaa/golang-final-project/entity"
	"gorm.io/gorm"
)

func Migrate(db *gorm.DB) error {
	if err := db.AutoMigrate(
		&entity.User{},
	); err != nil {
		return err
	}

	return nil
}

func dropAllTables(db *gorm.DB) error {
	if err := db.Migrator().DropTable(
		&entity.User{},
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
