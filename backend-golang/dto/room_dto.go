package dto

import "github.com/fatiyaa/golang-final-project/entity"

type (
	RoomCreateRequest struct {
		Name        string `json:"name" binding:"required"`
		HotelID     int64  `json:"hotel_id" binding:"required"`
		ImageUrl    string `json:"image_url"`
		Type        string `json:"type" binding:"required"`
		BasePrice   int64  `json:"base_price" binding:"required"`
		Quantity    int64  `json:"quantity" binding:"required"`
		IsAvailable bool   `json:"is_available" binding:"required"`
		Description string `json:"description" binding:"required"`
	}

	RoomUpdateRequest struct {
		Name        string `json:"name"`
		HotelID     int64  `json:"hotel_id"`
		ImageUrl    string `json:"image_url"`
		Type        string `json:"type"`
		BasePrice   int64  `json:"base_price"`
		Quantity    int64  `json:"quantity"`
		IsAvailable bool   `json:"is_available"`
		Description string `json:"description"`
	}

	GetRoomRepositoryResponse struct {
		Rooms []entity.Room
		PaginationResponse
	}

	RoomResponse struct {
		ID          int64  `json:"id"`
		Name        string `json:"name"`
		HotelID     int64  `json:"hotel_id"`
		HotelName   string `json:"hotel_name"`
		ImageUrl    string `json:"image_url"`
		Type        string `json:"type"`
		BasePrice   int64  `json:"base_price"`
		Quantity    int64  `json:"quantity"`
		IsAvailable bool   `json:"is_available"`
		Description string `json:"description"`
	}

	GetRoomList struct {
		Rooms []RoomResponse
		PaginationResponse
	}
)