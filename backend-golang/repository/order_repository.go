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
		UpdateTotalPrice(ctx context.Context, tx *gorm.DB, totalPrice int64, orderId string) (int64, error)
		GetAllOrder(ctx context.Context, tx *gorm.DB, req dto.PaginationRequest) (dto.GetOrderRepositoryResponse, error)
		GetOrderByUserId(ctx context.Context, tx *gorm.DB, req dto.PaginationRequest, userId string) (dto.GetOrderRepositoryResponse, error)
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
		req.PerPage = 40
	}

	if req.Page == 0 {
		req.Page = 1
	}

	offset := (req.Page - 1) * req.PerPage

	if err := tx.WithContext(ctx).Model(&entity.Order{}).Count(&count).Error; err != nil {
		return dto.GetOrderRepositoryResponse{}, err
	}

	if err := tx.WithContext(ctx).Preload("User").Offset(offset).Limit(req.PerPage).Order("updated_at DESC").Find(&orders).Error; err != nil {
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

func (r *orderRepository) GetOrderByUserId(ctx context.Context, tx *gorm.DB, req dto.PaginationRequest, userId string) (dto.GetOrderRepositoryResponse, error) {
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

	if err := tx.WithContext(ctx).Model(&entity.Order{}).Where("user_id = ?", userId).Count(&count).Error; err != nil {
		return dto.GetOrderRepositoryResponse{}, err
	}

	if err := tx.WithContext(ctx).Preload("User").Where("user_id = ?", userId).Offset(offset).Limit(req.PerPage).Find(&orders).Error; err != nil {
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

	if err := tx.WithContext(ctx).Preload("User").Where("id = ?", orderId).First(&order).Error; err != nil {
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

	// Menghitung jumlah kamar yang tersedia
	if err := tx.WithContext(ctx).Model(&entity.Room{}).Where(
		"rooms.id NOT IN (?) OR rooms.id IN (?)",
		// Subquery pertama untuk memeriksa kamar yang terpesan pada tanggal tertentu dan memiliki status yang valid
		tx.Model(&entity.OrderRoom{}).Select("order_rooms.room_id").
			Joins("JOIN orders o ON o.id = order_rooms.order_id").
			Where("'2024-12-04'::DATE >= o.date_start::DATE AND '2024-12-04'::DATE <= o.date_end::DATE").
			Where("o.deleted_at IS NULL"), // Menghindari order yang sudah dihapus (soft delete)
		// Subquery kedua untuk memeriksa kamar dengan status "CANCELED"
		tx.Model(&entity.OrderRoom{}).Select("order_rooms.room_id").
			Joins("JOIN orders o ON o.id = order_rooms.order_id").
			Where("'2024-12-04'::DATE >= o.date_start::DATE AND '2024-12-04'::DATE <= o.date_end::DATE").
			Where("o.status = ?", "CANCELED"),
	).Count(&count).Error; err != nil {
		return dto.GetRoomRepositoryResponse{}, err
	}

	// Menampilkan kamar yang tersedia dengan preload data Hotel
	if err := tx.WithContext(ctx).
		Preload("Hotel"). // Preload related Hotel data
		Where(
			"rooms.id NOT IN (?) OR rooms.id IN (?)",
			// Subquery pertama untuk memeriksa kamar yang terpesan pada tanggal tertentu dan memiliki status yang valid
			tx.Model(&entity.OrderRoom{}).Select("order_rooms.room_id").
				Joins("JOIN orders o ON o.id = order_rooms.order_id").
				Where("'2024-12-04'::DATE >= o.date_start::DATE AND '2024-12-04'::DATE <= o.date_end::DATE").
				Where("o.deleted_at IS NULL"), // Menghindari order yang sudah dihapus (soft delete)
			// Subquery kedua untuk memeriksa kamar dengan status "CANCELED"
			tx.Model(&entity.OrderRoom{}).Select("order_rooms.room_id").
				Joins("JOIN orders o ON o.id = order_rooms.order_id").
				Where("'2024-12-04'::DATE >= o.date_start::DATE AND '2024-12-04'::DATE <= o.date_end::DATE").
				Where("o.status = ?", "CANCELED"),
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

func (r *orderRepository) UpdateTotalPrice(ctx context.Context, tx *gorm.DB, totalPrice int64, orderId string) (int64, error) {
	if tx == nil {
		tx = r.db
	}

	if err := tx.WithContext(ctx).Model(&entity.Order{}).Where("id = ?", orderId).Update("total_price", totalPrice).Error; err != nil {
		return 0, err
	}

	return totalPrice, nil
}

func (r *orderRepository) DeleteOrder(ctx context.Context, tx *gorm.DB, orderId string) error {
	if tx == nil {
		tx = r.db
	}

	if err := tx.WithContext(ctx).
		Where("order_id = ?", orderId).
		Delete(&entity.OrderRoom{}).Error; err != nil {
		return err
	}

	if err := tx.WithContext(ctx).
		Where("id = ?", orderId).
		Delete(&entity.Order{}).Error; err != nil {
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
		Joins("JOIN order_rooms oroom ON oroom.order_id = orders.id").
		Where("oroom.room_id = ? AND "+
			"(orders.date_start::date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 day' "+
			"OR orders.date_end::date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 day' "+
			"OR (orders.date_start::date <= CURRENT_DATE AND orders.date_end::date >= CURRENT_DATE + INTERVAL '30 day'))", roomId).
		Where("orders.deleted_at IS NULL").
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
