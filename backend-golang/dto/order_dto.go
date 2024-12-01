package dto

import (
	"time"

	"github.com/fatiyaa/golang-final-project/entity"
)

type (
	OrderCreateRequest struct {
		RoomID    int64  `json:"room_id" form:"room_id" binding:"required"`
		DateStart string `json:"date_start" form:"date_start" binding:"required"`
		DateEnd   string `json:"date_end" form:"date_end" binding:"required"`
		Note      string `json:"note" form:"note"`
	}


	GetOrderRepositoryResponse struct {
		Orders []entity.Order
		PaginationResponse
	}

	GetOrderResponse struct {
		Orders []OrderResponse
		PaginationResponse
	}

	OrderResponse struct {
		ID        int64  `json:"id"`
		UserID    int64  `json:"user_id"`
		Username  string `json:"username"`
		RoomID    int64  `json:"room_id"`
		RoomName  string `json:"room_name"`
		HotelID  int64  `json:"hotel_id"`
		HotelName  string `json:"hotel_name"`
		Status    string `json:"status"`
		DateStart string `json:"date_start"`
		DateEnd   string `json:"date_end"`
		Note      string `json:"note"`
		Price    int64  `json:"price"`
	}

	BookedDate struct {
		DateStart time.Time `gorm:"column:date_start"`
		DateEnd   time.Time `gorm:"column:date_end"`
	}

)