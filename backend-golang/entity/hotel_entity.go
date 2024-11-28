package entity

type Hotel struct {
	ID          int64   `gorm:"primaryKey;autoIncrement" json:"id"`
	Name        string  `json:"name"`
	ImageUrl    string  `json:"image_url"`
	Location    string  `json:"location"`
	PhoneNumber string  `json:"phone_number"`
	Email       string  `json:"email"`
	Rating      float64 `json:"rating"`
	Description string  `json:"description"`

	Rooms []Room `json:"rooms"`

	Timestamp
}
