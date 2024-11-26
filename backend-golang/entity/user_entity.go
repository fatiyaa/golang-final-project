package entity

import (
	"github.com/fatiyaa/golang-final-project/helpers"
	"gorm.io/gorm"
)

type User struct {
	ID         int64  `gorm:"primaryKey;autoIncrement" json:"id"`
	Name       string `json:"name"`
	TelpNumber string `json:"telp_number"`
	Email      string `json:"email"`
	Password   string `json:"password"`
	Role       string `json:"role"`
	ImageUrl   string `json:"image_url"`
	IsVerified bool   `json:"is_verified"`

	Timestamp
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	var err error
	// u.ID = uuid.New()
	u.Password, err = helpers.HashPassword(u.Password)
	if err != nil {
		return err
	}
	return nil
}
