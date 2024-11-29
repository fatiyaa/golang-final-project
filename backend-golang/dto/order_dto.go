package dto

import "github.com/fatiyaa/golang-final-project/entity"

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

	OrderResponse struct {
		ID        int64  `json:"id"`
		UserID    int64  `json:"user_id"`
		RoomID    int64  `json:"room_id"`
		Status    string `json:"status"`
		DateStart string `json:"date_start"`
		DateEnd   string `json:"date_end"`
		Note      string `json:"note"`
	}

)