package dto

import (
	"time"

	"github.com/fatiyaa/golang-final-project/entity"
)

type (
	OrderCreateRequest struct {
		RoomID    []int64 `json:"room_id" form:"room_id" binding:"required"`
		RentType  string  `json:"rent_type" form:"rent_type" binding:"required"`
		People    int64   `json:"people" form:"people" binding:"required"`
		DateStart string  `json:"date_start" form:"date_start" binding:"required"`
		DateEnd   string  `json:"date_end" form:"date_end" binding:"required"`
		Note      string  `json:"note" form:"note"`
	}

	OrderCreateResponse struct {
		ID         int64          `json:"id"`
		UserID     int64          `json:"user_id"`
		RentType   string         `json:"rent_type"`
		People     int64          `json:"people"`
		Room       []RoomResponse `json:"room"`
		RoomTotal  int64          `json:"room_total"`
		Status     string         `json:"status"`
		DateStart  string         `json:"date_start"`
		DateEnd    string         `json:"date_end"`
		Days       int64          `json:"days"`
		Note       string         `json:"note"`
		TotalPrice int64          `json:"total_price"`
	}

	GetOrderRepositoryResponse struct {
		Orders []entity.Order
		PaginationResponse
	}

	GetOrderResponse struct {
		Orders []OrderSingleResponse
		PaginationResponse
	}


	OrderSingleResponse struct {
		ID          int64          `json:"id"`
		UserID      int64          `json:"user_id"`
		Username    string         `json:"username"`
		Room        []RoomResponse `json:"room"`
		RoomTotal   int64          `json:"room_total"`
		RentType    string         `json:"rent_type"`
		People      int64          `json:"people"`
		Status      string         `json:"status"`
		DateStart   string         `json:"date_start"`
		DateEnd     string         `json:"date_end"`
		Note        string         `json:"note"`
		TotalPrice  int64          `json:"total_price"`
	}

	BookedDate struct {
		DateStart time.Time `gorm:"column:date_start"`
		DateEnd   time.Time `gorm:"column:date_end"`
	}
)
