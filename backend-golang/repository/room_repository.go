package repository

import (
	"context"
	"math"

	"github.com/fatiyaa/golang-final-project/dto"
	"github.com/fatiyaa/golang-final-project/entity"
	"gorm.io/gorm"
)

type (
	RoomRepository interface {
		CreateRoom(ctx context.Context, tx *gorm.DB, room entity.Room) (entity.Room, error)
		UpdateRoom(ctx context.Context, tx *gorm.DB, room entity.Room, roomId string) (entity.Room, error)
		GetAllRoom(ctx context.Context, tx *gorm.DB, req dto.PaginationRequest) (dto.GetRoomRepositoryResponse, error)
		GetRoomById(ctx context.Context, tx *gorm.DB, roomId string) (entity.Room, error)
		DeleteRoom(ctx context.Context, tx *gorm.DB, roomId string) error
	}

	roomRepository struct {
		db *gorm.DB
	}
)

func NewRoomRepository(db *gorm.DB) RoomRepository {
	return &roomRepository{
		db: db,
	}
}

func (r *roomRepository) CreateRoom(ctx context.Context, tx *gorm.DB, room entity.Room) (entity.Room, error) {
	if tx == nil {
		tx = r.db
	}

	if err := tx.WithContext(ctx).Create(&room).Error; err != nil {
		return entity.Room{}, err
	}

	return room, nil
}

func (r *roomRepository) UpdateRoom(ctx context.Context, tx *gorm.DB, room entity.Room, roomId string) (entity.Room, error) {
	if tx == nil {
		tx = r.db
	}

	if err := tx.WithContext(ctx).Model(&entity.Room{}).Where("id = ?", roomId).Updates(&room).Error; err != nil {
		return entity.Room{}, err
	}

	return room, nil
}

func (r *roomRepository) GetAllRoom(ctx context.Context, tx *gorm.DB, req dto.PaginationRequest) (dto.GetRoomRepositoryResponse, error) {
	if tx == nil {
		tx = r.db
	}

	var rooms []entity.Room
	var err error
	var count int64

	if req.PerPage == 0 {
		req.PerPage = 10
	}

	if req.Page == 0 {
		req.Page = 1
	}

	tx = tx.WithContext(ctx)
	tx.Model(&entity.Room{}).Count(&count)

	if err = tx.WithContext(ctx).Preload("Hotel").Limit(req.PerPage).Offset((req.Page - 1) * req.PerPage).Find(&rooms).Error; err != nil {
		return dto.GetRoomRepositoryResponse{}, err
	}

	totalPage := int64(math.Ceil(float64(count) / float64(req.PerPage)))


	response := dto.GetRoomRepositoryResponse{
		Rooms:  rooms,
		PaginationResponse: dto.PaginationResponse{
			Page:    req.Page,
			PerPage: req.PerPage,
			MaxPage: totalPage,
			Count:   count,
		},
	}

	return response, nil
}

func (r *roomRepository) GetRoomById(ctx context.Context, tx *gorm.DB, roomId string) (entity.Room, error) {
	if tx == nil {
		tx = r.db
	}

	var room entity.Room
	if err := tx.WithContext(ctx).Where("id = ?", roomId).Take(&room).Error; err != nil {
		return entity.Room{}, err
	}

	return room, nil
}

func (r *roomRepository) DeleteRoom(ctx context.Context, tx *gorm.DB, roomId string) error {
	if tx == nil {
		tx = r.db
	}

	if err := tx.WithContext(ctx).Where("id = ?", roomId).Delete(&entity.Room{}).Error; err != nil {
		return err
	}

	return nil
}
