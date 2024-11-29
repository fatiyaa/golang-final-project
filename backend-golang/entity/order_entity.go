package entity

type Order struct {
	ID        int64  `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID    int64  `json:"user_id"`
	RoomID    int64  `json:"room_id"`
	Status    string `json:"status"`
	DateStart string `json:"date_start"`
	DateEnd   string `json:"date_end"`
	Note      string `json:"note"`

	User User `json:"user"`
	Room Room `json:"room"`

	Timestamp
}
