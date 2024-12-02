package entity


type OrderRoom struct {
	ID        int64 `json:"id" gorm:"primaryKey"`
	OrderID   int64 `json:"order_id"`
	RoomID    int64 `json:"room_id"`
	
	Order     Order  `json:"order" gorm:"foreignKey:OrderID;onDelete:CASCADE"`
	Room      Room   `json:"room" gorm:"foreignKey:RoomID"`

	Timestamp
}
