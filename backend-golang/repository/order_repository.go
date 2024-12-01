package repository

import (
	"context"
	"fmt"
	"math"

	"github.com/fatiyaa/golang-final-project/dto"
	"github.com/fatiyaa/golang-final-project/entity"
	"gorm.io/gorm"
)

type (
	OrderRepository interface {
		CreateOrder(ctx context.Context, tx *gorm.DB, order entity.Order) (entity.Order, error)
		GetAllOrder(ctx context.Context, tx *gorm.DB, req dto.PaginationRequest) (dto.GetOrderRepositoryResponse, error)
		GetOrderById(ctx context.Context, tx *gorm.DB, orderId string) (entity.Order, error)
		GetAvailRoomByDate(ctx context.Context, tx *gorm.DB, req dto.PaginationRequest, date string) (dto.GetRoomRepositoryResponse, error)
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

	if err := tx.WithContext(ctx).Preload("User").Preload("Room").Offset(offset).Limit(req.PerPage).Find(&orders).Error; err != nil {
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