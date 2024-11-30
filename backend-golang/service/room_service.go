package service

import (
	"context"

	"github.com/fatiyaa/golang-final-project/dto"
	"github.com/fatiyaa/golang-final-project/entity"
	"github.com/fatiyaa/golang-final-project/repository"
)

type (
	RoomService interface {
		RegisterRoom(ctx context.Context, req dto.RoomCreateRequest) (dto.RoomCreateRequest, error)
		UpdateRoom(ctx context.Context, req dto.RoomUpdateRequest, roomId string) (dto.RoomUpdateRequest, error)
		GetAllRoom(ctx context.Context, req dto.PaginationRequest) (dto.GetRoomRepositoryResponse, error)
		GetRoomById(ctx context.Context, roomId string) (dto.RoomResponse, error)
		DeleteRoom(ctx context.Context, roomId string) error
	}

	roomService struct {
		roomRepo repository.RoomRepository
	}
)

func NewRoomService(roomRepo repository.RoomRepository) RoomService {
	return &roomService{
		roomRepo: roomRepo,
	}
}

func (s *roomService) RegisterRoom(ctx context.Context, req dto.RoomCreateRequest) (dto.RoomCreateRequest, error) {
	room := entity.Room{
		Name:    req.Name,
		HotelID: req.HotelID,
		ImageUrl: req.ImageUrl,
		Type: req.Type,
		BasePrice: req.BasePrice,
		Quantity: req.Quantity,
		IsAvailable: req.IsAvailable,
		Description: req.Description,
	}

	createdRoom, err := s.roomRepo.CreateRoom(ctx, nil, room)
	if err != nil {
		return dto.RoomCreateRequest{}, err
	}

	response := dto.RoomCreateRequest{
		Name: createdRoom.Name,
		HotelID: createdRoom.HotelID,
		ImageUrl: createdRoom.ImageUrl,
		Type: createdRoom.Type,
		BasePrice: createdRoom.BasePrice,
		Quantity: createdRoom.Quantity,
		IsAvailable: createdRoom.IsAvailable,
		Description: createdRoom.Description,
	}

	return response, nil
}

func (s *roomService) UpdateRoom(ctx context.Context, req dto.RoomUpdateRequest, roomId string) (dto.RoomUpdateRequest, error) {
	room := entity.Room{
		Name:    req.Name,
		HotelID: req.HotelID,
		ImageUrl: req.ImageUrl,
		Type: req.Type,
		BasePrice: req.BasePrice,
		Quantity: req.Quantity,
		IsAvailable: req.IsAvailable,
		Description: req.Description,
	}

	updatedRoom, err := s.roomRepo.UpdateRoom(ctx, nil, room, roomId)
	if err != nil {
		return dto.RoomUpdateRequest{}, err
	}

	response := dto.RoomUpdateRequest{
		Name: updatedRoom.Name,
		HotelID: updatedRoom.HotelID,
		ImageUrl: updatedRoom.ImageUrl,
		Type: updatedRoom.Type,
		BasePrice: updatedRoom.BasePrice,
		Quantity: updatedRoom.Quantity,
		IsAvailable: updatedRoom.IsAvailable,
		Description: updatedRoom.Description,
	}

	return response, nil
}

func (s *roomService) GetAllRoom(ctx context.Context, req dto.PaginationRequest) (dto.GetRoomRepositoryResponse, error) {
	rooms, err := s.roomRepo.GetAllRoom(ctx, nil, req)
	if err != nil {
		return dto.GetRoomRepositoryResponse{}, err
	}

	return rooms, nil
}

func (s *roomService) GetRoomById(ctx context.Context, roomId string) (dto.RoomResponse, error) {
	room, err := s.roomRepo.GetRoomById(ctx, nil, roomId)
	if err != nil {
		return dto.RoomResponse{}, err
	}

	return dto.RoomResponse{
		ID: room.ID,
		Name: room.Name,
		HotelID: room.HotelID,
		ImageUrl: room.ImageUrl,
		Type: room.Type,
		BasePrice: room.BasePrice,
		Quantity: room.Quantity,
		IsAvailable: room.IsAvailable,
		Description: room.Description,
	}, nil
}

func (s *roomService) DeleteRoom(ctx context.Context, roomId string) error {
	err := s.roomRepo.DeleteRoom(ctx, nil, roomId)
	if err != nil {
		return err
	}

	return nil
}