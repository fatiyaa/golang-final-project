package dto

import (
	"mime/multipart"

	"github.com/fatiyaa/golang-final-project/entity"
)

type (
	RoomCreateRequest struct {
		Name        string                `json:"name" binding:"required" form:"name"`
		HotelID     int64                 `json:"hotel_id" binding:"required" form:"hotel_id"`
		ImageUrl    string                `json:"image_url" form:"image_url"` // URL gambar bisa dikirim sebagai form field
		Image       *multipart.FileHeader `json:"image" form:"image"`         // Untuk menangani file gambar yang diupload
		Type        string                `json:"type" binding:"required" form:"type"`
		BasePrice   int64                 `json:"base_price" binding:"required" form:"base_price"`
		Quantity    int64                 `json:"quantity" binding:"required" form:"quantity"`
		IsAvailable bool                  `json:"is_available" binding:"required" form:"is_available"`
		Description string                `json:"description" form:"description"`
	}

	RoomUpdateRequest struct {
		Name        string                `json:"name" form:"name"`                 // Nama kamar
		HotelID     int64                 `json:"hotel_id" form:"hotel_id"`         // ID hotel
		Image       *multipart.FileHeader `json:"image" form:"image"`               // Gambar kamar (file)
		ImageUrl    string                `json:"image_url" form:"image_url"`       // URL gambar kamar
		Type        string                `json:"type" form:"type"`                 // Tipe kamar
		BasePrice   int64                 `json:"base_price" form:"base_price"`     // Harga dasar kamar
		Quantity    int64                 `json:"quantity" form:"quantity"`         // Jumlah kamar
		IsAvailable bool                  `json:"is_available" form:"is_available"` // Ketersediaan kamar
		Description string                `json:"description" form:"description"`   // Deskripsi kamar
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
