package repository

import (
	"context"
	"math"

	"github.com/fatiyaa/golang-final-project/dto"
	"github.com/fatiyaa/golang-final-project/entity"
	"gorm.io/gorm"
)

type (
	HotelRepository interface {
		RegisterHotel(ctx context.Context, tx *gorm.DB, hotel entity.Hotel) (entity.Hotel, error)
		UpdateHotel(ctx context.Context, tx *gorm.DB, hotel entity.Hotel, hotelId string) (entity.Hotel, error)
		GetAllHotel(ctx context.Context, tx *gorm.DB, req dto.PaginationRequest) (dto.GetHotelRepositoryResponse, error)
		GetHotelById(ctx context.Context, tx *gorm.DB, hotelId string) (entity.Hotel, error)
		DeleteHotel(ctx context.Context, tx *gorm.DB, hotelId string) error
		CityList(ctx context.Context, tx *gorm.DB) ([]string, error)
		GetHotelByCity(ctx context.Context, tx *gorm.DB, req dto.PaginationRequest, city string) (dto.GetHotelRepositoryResponse, error)
	}

	hotelRepository struct {
		db *gorm.DB
	}
)

func NewHotelRepository(db *gorm.DB) HotelRepository {
	return &hotelRepository{
		db: db,
	}
}

func (r *hotelRepository) RegisterHotel(ctx context.Context, tx *gorm.DB, hotel entity.Hotel) (entity.Hotel, error) {
	if tx == nil {
		tx = r.db
	}

	if err := tx.WithContext(ctx).Create(&hotel).Error; err != nil {
		return entity.Hotel{}, err
	}

	return hotel, nil
}

func (r *hotelRepository) UpdateHotel(ctx context.Context, tx *gorm.DB, hotel entity.Hotel, hotelId string) (entity.Hotel, error) {
	if tx == nil {
		tx = r.db
	}

	if err := tx.WithContext(ctx).Model(&entity.Hotel{}).Where("id = ?", hotelId).Updates(&hotel).Error; err != nil {
		return entity.Hotel{}, err
	}

	return hotel, nil
}

func (r *hotelRepository) GetAllHotel(ctx context.Context, tx *gorm.DB, req dto.PaginationRequest) (dto.GetHotelRepositoryResponse, error) {
	if tx == nil {
		tx = r.db
	}

	var hotels []entity.Hotel
	var err error
	var count int64

	if req.PerPage == 0 {
		req.PerPage = 10
	}

	if req.Page == 0 {
		req.Page = 1
	}

	offset := (req.Page - 1) * req.PerPage

	if err = tx.WithContext(ctx).Model(&entity.Hotel{}).Count(&count).Error; err != nil {
		return dto.GetHotelRepositoryResponse{}, err
	}

	if err = tx.WithContext(ctx).Limit(req.PerPage).Offset(offset).Find(&hotels).Error; err != nil {
		return dto.GetHotelRepositoryResponse{}, err
	}

	totalPage := int64(math.Ceil(float64(count) / float64(req.PerPage)))


	return dto.GetHotelRepositoryResponse{
		Hotels: hotels,
		PaginationResponse: dto.PaginationResponse{
			Page:    req.Page,
			PerPage: req.PerPage,
			MaxPage: totalPage,
			Count:   count,
		},
	}, nil
}

func (r *hotelRepository) GetHotelById(ctx context.Context, tx *gorm.DB, hotelId string) (entity.Hotel, error) {
	if tx == nil {
		tx = r.db
	}

	var hotel entity.Hotel

	if err := tx.WithContext(ctx).Where("id = ?", hotelId).First(&hotel).Error; err != nil {
		return entity.Hotel{}, err
	}

	return hotel, nil
}

func (r *hotelRepository) DeleteHotel(ctx context.Context, tx *gorm.DB, hotelId string) error {
	if tx == nil {
		tx = r.db
	}

	if err := tx.WithContext(ctx).Where("id = ?", hotelId).Delete(&entity.Hotel{}).Error; err != nil {
		return err
	}

	return nil
}

func (r *hotelRepository) CityList(ctx context.Context, tx *gorm.DB) ([]string, error) {
	if tx == nil {
		tx = r.db
	}

	var cities []string

	if err := tx.WithContext(ctx).Model(&entity.Hotel{}).Select("city").Group("city").Find(&cities).Error; err != nil {
		return nil, err
	}

	return cities, nil
}

func (r *hotelRepository) GetHotelByCity(ctx context.Context, tx *gorm.DB, req dto.PaginationRequest, city string) (dto.GetHotelRepositoryResponse, error) {
	if tx == nil {
		tx = r.db
	}

	var hotels []entity.Hotel
	var count int64
	var err error

	if req.PerPage == 0 {
		req.PerPage = 10
	}

	if req.Page == 0 {
		req.Page = 1
	}

	offset := (req.Page - 1) * req.PerPage

	if err = tx.WithContext(ctx).Model(&entity.Hotel{}).Where("city = ?", city).Count(&count).Error; err != nil {
		return dto.GetHotelRepositoryResponse{}, err
	}

	if err = tx.WithContext(ctx).Model(&entity.Hotel{}).Where("city = ?", city).Limit(req.PerPage).Offset(offset).Find(&hotels).Error; err != nil {
		return dto.GetHotelRepositoryResponse{}, err
	}

	totalPage := int64(math.Ceil(float64(count) / float64(req.PerPage)))

	return dto.GetHotelRepositoryResponse{
		Hotels: hotels,
		PaginationResponse: dto.PaginationResponse{
			Page:    req.Page,
			PerPage: req.PerPage,
			MaxPage: totalPage,
			Count:   count,
		},
	}, nil
}