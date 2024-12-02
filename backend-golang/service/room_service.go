package service

import (
	"context"
	"fmt"

	"github.com/fatiyaa/golang-final-project/dto"
	"github.com/fatiyaa/golang-final-project/entity"
	"github.com/fatiyaa/golang-final-project/repository"
	"github.com/fatiyaa/golang-final-project/utils"
	"github.com/google/uuid"
)

type (
	RoomService interface {
		RegisterRoom(ctx context.Context, req dto.RoomCreateRequest) (dto.RoomCreateRequest, error)
		UpdateRoom(ctx context.Context, req dto.RoomUpdateRequest, roomId string) (dto.RoomUpdateRequest, error)
		GetAllRoom(ctx context.Context, req dto.PaginationRequest) (dto.GetRoomList, error)
		GetRoomByHotel(ctx context.Context, req dto.PaginationRequest, hotelId string) (dto.GetRoomList, error)
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

	var filename string

	if req.Image != nil {
		imageId := uuid.New()
		ext := utils.GetExtensions(req.Image.Filename)

		filename = fmt.Sprintf("room/%s.%s", imageId, ext)
		if err := utils.UploadFile(req.Image, filename); err != nil {
			return dto.RoomCreateRequest{}, err
		}
	}

	room := entity.Room{
		Name:        req.Name,
		HotelID:     req.HotelID,
		ImageUrl:    filename,
		Type:        req.Type,
		BasePrice:   req.BasePrice,
		Capacity:    req.Capacity,
		Description: req.Description,
	}

	createdRoom, err := s.roomRepo.CreateRoom(ctx, nil, room)
	if err != nil {
		return dto.RoomCreateRequest{}, err
	}

	response := dto.RoomCreateRequest{
		Name:        createdRoom.Name,
		HotelID:     createdRoom.HotelID,
		ImageUrl:    createdRoom.ImageUrl,
		Type:        createdRoom.Type,
		BasePrice:   createdRoom.BasePrice,
		Capacity:    createdRoom.Capacity,
		Description: createdRoom.Description,
	}

	return response, nil
}

func (s *roomService) UpdateRoom(ctx context.Context, req dto.RoomUpdateRequest, roomId string) (dto.RoomUpdateRequest, error) {
	roomData, err := s.roomRepo.GetRoomById(ctx, nil, roomId)
	if err != nil {
		return dto.RoomUpdateRequest{}, err
	}

	var filename string

	if req.Image != nil {
		imageId := uuid.New()
		ext := utils.GetExtensions(req.Image.Filename)

		filename = fmt.Sprintf("room/%s.%s", imageId, ext)
		if err := utils.UploadFile(req.Image, filename); err != nil {
			return dto.RoomUpdateRequest{}, err
		}
		if roomData.ImageUrl != "" {
			if err := utils.DeleteFile(roomData.ImageUrl); err != nil {
				return dto.RoomUpdateRequest{}, err
			}
		}
	} else {
		filename = roomData.ImageUrl
	}

	room := entity.Room{
		Name:        req.Name,
		HotelID:     req.HotelID,
		ImageUrl:    filename,
		Type:        req.Type,
		BasePrice:   req.BasePrice,
		Capacity:    req.Capacity,
		Description: req.Description,
	}

	updatedRoom, err := s.roomRepo.UpdateRoom(ctx, nil, room, roomId)
	if err != nil {
		return dto.RoomUpdateRequest{}, err
	}

	response := dto.RoomUpdateRequest{
		Name:        updatedRoom.Name,
		HotelID:     updatedRoom.HotelID,
		ImageUrl:    updatedRoom.ImageUrl,
		Type:        updatedRoom.Type,
		BasePrice:   updatedRoom.BasePrice,
		Capacity:    updatedRoom.Capacity,
		Description: updatedRoom.Description,
	}

	return response, nil
}

func (s *roomService) GetAllRoom(ctx context.Context, req dto.PaginationRequest) (dto.GetRoomList, error) {
	rooms, err := s.roomRepo.GetAllRoom(ctx, nil, req)
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

	response := dto.GetRoomList{
		Rooms: listRooms,
		PaginationResponse: dto.PaginationResponse{
			Page:    rooms.Page,
			PerPage: rooms.PerPage,
			Count:   rooms.Count,
			MaxPage: rooms.MaxPage,
		},
	}

	return response, nil
}

func (s *roomService) GetRoomByHotel(ctx context.Context, req dto.PaginationRequest, hotelId string) (dto.GetRoomList, error) {
	rooms, err := s.roomRepo.GetRoomByHotel(ctx, nil, req, hotelId)
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

	response := dto.GetRoomList{
		Rooms: listRooms,
		PaginationResponse: dto.PaginationResponse{
			Page:    rooms.Page,
			PerPage: rooms.PerPage,
			Count:   rooms.Count,
			MaxPage: rooms.MaxPage,
		},
	}

	return response, nil
}

func (s *roomService) GetRoomById(ctx context.Context, roomId string) (dto.RoomResponse, error) {
	room, err := s.roomRepo.GetRoomById(ctx, nil, roomId)
	if err != nil {
		return dto.RoomResponse{}, err
	}

	return dto.RoomResponse{
		ID:          room.ID,
		Name:        room.Name,
		HotelID:     room.HotelID,
		HotelName:   room.Hotel.Name,
		ImageUrl:    room.ImageUrl,
		Type:        room.Type,
		BasePrice:   room.BasePrice,
		Capacity:    room.Capacity,
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
