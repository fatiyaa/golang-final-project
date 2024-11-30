package service

import (
	"context"
	"github.com/fatiyaa/golang-final-project/dto"
	"github.com/fatiyaa/golang-final-project/entity"
	"github.com/fatiyaa/golang-final-project/repository"
)

type (
	HotelService interface {
		RegisterHotel(ctx context.Context, req dto.HotelCreateRequest) (dto.HotelCreateRequest, error)
		UpdateHotel(ctx context.Context, req dto.HotelUpdateRequest, hotrlId string) (dto.HotelUpdateRequest, error)
		GetAllHotel(ctx context.Context, req dto.PaginationRequest) (dto.GetHotelRepositoryResponse, error)
		GetHotelById(ctx context.Context, hotelId string) (dto.HotelResponse, error)
		DeleteHotel(ctx context.Context, hotelId string) error
	}

	hotelService struct {
		hotelRepo repository.HotelRepository
	}
)

func NewHotelService(hotelRepo repository.HotelRepository) HotelService {
	return &hotelService{
		hotelRepo: hotelRepo,
	}
}

func (s *hotelService) RegisterHotel(ctx context.Context, req dto.HotelCreateRequest) (dto.HotelCreateRequest, error) {
	hotel := entity.Hotel{
		Name:        req.Name,
		ImageUrl:    req.ImageUrl,
		City:        req.City,
		Address:     req.Address,
		PhoneNumber: req.PhoneNumber,
		Email:       req.Email,
		Rating:      req.Rating,
		Description: req.Description,
	}

	createdhotel, err := s.hotelRepo.RegisterHotel(ctx, nil, hotel)
	if err != nil {
		return dto.HotelCreateRequest{}, err
	}

	response := dto.HotelCreateRequest{
		Name:        createdhotel.Name,
		ImageUrl:    createdhotel.ImageUrl,
		City:        createdhotel.City,
		Address:     createdhotel.Address,
		PhoneNumber: createdhotel.PhoneNumber,
		Email:       createdhotel.Email,
		Rating:      createdhotel.Rating,
		Description: createdhotel.Description,
	}

	return response, nil
}

func (s *hotelService) UpdateHotel(ctx context.Context, req dto.HotelUpdateRequest, hotelId string) (dto.HotelUpdateRequest, error) {
	hotel := entity.Hotel{
		Name:        req.Name,
		ImageUrl:    req.ImageUrl,
		City:        req.City,
		Address:     req.Address,
		PhoneNumber: req.PhoneNumber,
		Email:       req.Email,
		Rating:      req.Rating,
		Description: req.Description,
	}

	updatedhotel, err := s.hotelRepo.UpdateHotel(ctx, nil, hotel, hotelId)
	if err != nil {
		return dto.HotelUpdateRequest{}, err
	}

	response := dto.HotelUpdateRequest{
		Name:        updatedhotel.Name,
		ImageUrl:    updatedhotel.ImageUrl,
		City:        updatedhotel.City,
		Address:     updatedhotel.Address,
		PhoneNumber: updatedhotel.PhoneNumber,
		Email:       updatedhotel.Email,
		Rating:      updatedhotel.Rating,
		Description: updatedhotel.Description,
	}

	return response, nil
}

func (s *hotelService) GetAllHotel(ctx context.Context, req dto.PaginationRequest) (dto.GetHotelRepositoryResponse, error) {
	hotels, err := s.hotelRepo.GetAllHotel(ctx, nil, req)
	if err != nil {
		return dto.GetHotelRepositoryResponse{}, err
	}

	response := dto.GetHotelRepositoryResponse{
		Hotels: hotels.Hotels,
		PaginationResponse: dto.PaginationResponse{
			Page:    hotels.Page,
			PerPage: hotels.PerPage,
			Count:   hotels.Count,
			MaxPage: hotels.MaxPage,
		},
	}

	return response, nil
}

func (s *hotelService) GetHotelById(ctx context.Context, hotelId string) (dto.HotelResponse, error) {
	hotel, err := s.hotelRepo.GetHotelById(ctx, nil, hotelId)
	if err != nil {
		return dto.HotelResponse{}, err
	}

	response := dto.HotelResponse{
		ID:          hotel.ID,
		Name:        hotel.Name,
		ImageUrl:    hotel.ImageUrl,
		Address:     hotel.Address,
		City:        hotel.City,
		PhoneNumber: hotel.PhoneNumber,
		Email:       hotel.Email,
		Rating:      hotel.Rating,
		Description: hotel.Description,
	}

	return response, nil
}

func (s *hotelService) DeleteHotel(ctx context.Context, hotelId string) error {
	err := s.hotelRepo.DeleteHotel(ctx, nil, hotelId)
	if err != nil {
		return err
	}

	return nil
}