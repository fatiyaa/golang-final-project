package service

import (
	"context"
	"fmt"
	"strconv"
	"time"

	"github.com/fatiyaa/golang-final-project/dto"
	"github.com/fatiyaa/golang-final-project/entity"
	"github.com/fatiyaa/golang-final-project/repository"
)

type (
	OrderService interface {
		CreateOrder(ctx context.Context, req dto.OrderCreateRequest, userId string) (dto.OrderCreateRequest, error)
		UpdateOrderStatus(ctx context.Context, orderId string, status string) (string, error)
		GetAllOrder(ctx context.Context, req dto.PaginationRequest) (dto.GetOrderResponse, error)
		GetOrderById(ctx context.Context, orderId string) (dto.OrderResponse, error)
		GetAvailRoomByDate(ctx context.Context, req dto.PaginationRequest, date string) (dto.GetRoomList, error)
		DeleteOrder(ctx context.Context, orderId string) error
		GetBookedDates(ctx context.Context, roomId string) ([]time.Time, error)
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

	if req.DateStart > req.DateEnd {
		return dto.OrderCreateRequest{}, fmt.Errorf("date start must be before date end")
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
		RoomID:    createdOrder.RoomID,
		DateStart: createdOrder.DateStart,
		DateEnd:   createdOrder.DateEnd,
		Note:      createdOrder.Note,
	}

	return response, nil
}

func (s *orderService) GetAllOrder(ctx context.Context, req dto.PaginationRequest) (dto.GetOrderResponse, error) {
	orders, err := s.orderRepo.GetAllOrder(ctx, nil, req)
	if err != nil {
		return dto.GetOrderResponse{}, err
	}

	var listOrders []dto.OrderResponse
	for _, order := range orders.Orders {
		startDate, err := time.Parse("2006-01-02", order.DateStart)
		if err != nil {
			return dto.GetOrderResponse{}, err
		}
		endDate, err := time.Parse("2006-01-02", order.DateEnd)
		if err != nil {
			return dto.GetOrderResponse{}, err
		}
		price := order.Room.BasePrice * ((int64(endDate.Sub(startDate).Hours()) / 24) + 1)

		var roomName string
		if order.Room.Name == "" {
			roomName = "Room deleted"
		} else {
			roomName = order.Room.Name
		}

		var hotelName string
		if order.Room.Hotel.Name == "" {
			hotelName = "Room or Hotel deleted"
		} else {
			hotelName = order.Room.Hotel.Name
		}

		listOrders = append(listOrders, dto.OrderResponse{
			ID:        order.ID,
			UserID:    order.UserID,
			Username:  order.User.Name,
			RoomID:    order.RoomID,
			RoomName:  roomName,
			HotelID:   order.Room.HotelID,
			HotelName: hotelName,
			Status:    order.Status,
			DateStart: order.DateStart,
			DateEnd:   order.DateEnd,
			Note:      order.Note,
			Price:     price,
		})
	}

	return dto.GetOrderResponse{
		Orders: listOrders,
		PaginationResponse: dto.PaginationResponse{
			Page:    orders.Page,
			PerPage: orders.PerPage,
			Count:   orders.Count,
			MaxPage: orders.MaxPage,
		},
	}, nil

}

func (s *orderService) GetOrderById(ctx context.Context, orderId string) (dto.OrderResponse, error) {
	order, err := s.orderRepo.GetOrderById(ctx, nil, orderId)
	if err != nil {
		return dto.OrderResponse{}, err
	}

	startDate, err := time.Parse("2006-01-02", order.DateStart)
	if err != nil {
		return dto.OrderResponse{}, err
	}
	endDate, err := time.Parse("2006-01-02", order.DateEnd)
	if err != nil {
		return dto.OrderResponse{}, err
	}
	price := order.Room.BasePrice * ((int64(endDate.Sub(startDate).Hours()) / 24) + 1)

	response := dto.OrderResponse{
		ID:        order.ID,
		UserID:    order.UserID,
		Username:  order.User.Name,
		RoomID:    order.RoomID,
		RoomName:  order.Room.Name,
		HotelID:   order.Room.HotelID,
		HotelName: order.Room.Hotel.Name,
		Status:    order.Status,
		DateStart: order.DateStart,
		DateEnd:   order.DateEnd,
		Note:      order.Note,
		Price:     price,
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
			ID:          room.ID,
			Name:        room.Name,
			HotelID:     room.HotelID,
			HotelName:   room.Hotel.Name,
			ImageUrl:    room.ImageUrl,
			Type:        room.Type,
			BasePrice:   room.BasePrice,
			Quantity:    room.Quantity,
			IsAvailable: room.IsAvailable,
			Description: room.Description,
		})
	}
	return dto.GetRoomList{
		Rooms: listRooms,
		PaginationResponse: dto.PaginationResponse{
			Page:    rooms.Page,
			PerPage: rooms.PerPage,
			Count:   rooms.Count,
			MaxPage: rooms.MaxPage,
		},
	}, nil
}

func (s *orderService) UpdateOrderStatus(ctx context.Context, orderId string, status string) (string, error) {
	statuschanged, err := s.orderRepo.UpdateOrderStatus(ctx, nil, status, orderId)
	if err != nil {
		return "", err
	}
	return statuschanged, nil
}

func (s *orderService) DeleteOrder(ctx context.Context, orderId string) error {
	err := s.orderRepo.DeleteOrder(ctx, nil, orderId)
	if err != nil {
		return err
	}
	return nil
}

func (s *orderService) GetBookedDates(ctx context.Context, roomId string) ([]time.Time, error) {
    bookedDates, err := s.orderRepo.GetBookedDates(ctx, nil, roomId)
    if err != nil {
        return nil, err
    }

    currentDate := time.Now()
    startDate := currentDate.Add(24 * time.Hour) // H+1, yaitu besok
    endDate := currentDate.Add(30 * 24 * time.Hour) // H+30, yaitu 30 hari ke depan

    // Mengubah bookedDates menjadi array tanggal dalam rentang yang dipesan
    var blockedDates []time.Time
    for _, order := range bookedDates {
		fmt.Println(order.DateStart)

		for date := order.DateStart; date.Before(order.DateEnd) || date.Equal(order.DateEnd); date = date.AddDate(0, 0, 1) {
			fmt.Println("Loop Date:", date)
			if date.After(startDate.AddDate(0, 0, -1)) && date.Before(endDate.AddDate(0, 0, 1)) {
				fmt.Println("Blocked Date:", date)
				blockedDates = append(blockedDates, date)
			}
		}
    }

    // fmt.Println(blockedDates)

    return blockedDates, nil
}



