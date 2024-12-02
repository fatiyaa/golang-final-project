package dto


type (
	OrderRoomCreateRequest struct {
		OrderID   int64  `json:"order_id" form:"order_id" binding:"required"`
		RoomID    int64  `json:"room_id" form:"room_id" binding:"required"`
	}

	OrderRoomData struct {
		Rooms []RoomResponse `json:"rooms"`
		Count int64          `json:"count"`
	}
)