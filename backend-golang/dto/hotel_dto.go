package dto

import (
	"mime/multipart"

	"github.com/fatiyaa/golang-final-project/entity"
)

type HotelCreateRequest struct {
	Name        string                `json:"name" form:"name" binding:"required"`
	Image       *multipart.FileHeader `json:"image" form:"image" `
	City        string                `json:"city" form:"city" binding:"required"`
	Address     string                `json:"address" form:"address" binding:"required"`
	PhoneNumber string                `json:"phone_number" form:"phone_number" binding:"required"`
	Email       string                `json:"email" form:"email" binding:"required"`
	Rating      float64               `json:"rating" form:"rating" binding:"required"`
	Description string                `json:"description" form:"description" `
}

type HotelCreateResponse struct {
	Name        string  `json:"name" `
	ImageUrl    string  `json:"image"`
	City        string  `json:"city" `
	Address     string  `json:"address" `
	PhoneNumber string  `json:"phone_number" `
	Email       string  `json:"email" `
	Rating      float64 `json:"rating" `
	Description string  `json:"description" `
}

type HotelUpdateRequest struct {
	Name        string               `json:"name" form:"name"`          // Nama hotel
	Image       *multipart.FileHeader `json:"image" form:"image"`       // Gambar hotel (file)
	ImageUrl	string               `json:"image_url" form:"image_url"` // URL gambar hotel
	City        string               `json:"city" form:"city"`         // Kota hotel
	Address     string               `json:"address" form:"address"`   // Alamat hotel
	PhoneNumber string               `json:"phone_number" form:"phone_number"` // Nomor telepon hotel
	Email       string               `json:"email" form:"email"`       // Email hotel
	Rating      float64              `json:"rating" form:"rating"`     // Rating hotel
	Description string               `json:"description" form:"description"` // Deskripsi hotel
}

type GetHotelRepositoryResponse struct {
	Hotels []entity.Hotel
	PaginationResponse
}

type HotelResponse struct {
	ID          int64   `json:"id"`
	Name        string  `json:"name"`
	ImageUrl    string  `json:"image_url"`
	Address     string  `json:"address"`
	City        string  `json:"city"`
	PhoneNumber string  `json:"phone_number"`
	Email       string  `json:"email"`
	Rating      float64 `json:"rating"`
	Description string  `json:"description"`
}
