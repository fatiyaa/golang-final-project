package entity

type Room struct {
	ID          int64  `gorm:"primaryKey;autoIncrement" json:"id"`
	HotelID     int64  `json:"hotel_id"`
	Name        string `json:"name"`
	ImageUrl    string `json:"image_url"`
	Type        string `json:"type"`
	BasePrice   int64  `json:"base_price"`
	Quantity    int64  `json:"quantity"`
	IsAvailable bool   `json:"is_available"`
	Description string `json:"description"`

	Hotel Hotel `json:"hotel"`

	Orders []Order `json:"orders"`

	Timestamp
}
