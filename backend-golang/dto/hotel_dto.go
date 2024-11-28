package dto

import "github.com/fatiyaa/golang-final-project/entity"

type HotelCreateRequest struct {
	Name        string  `json:"name" binding:"required"`
	ImageUrl    string  `json:"image_url"`
	City        string  `json:"city" binding:"required"`
	Address     string  `json:"address" binding:"required"`
	PhoneNumber string  `json:"phone_number" binding:"required"`
	Email       string  `json:"email" binding:"required"`
	Rating      float64 `json:"rating" binding:"required"`
	Description string  `json:"description" binding:"required"`
}

type HotelUpdateRequest struct {
	Name        string  `json:"name"`
	ImageUrl    string  `json:"image_url"`
	City        string  `json:"city"`
	Address     string  `json:"address"`
	PhoneNumber string  `json:"phone_number"`
	Email       string  `json:"email"`
	Rating      float64 `json:"rating"`
	Description string  `json:"description"`
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