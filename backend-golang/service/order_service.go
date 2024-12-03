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
		CreateOrder(ctx context.Context, req dto.OrderCreateRequest, userId string) (dto.OrderCreateResponse, error)
		UpdateOrderStatus(ctx context.Context, orderId string, status string) (string, error)
		GetAllOrder(ctx context.Context, req dto.PaginationRequest) (dto.GetOrderResponse, error)
		GetOrderByUserId(ctx context.Context, req dto.PaginationRequest, userId string) (dto.GetOrderResponse, error)
		GetOrderById(ctx context.Context, orderId string) (dto.OrderSingleResponse, error)
		GetAvailRoomByDate(ctx context.Context, req dto.PaginationRequest, date string) (dto.GetRoomList, error)
		DeleteOrder(ctx context.Context, orderId string) error
		GetBookedDates(ctx context.Context, roomId string) ([]time.Time, error)
	}
	orderService struct {
		orderRepo        repository.OrderRepository
		orderRoomService OrderRoomService
	}
)

func NewOrderService(orderRepo repository.OrderRepository, orderRoomService OrderRoomService) OrderService {
	return &orderService{
		orderRepo:        orderRepo,
		orderRoomService: orderRoomService,
	}
}

func (s *orderService) CreateOrder(ctx context.Context, req dto.OrderCreateRequest, userId string) (dto.OrderCreateResponse, error) {

	userIDInt, err := strconv.ParseInt(userId, 10, 64)
	if err != nil {
		return dto.OrderCreateResponse{}, err
	}

	if req.DateStart > req.DateEnd {
		return dto.OrderCreateResponse{}, fmt.Errorf("date start must be before date end")
	}

	startDate, err := time.Parse("2006-01-02", req.DateStart)
	if err != nil {
		return dto.OrderCreateResponse{}, err
	}

	endDate, err := time.Parse("2006-01-02", req.DateEnd)
	if err != nil {
		return dto.OrderCreateResponse{}, err
	}

	days := int64(endDate.Sub(startDate).Hours()) / 24

	order := entity.Order{
		UserID:    int64(userIDInt),
		Adults:    req.Adults,
		Children:  req.Children,
		Infants:   req.Infants,
		Status:    "PENDING",
		DateStart: req.DateStart,
		DateEnd:   req.DateEnd,
		Days:      days,
		Note:      req.Note,
	}
	createdOrder, err := s.orderRepo.CreateOrder(ctx, nil, order)
	if err != nil {
		return dto.OrderCreateResponse{}, err
	}

	for _, roomId := range req.RoomID {
		orderRoom := dto.OrderRoomCreateRequest{
			OrderID: createdOrder.ID,
			RoomID:  roomId,
		}
		_, err := s.orderRoomService.InsertOrderRoom(ctx, orderRoom)
		if err != nil {
			// Rollback order
			err := s.orderRepo.DeleteOrder(ctx, nil, fmt.Sprintf("%d", createdOrder.ID))
			if err != nil {
				return dto.OrderCreateResponse{}, err
			}
			return dto.OrderCreateResponse{}, err
		}
	}

	roomOrdered, err := s.orderRoomService.GetRoomByOrderId(ctx, createdOrder.ID)
	if err != nil {
		return dto.OrderCreateResponse{}, err
	}

	var totalPrice, maxCapacity int64
	for _, room := range roomOrdered.Rooms {
		totalPrice += room.BasePrice * days
		maxCapacity += room.Capacity
	}
	people := createdOrder.Adults + createdOrder.Children
	if maxCapacity < people {
		err := s.orderRepo.DeleteOrder(ctx, nil, fmt.Sprintf("%d", createdOrder.ID))
		if err != nil {
			return dto.OrderCreateResponse{}, err
		}
		return dto.OrderCreateResponse{}, fmt.Errorf("total capacity of rooms is not enough")
	}

	_, err = s.orderRepo.UpdateTotalPrice(ctx, nil, totalPrice, fmt.Sprintf("%d", createdOrder.ID))
	if err != nil {
		return dto.OrderCreateResponse{}, err
	}

	response := dto.OrderCreateResponse{
		ID:         createdOrder.ID,
		UserID:     createdOrder.UserID,
		Adults:     createdOrder.Adults,
		Children:   createdOrder.Children,
		Infants:    createdOrder.Infants,
		Room:       roomOrdered.Rooms,
		RoomTotal:  roomOrdered.Count,
		Status:     createdOrder.Status,
		DateStart:  createdOrder.DateStart,
		DateEnd:    createdOrder.DateEnd,
		Days:       createdOrder.Days,
		Note:       createdOrder.Note,
		TotalPrice: totalPrice,
	}

	return response, nil
}

func (s *orderService) GetAllOrder(ctx context.Context, req dto.PaginationRequest) (dto.GetOrderResponse, error) {
	orders, err := s.orderRepo.GetAllOrder(ctx, nil, req)
	if err != nil {
		return dto.GetOrderResponse{}, err
	}

	listOrders, err := s.OrderProcessing(ctx, orders)
	if err != nil {
		return dto.GetOrderResponse{}, err
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

func (s *orderService) GetOrderByUserId(ctx context.Context, req dto.PaginationRequest, userId string) (dto.GetOrderResponse, error) {
	orders, err := s.orderRepo.GetOrderByUserId(ctx, nil, req, userId)
	if err != nil {
		return dto.GetOrderResponse{}, err
	}

	listOrders, err := s.OrderProcessing(ctx, orders)
	if err != nil {
		return dto.GetOrderResponse{}, err
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

func (s *orderService) GetOrderById(ctx context.Context, orderId string) (dto.OrderSingleResponse, error) {
	order, err := s.orderRepo.GetOrderById(ctx, nil, orderId)
	if err != nil {
		return dto.OrderSingleResponse{}, err
	}

	rooms, err := s.orderRoomService.GetRoomByOrderId(ctx, order.ID)
	if err != nil {
		return dto.OrderSingleResponse{}, err
	}

	orderedRooms, err := SingleRoomProcessing(rooms)
	if err != nil {
		return dto.OrderSingleResponse{}, err
	}

	response := dto.OrderSingleResponse{
		ID:         order.ID,
		UserID:     order.UserID,
		Username:   order.User.Name,
		Room:       orderedRooms,
		RoomTotal:  rooms.Count,
		Adults:     order.Adults,
		Children:   order.Children,
		Infants:    order.Infants,
		Status:     order.Status,
		DateStart:  order.DateStart,
		DateEnd:    order.DateEnd,
		Note:       order.Note,
		TotalPrice: order.TotalPrice,
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
			Capacity:    room.Capacity,
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
	startDate := currentDate.Add(24 * time.Hour)    // H+1, yaitu besok
	endDate := currentDate.Add(30 * 24 * time.Hour) // H+30, yaitu 30 hari ke depan

	// Mengubah bookedDates menjadi array tanggal dalam rentang yang dipesan
	var blockedDates []time.Time
	for _, order := range bookedDates {

		for date := order.DateStart; date.Before(order.DateEnd) || date.Equal(order.DateEnd); date = date.AddDate(0, 0, 1) {
			if date.After(startDate.AddDate(0, 0, -1)) && date.Before(endDate.AddDate(0, 0, 1)) {
				blockedDates = append(blockedDates, date)
			}
		}
	}

	return blockedDates, nil
}

func SingleRoomProcessing(rooms dto.OrderRoomData) ([]dto.RoomResponse, error) {
	var orderedRooms []dto.RoomResponse
	for _, room := range rooms.Rooms {
		var roomName string
		if room.Name == "" {
			roomName = "Room deleted"
		} else {
			roomName = room.Name
		}

		var hotelName string
		if room.HotelName == "" {
			hotelName = "Room or Hotel deleted"
		} else {
			hotelName = room.HotelName
		}

		orderedRooms = append(orderedRooms, dto.RoomResponse{
			ID:          room.ID,
			Name:        roomName,
			HotelID:     room.HotelID,
			HotelName:   hotelName,
			ImageUrl:    room.ImageUrl,
			Type:        room.Type,
			BasePrice:   room.BasePrice,
			Capacity:    room.Capacity,
			Description: room.Description,
		})
	}

	return orderedRooms, nil
}

func (s *orderService) OrderProcessing(ctx context.Context, orders dto.GetOrderRepositoryResponse) ([]dto.OrderSingleResponse, error) {
	var listOrders []dto.OrderSingleResponse
	for _, order := range orders.Orders {
		rooms, err := s.orderRoomService.GetRoomByOrderId(ctx, order.ID)
		if err != nil {
			return []dto.OrderSingleResponse{}, err
		}

		orderedRooms, err := SingleRoomProcessing(rooms)
		if err != nil {
			return []dto.OrderSingleResponse{}, err
		}

		listOrders = append(listOrders, dto.OrderSingleResponse{
			ID:         order.ID,
			UserID:     order.UserID,
			Username:   order.User.Name,
			Room:       orderedRooms,
			RoomTotal:  rooms.Count,
			Adults:     order.Adults,
			Children:   order.Children,
			Infants:    order.Infants,
			Status:     order.Status,
			DateStart:  order.DateStart,
			DateEnd:    order.DateEnd,
			Note:       order.Note,
			TotalPrice: order.TotalPrice,
		})
	}

	return listOrders, nil

}
