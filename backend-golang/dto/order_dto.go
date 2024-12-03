package dto

import (
	"time"

	"github.com/fatiyaa/golang-final-project/entity"
)

type (
	OrderCreateRequest struct {
		RoomID    []int64 `json:"room_id" form:"room_id" binding:"required"`
		Adults    int64   `json:"adult" form:"adult" binding:"required"`
		Children  int64   `json:"children" form:"children" binding:"required"`
		Infants   int64   `json:"infants" form:"infants" binding:"required"`
		DateStart string  `json:"date_start" form:"date_start" binding:"required"`
		DateEnd   string  `json:"date_end" form:"date_end" binding:"required"`
		Note      string  `json:"note" form:"note"`
	}

	OrderCreateResponse struct {
		ID         int64          `json:"id"`
		UserID     int64          `json:"user_id"`
		Adults     int64          `json:"adult"`
		Children   int64          `json:"children"`
		Infants    int64          `json:"infants"`
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
		ID         int64          `json:"id"`
		UserID     int64          `json:"user_id"`
		Username   string         `json:"username"`
		Room       []RoomResponse `json:"room"`
		RoomTotal  int64          `json:"room_total"`
		Adults     int64          `json:"adult"`
		Children   int64          `json:"children"`
		Infants    int64          `json:"infants"`
		Status     string         `json:"status"`
		DateStart  string         `json:"date_start"`
		DateEnd    string         `json:"date_end"`
		Note       string         `json:"note"`
		TotalPrice int64          `json:"total_price"`
	}

	BookedDate struct {
		DateStart time.Time `gorm:"column:date_start"`
		DateEnd   time.Time `gorm:"column:date_end"`
	}
)
