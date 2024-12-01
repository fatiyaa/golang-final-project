package repository

import (
	"context"
	"fmt"
	"math"
	"time"

	"github.com/fatiyaa/golang-final-project/dto"
	"github.com/fatiyaa/golang-final-project/entity"
	"gorm.io/gorm"
)

type (
	OrderRepository interface {
		CreateOrder(ctx context.Context, tx *gorm.DB, order entity.Order) (entity.Order, error)
		UpdateOrderStatus(ctx context.Context, tx *gorm.DB, status string, orderId string) (string, error)
		GetAllOrder(ctx context.Context, tx *gorm.DB, req dto.PaginationRequest) (dto.GetOrderRepositoryResponse, error)
		GetOrderById(ctx context.Context, tx *gorm.DB, orderId string) (entity.Order, error)
		GetAvailRoomByDate(ctx context.Context, tx *gorm.DB, req dto.PaginationRequest, date string) (dto.GetRoomRepositoryResponse, error)
		DeleteOrder(ctx context.Context, tx *gorm.DB, orderId string) error
		GetBookedDates(ctx context.Context, tx *gorm.DB, roomId string) ([]dto.BookedDate, error)
	}
	orderRepository struct {
		db *gorm.DB
	}
)

func NewOrderRepository(db *gorm.DB) OrderRepository {
	return &orderRepository{
		db: db,
	}
}

func (r *orderRepository) CreateOrder(ctx context.Context, tx *gorm.DB, order entity.Order) (entity.Order, error) {
	if tx == nil {
		tx = r.db
	}

	if err := tx.WithContext(ctx).Create(&order).Error; err != nil {
		return entity.Order{}, err
	}

	return order, nil
}

func (r *orderRepository) GetAllOrder(ctx context.Context, tx *gorm.DB, req dto.PaginationRequest) (dto.GetOrderRepositoryResponse, error) {
	if tx == nil {
		tx = r.db
	}

	var orders []entity.Order
	var count int64

	if req.PerPage == 0 {
		req.PerPage = 10
	}

	if req.Page == 0 {
		req.Page = 1
	}

	offset := (req.Page - 1) * req.PerPage

	if err := tx.WithContext(ctx).Model(&entity.Order{}).Count(&count).Error; err != nil {
		return dto.GetOrderRepositoryResponse{}, err
	}

	if err := tx.WithContext(ctx).Preload("User").Preload("Room").Preload("Room.Hotel").Offset(offset).Limit(req.PerPage).Find(&orders).Error; err != nil {
		return dto.GetOrderRepositoryResponse{}, err
	}

	totalPage := int64(math.Ceil(float64(count) / float64(req.PerPage)))

	return dto.GetOrderRepositoryResponse{
		Orders: orders,
		PaginationResponse: dto.PaginationResponse{
			Page:    req.Page,
			PerPage: req.PerPage,
			MaxPage: totalPage,
			Count:   count,
		},
	}, nil
}

func (r *orderRepository) GetOrderById(ctx context.Context, tx *gorm.DB, orderId string) (entity.Order, error) {
	if tx == nil {
		tx = r.db
	}

	var order entity.Order

	if err := tx.WithContext(ctx).Preload("User").Preload("Room").Where("id = ?", orderId).First(&order).Error; err != nil {
		return entity.Order{}, err
	}

	return order, nil
}

func (r *orderRepository) GetAvailRoomByDate(ctx context.Context, tx *gorm.DB, req dto.PaginationRequest, date string) (dto.GetRoomRepositoryResponse, error) {
	if tx == nil {
		tx = r.db
	}

	var rooms []entity.Room
	var count int64

	if req.PerPage == 0 {
		req.PerPage = 10
	}

	if req.Page == 0 {
		req.Page = 1
	}

	offset := (req.Page - 1) * req.PerPage

	if date == "" {
		return dto.GetRoomRepositoryResponse{}, fmt.Errorf("invalid date: date cannot be empty")
	}

	now := time.Now()
	if date <= now.Format("2006-01-02") {
		return dto.GetRoomRepositoryResponse{}, fmt.Errorf("invalid date: date must be greater than today")
	}

	if err := tx.WithContext(ctx).Model(&entity.Room{}).Where(
		"rooms.id NOT IN (?) OR rooms.id IN (?)",
		tx.Model(&entity.Order{}).Select("room_id").
			Where("?::DATE >= date_start::DATE AND ?::DATE <= date_end::DATE", date, date), // Subquery for checking room availability
		tx.Model(&entity.Order{}).Select("room_id").Where("status = ?", "CANCELED"), // Subquery for canceled rooms
	).Count(&count).Error; err != nil {
		return dto.GetRoomRepositoryResponse{}, err
	}

	if err := tx.WithContext(ctx).
		Preload("Hotel"). // Preload related Hotel data
		Where(
			"rooms.id NOT IN (?) OR rooms.id IN (?)",
			tx.Model(&entity.Order{}).Select("room_id").
				Where("?::DATE >= date_start::DATE AND ?::DATE <= date_end::DATE", date, date), // Subquery for checking room availability
			tx.Model(&entity.Order{}).Select("room_id").Where("status = ?", "CANCELED"), // Subquery for canceled rooms
		).
		Offset(offset).
		Limit(req.PerPage).
		Find(&rooms).Error; err != nil {
		return dto.GetRoomRepositoryResponse{}, err
	}

	totalPage := int64(math.Ceil(float64(count) / float64(req.PerPage)))

	return dto.GetRoomRepositoryResponse{
		Rooms: rooms,
		PaginationResponse: dto.PaginationResponse{
			Page:    req.Page,
			PerPage: req.PerPage,
			MaxPage: totalPage,
			Count:   count,
		},
	}, nil
}

func (r *orderRepository) UpdateOrderStatus(ctx context.Context, tx *gorm.DB, status string, orderId string) (string, error) {
	if tx == nil {
		tx = r.db
	}

	if err := tx.WithContext(ctx).Model(&entity.Order{}).Where("id = ?", orderId).Update("status", status).Error; err != nil {
		return "", err
	}

	return status, nil
}

func (r *orderRepository) DeleteOrder(ctx context.Context, tx *gorm.DB, orderId string) error {
	if tx == nil {
		tx = r.db
	}

	if err := tx.WithContext(ctx).Where("id = ?", orderId).Delete(&entity.Order{}).Error; err != nil {
		return err
	}

	return nil
}

func (r *orderRepository) GetBookedDates(ctx context.Context, tx *gorm.DB, roomId string) ([]dto.BookedDate, error) {
    // Jika tx nil, buat instance baru dari DB
    if tx == nil {
        tx = r.db // pastikan `r.db` adalah instance yang valid dari DB
    }

    var results []struct {
        DateStart string `gorm:"column:date_start"`
        DateEnd   string `gorm:"column:date_end"`
    }

    if err := tx.Model(&entity.Order{}).
        Where("room_id = ? AND status != ? AND (date_start BETWEEN ? AND ? OR date_end BETWEEN ? AND ?)", roomId, "CANCELED", time.Now().Add(24*time.Hour), time.Now().Add(30*24*time.Hour), time.Now().Add(24*time.Hour), time.Now().Add(30*24*time.Hour)).
        Find(&results).Error; err != nil {
        return nil, err
    }

    // Konversi data tanggal dari string ke time.Time
    var bookedDates []dto.BookedDate
    for _, result := range results {
        startDate, err := time.Parse("2006-01-02", result.DateStart) // Mengonversi string ke time.Time
        if err != nil {
            return nil, fmt.Errorf("failed to parse date_start: %v", err)
        }
        endDate, err := time.Parse("2006-01-02", result.DateEnd) // Mengonversi string ke time.Time
        if err != nil {
            return nil, fmt.Errorf("failed to parse date_end: %v", err)
        }
        bookedDates = append(bookedDates, dto.BookedDate{
            DateStart: startDate,
            DateEnd:   endDate,
        })
    }

    return bookedDates, nil
}
