package entity

type Order struct {
	ID         int64  `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID     int64  `json:"user_id"`
	RentType   string `json:"rent_type"`
	People     int64  `json:"people"`
	Status     string `json:"status"`
	DateStart  string `json:"date_start"`
	DateEnd    string `json:"date_end"`
	Days       int64  `json:"days"`
	Note       string `json:"note"`
	TotalPrice int64  `json:"total_price"`

	User User `json:"user" gorm:"foreignKey:UserID"`

	OrderRooms []OrderRoom `json:"order_rooms"`

	Timestamp
}
