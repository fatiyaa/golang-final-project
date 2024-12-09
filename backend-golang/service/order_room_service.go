package service

import (
	"context"
	"fmt"

	"github.com/fatiyaa/golang-final-project/dto"
	"github.com/fatiyaa/golang-final-project/entity"
	"github.com/fatiyaa/golang-final-project/repository"
)

type (
	OrderRoomService interface {
		InsertOrderRoom(ctx context.Context, orderRoom dto.OrderRoomCreateRequest) (dto.OrderRoomCreateRequest, error)
		GetRoomByOrderId(ctx context.Context, orderId int64) (dto.OrderRoomData, error)
	}

	orderRoomService struct {
		orderRoomRepo repository.OrderRoomRepository
		roomService   RoomService
	}
)

func NewOrderRoomService(orderRoomRepo repository.OrderRoomRepository, roomService RoomService) OrderRoomService {
	return &orderRoomService{
		orderRoomRepo: orderRoomRepo,
		roomService:   roomService,
	}
}

func (s *orderRoomService) InsertOrderRoom(ctx context.Context, orderRoom dto.OrderRoomCreateRequest) (dto.OrderRoomCreateRequest, error) {
	_, err := s.roomService.GetRoomById(ctx, fmt.Sprintf("%d", orderRoom.RoomID))
	if err != nil {
		return dto.OrderRoomCreateRequest{}, err
	}

	order := entity.OrderRoom{
		OrderID: orderRoom.OrderID,
		RoomID:  orderRoom.RoomID,
	}

	createdOrderRoom, err := s.orderRoomRepo.InsertOrderRoom(ctx, nil, order)
	if err != nil {
		return dto.OrderRoomCreateRequest{}, err
	}

	response := dto.OrderRoomCreateRequest{
		OrderID: createdOrderRoom.OrderID,
		RoomID:  createdOrderRoom.RoomID,
	}

	return response, nil
}

func (s *orderRoomService) GetRoomByOrderId(ctx context.Context, orderId int64) (dto.OrderRoomData, error) {
	rooms, err := s.orderRoomRepo.GetRoomByOrderId(ctx, nil, orderId)
	if err != nil {
		return dto.OrderRoomData{}, err
	}

	count := len(rooms)

	var roomResponse []dto.RoomResponse
	for _, room := range rooms {
		roomResponse = append(roomResponse, dto.RoomResponse{
			ID:          room.Room.ID,
			Name:        room.Room.Name,
			HotelID:     room.Room.HotelID,
			HotelName:   room.Room.Hotel.Name,
			ImageUrl:    room.Room.ImageUrl,
			Type:        room.Room.Type,
			BasePrice:   room.Room.BasePrice,
			Capacity:    room.Room.Capacity,
			Description: room.Room.Description,
		})
	}

	response := dto.OrderRoomData{
		Rooms: roomResponse,
		Count: int64(count),
	}

	return response, nil
}
