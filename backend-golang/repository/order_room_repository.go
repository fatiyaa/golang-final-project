package repository

import (
	"context"

	"github.com/fatiyaa/golang-final-project/entity"
	"gorm.io/gorm"
)

type (
	OrderRoomRepository interface {
		InsertOrderRoom(ctx context.Context, tx *gorm.DB, orderRoom entity.OrderRoom) (entity.OrderRoom, error)
		GetRoomByOrderId(ctx context.Context, tx *gorm.DB, orderId int64) ([]entity.OrderRoom, error)
	}

	orderRoomRepository struct {
		DB *gorm.DB
	}
)

func NewOrderRoomRepository(DB *gorm.DB) OrderRoomRepository {
	return &orderRoomRepository{
		DB: DB,
	}
}

func (r *orderRoomRepository) InsertOrderRoom(ctx context.Context, tx *gorm.DB, orderRoom entity.OrderRoom) (entity.OrderRoom, error) {
	if tx == nil {
		tx = r.DB
	}

	if err := tx.WithContext(ctx).Create(&orderRoom).Error; err != nil {
		return entity.OrderRoom{}, err
	}

	return orderRoom, nil
}


func (r *orderRoomRepository) GetRoomByOrderId(ctx context.Context, tx *gorm.DB, orderId int64) ([]entity.OrderRoom, error) {
	if tx == nil {
		tx = r.DB
	}

	var orderRoom []entity.OrderRoom

	if err := tx.WithContext(ctx).Preload("Room").Where("order_id = ?", orderId).Find(&orderRoom).Error; err != nil {
		return nil, err
	}

	return orderRoom, nil
}