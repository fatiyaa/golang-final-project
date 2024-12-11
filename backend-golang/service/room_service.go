package service

import (
	"context"
	"fmt"
	"math/rand"

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

	var ROOM_IMAGE = []string{ "https://bookings.ayana.com/_next/image?url=https%3A%2F%2Fs3.ap-southeast-1.amazonaws.com%2Fcms-asset.ayana.com%2FFull_Ocean_View_Room_bathroom_1740x978_min_f514475994.png&w=1920&q=75&dpl=dpl_EQzEgNWoWKgWMFrPAHn6BKgNSSWW",
	"https://bookings.ayana.com/_next/image?url=https%3A%2F%2Fs3.ap-southeast-1.amazonaws.com%2Fcms-asset.ayana.com%2F870x489_KMD_Full_Ocean_View_Room2_fc499e53d7.jpg&w=1920&q=75&dpl=dpl_EQzEgNWoWKgWMFrPAHn6BKgNSSWW",
	"https://bookings.ayana.com/_next/image?url=https%3A%2F%2Fs3.ap-southeast-1.amazonaws.com%2Fcms-asset.ayana.com%2FFull_Ocean_View_Room_min_1740x978_3baa92a9f4.png&w=1920&q=75&dpl=dpl_EQzEgNWoWKgWMFrPAHn6BKgNSSWW",
	"https://bookings.ayana.com/_next/image?url=https%3A%2F%2Fs3.ap-southeast-1.amazonaws.com%2Fcms-asset.ayana.com%2FAKWB_Deluxe_Ocean_View_Room_Bathroom_1740x978_1cc8ce33a8.png&w=1920&q=75&dpl=dpl_EQzEgNWoWKgWMFrPAHn6BKgNSSWW",
	"https://bookings.ayana.com/_next/image?url=https%3A%2F%2Fs3.ap-southeast-1.amazonaws.com%2Fcms-asset.ayana.com%2FAKWB_Deluxe_Ocean_View_Room_3_1740x978_43094206a8.png&w=1920&q=75&dpl=dpl_EQzEgNWoWKgWMFrPAHn6BKgNSSWW",
	"https://bookings.ayana.com/_next/image?url=https%3A%2F%2Fs3.ap-southeast-1.amazonaws.com%2Fcms-asset.ayana.com%2FAKWB_Deluxe_Ocean_View_Room_2_1740x978_9b05f668db.png&w=1920&q=75&dpl=dpl_EQzEgNWoWKgWMFrPAHn6BKgNSSWW",
	"https://bookings.ayana.com/_next/image?url=https%3A%2F%2Fs3.ap-southeast-1.amazonaws.com%2Fcms-asset.ayana.com%2FAKWB_Ocean_View_Suite_Bathroom_1_1740x978_7699c4c8a9.png&w=1920&q=75&dpl=dpl_EQzEgNWoWKgWMFrPAHn6BKgNSSWW",
	"https://bookings.ayana.com/_next/image?url=https%3A%2F%2Fs3.ap-southeast-1.amazonaws.com%2Fcms-asset.ayana.com%2FAKWB_Ocean_View_Suite_Bathroom_2_1740x978_6917cb5cb7.png&w=1920&q=75&dpl=dpl_EQzEgNWoWKgWMFrPAHn6BKgNSSWW",
	"https://bookings.ayana.com/_next/image?url=https%3A%2F%2Fs3.ap-southeast-1.amazonaws.com%2Fcms-asset.ayana.com%2F1740x978_KMD_Rooms_OVS_4_a263f5a215.png&w=1920&q=75&dpl=dpl_EQzEgNWoWKgWMFrPAHn6BKgNSSWW",
	"https://bookings.ayana.com/_next/image?url=https%3A%2F%2Fs3.ap-southeast-1.amazonaws.com%2Fcms-asset.ayana.com%2FAKWB_Ocean_View_Suite_1_1740x978_a1b2007877.png&w=1920&q=75&dpl=dpl_EQzEgNWoWKgWMFrPAHn6BKgNSSWW",
	"https://bookings.ayana.com/_next/image?url=https%3A%2F%2Fs3.ap-southeast-1.amazonaws.com%2Fcms-asset.ayana.com%2FAKWB_Ocean_View_Suite_2_1740x978_a6d48d3b80.png&w=3840&q=75&dpl=dpl_EQzEgNWoWKgWMFrPAHn6BKgNSSWW",
	"https://bookings.ayana.com/_next/image?url=https%3A%2F%2Fs3.ap-southeast-1.amazonaws.com%2Fcms-asset.ayana.com%2F870x489_Rooms_OVS_9f73808f93.jpg&w=1920&q=75&dpl=dpl_EQzEgNWoWKgWMFrPAHn6BKgNSSWW",
	}

	if req.Image != nil {
		imageId := uuid.New()
		ext := utils.GetExtensions(req.Image.Filename)

		filename = fmt.Sprintf("room/%s.%s", imageId, ext)
		if err := utils.UploadFile(req.Image, filename); err != nil {
			return dto.RoomCreateRequest{}, err
		}
	}else{
		randomInt := rand.Intn(len(ROOM_IMAGE))
		filename = ROOM_IMAGE[randomInt]
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
