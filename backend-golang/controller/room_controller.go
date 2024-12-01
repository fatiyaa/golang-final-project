package controller

import (
	"net/http"

	"github.com/fatiyaa/golang-final-project/dto"
	"github.com/fatiyaa/golang-final-project/service"
	"github.com/fatiyaa/golang-final-project/utils"
	"github.com/gin-gonic/gin"
)

type (
	RoomController interface {
		CreateRoom(ctx *gin.Context)
		UpdateRoom(ctx *gin.Context)
		GetAllRoom(ctx *gin.Context)
		GetRoomByHotel(ctx *gin.Context)
		GetRoomById(ctx *gin.Context)
		DeleteRoom(ctx *gin.Context)
	}

	roomController struct {
		roomService service.RoomService
	}
)

func NewRoomController(rs service.RoomService) RoomController {
	return &roomController{
		roomService: rs,
	}
}

func (c *roomController) CreateRoom(ctx *gin.Context) {
	var roomCreateRequest dto.RoomCreateRequest
	if err := ctx.ShouldBind(&roomCreateRequest); err != nil {
		res := utils.BuildResponseFailed(dto.MESSAGE_FAILED_GET_DATA_FROM_BODY, err.Error(), nil)
		ctx.AbortWithStatusJSON(http.StatusBadRequest, res)
		return
	}

	result, err := c.roomService.RegisterRoom(ctx.Request.Context(), roomCreateRequest)
	if err != nil {
		res := utils.BuildResponseFailed(dto.MESSAGE_FAILED_CREATE_ROOM, err.Error(), nil)
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	res := utils.BuildResponseSuccess(dto.MESSAGE_SUCCESS_CREATE_ROOM, result)
	ctx.JSON(http.StatusOK, res)
}

func (c *roomController) UpdateRoom(ctx *gin.Context) {
	roomId := ctx.Param("id")
	var roomUpdateRequest dto.RoomUpdateRequest
	if err := ctx.ShouldBind(&roomUpdateRequest); err != nil {
		res := utils.BuildResponseFailed(dto.MESSAGE_FAILED_GET_DATA_FROM_BODY, err.Error(), nil)
		ctx.AbortWithStatusJSON(http.StatusBadRequest, res)
		return
	}

	result, err := c.roomService.UpdateRoom(ctx.Request.Context(), roomUpdateRequest, roomId)
	if err != nil {
		res := utils.BuildResponseFailed(dto.MESSAGE_FAILED_UPDATE_ROOM, err.Error(), nil)
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	res := utils.BuildResponseSuccess(dto.MESSAGE_SUCCESS_UPDATE_ROOM, result)
	ctx.JSON(http.StatusOK, res)
}

func (c *roomController) GetAllRoom(ctx *gin.Context) {
	var req dto.PaginationRequest
	if err := ctx.ShouldBind(&req); err != nil {
		res := utils.BuildResponseFailed(dto.MESSAGE_FAILED_GET_DATA_FROM_BODY, err.Error(), nil)
		ctx.AbortWithStatusJSON(http.StatusBadRequest, res)
		return
	}

	result, err := c.roomService.GetAllRoom(ctx.Request.Context(), req)
	if err != nil {
		res := utils.BuildResponseFailed(dto.MESSAGE_FAILED_GET_LIST_ROOM, err.Error(), nil)
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	resp := utils.BuildResponseSuccess(dto.MESSAGE_SUCCESS_GET_LIST_ROOM, result)
	ctx.JSON(http.StatusOK, resp)
}

func (c *roomController) GetRoomByHotel(ctx *gin.Context) {
	var req dto.PaginationRequest
	if err := ctx.ShouldBind(&req); err != nil {
		res := utils.BuildResponseFailed(dto.MESSAGE_FAILED_GET_DATA_FROM_BODY, err.Error(), nil)
		ctx.AbortWithStatusJSON(http.StatusBadRequest, res)
		return
	}
	hotelId := ctx.Param("hotel_id")
	result, err := c.roomService.GetRoomByHotel(ctx.Request.Context(), req, hotelId)
	if err != nil {
		res := utils.BuildResponseFailed(dto.MESSAGE_FAILED_GET_ROOM, err.Error(), nil)
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	res := utils.BuildResponseSuccess(dto.MESSAGE_SUCCESS_GET_ROOM, result)
	ctx.JSON(http.StatusOK, res)
}

func (c *roomController) GetRoomById(ctx *gin.Context) {
	roomId := ctx.Param("id")
	result, err := c.roomService.GetRoomById(ctx.Request.Context(), roomId)
	if err != nil {
		res := utils.BuildResponseFailed(dto.MESSAGE_FAILED_GET_ROOM, err.Error(), nil)
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	res := utils.BuildResponseSuccess(dto.MESSAGE_SUCCESS_GET_ROOM, result)
	ctx.JSON(http.StatusOK, res)
}

func (c *roomController) DeleteRoom(ctx *gin.Context) {
	roomId := ctx.Param("id")
	err := c.roomService.DeleteRoom(ctx.Request.Context(), roomId)
	if err != nil {
		res := utils.BuildResponseFailed(dto.MESSAGE_FAILED_DELETE_ROOM, err.Error(), nil)
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	res := utils.BuildResponseSuccess(dto.MESSAGE_SUCCESS_DELETE_ROOM, nil)
	ctx.JSON(http.StatusOK, res)
}
