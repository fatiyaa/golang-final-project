package service

import (
	"context"
	"strconv"

	"github.com/fatiyaa/golang-final-project/dto"
	"github.com/fatiyaa/golang-final-project/entity"
	"github.com/fatiyaa/golang-final-project/repository"
)

type (
	OrderService interface {
		CreateOrder(ctx context.Context, req dto.OrderCreateRequest, userId string) (dto.OrderCreateRequest, error)
		GetAllOrder(ctx context.Context, req dto.PaginationRequest) (dto.GetOrderRepositoryResponse, error)
		GetOrderById(ctx context.Context, orderId string) (dto.OrderResponse, error)
		GetAvailRoomByDate(ctx context.Context, req dto.PaginationRequest, date string) (dto.GetRoomList, error)
	}
	orderService struct {
		orderRepo repository.OrderRepository
	}
)

func NewOrderService(orderRepo repository.OrderRepository) OrderService {
	return &orderService{
		orderRepo: orderRepo,
	}
}

func (s *orderService) CreateOrder(ctx context.Context, req dto.OrderCreateRequest, userId string) (dto.OrderCreateRequest, error) {

	userIDInt, err := strconv.ParseInt(userId, 10, 64)
	if err != nil {
		return dto.OrderCreateRequest{}, err
	}
	order := entity.Order{
		UserID:    int64(userIDInt),
		RoomID:    req.RoomID,
		Status:    "PENDING",
		DateStart: req.DateStart,
		DateEnd:   req.DateEnd,
		Note:      req.Note,
	}
	createdOrder, err := s.orderRepo.CreateOrder(ctx, nil, order)
	if err != nil {
		return dto.OrderCreateRequest{}, err
	}

	response := dto.OrderCreateRequest{
		RoomID: createdOrder.RoomID,
		DateStart: createdOrder.DateStart,
		DateEnd: createdOrder.DateEnd,
		Note: createdOrder.Note,
	}

	return response, nil
}

func (s *orderService) GetAllOrder(ctx context.Context, req dto.PaginationRequest) (dto.GetOrderRepositoryResponse, error) {
	orders, err := s.orderRepo.GetAllOrder(ctx, nil, req)
	if err != nil {
		return dto.GetOrderRepositoryResponse{}, err
	}

	return orders, nil
}

func (s *orderService) GetOrderById(ctx context.Context, orderId string) (dto.OrderResponse, error) {
	order, err := s.orderRepo.GetOrderById(ctx, nil, orderId)
	if err != nil {
		return dto.OrderResponse{}, err
	}

	response := dto.OrderResponse{
		ID: order.ID,
		UserID: order.UserID,
		RoomID: order.RoomID,
		Status: order.Status,
		DateStart: order.DateStart,
		DateEnd: order.DateEnd,
		Note: order.Note,
	}

	return response, nil
}

func (s *orderService) GetAvailRoomByDate(ctx context.Context, req dto.PaginationRequest, date string) (dto.GetRoomList, error) {
	rooms, err := s.orderRepo.GetAvailRoomByDate(ctx, nil, req, date)
	if err != nil {
		return dto.GetRoomList{}, err
	}

	var listRooms []dto.RoomResponse
	for _, room := range rooms.Rooms {
		listRooms = append(listRooms, dto.RoomResponse{
			ID: room.ID,
			Name: room.Name,
			HotelID: room.HotelID,
			HotelName: room.Hotel.Name,
			ImageUrl: room.ImageUrl,
			Type: room.Type,
			BasePrice: room.BasePrice,
			Quantity: room.Quantity,
			IsAvailable: room.IsAvailable,
			Description: room.Description,
		})}
	return dto.GetRoomList{
		Rooms: listRooms,
		PaginationResponse: dto.PaginationResponse{
			Page: rooms.Page,
			PerPage: rooms.PerPage,
			Count: rooms.Count,
			MaxPage: rooms.MaxPage,
		},

	}, nil
}
