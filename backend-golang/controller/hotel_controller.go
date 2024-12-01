package controller

import (
	"net/http"

	"github.com/fatiyaa/golang-final-project/service"
	"github.com/fatiyaa/golang-final-project/utils"
	"github.com/fatiyaa/golang-final-project/dto"
	"github.com/gin-gonic/gin"
)

type (
	HotelController interface {
		Register(ctx *gin.Context)
		Update(ctx *gin.Context)
		GetAllHotel(ctx *gin.Context)
		GetHotelById(ctx *gin.Context)
		Delete(ctx *gin.Context)
		CityList(ctx *gin.Context)
		GetHotelByCity(ctx *gin.Context)
	}

	hotelController struct {
		hotelService service.HotelService
	}
)

func NewHotelController(hs service.HotelService) HotelController {
	return &hotelController{
		hotelService: hs,
	}
}

func (c *hotelController) Register(ctx *gin.Context) {
	var hotel dto.HotelCreateRequest
	if err := ctx.ShouldBind(&hotel); err != nil {
		res := utils.BuildResponseFailed(dto.MESSAGE_FAILED_GET_DATA_FROM_BODY, err.Error(), nil)
		ctx.AbortWithStatusJSON(http.StatusBadRequest, res)
		return
	}

	result, err := c.hotelService.RegisterHotel(ctx.Request.Context(), hotel)
	if err != nil {
		res := utils.BuildResponseFailed(dto.MESSAGE_FAILED_REGISTER_HOTEL, err.Error(), nil)
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	res := utils.BuildResponseSuccess(dto.MESSAGE_SUCCESS_REGISTER_HOTEL, result)
	ctx.JSON(http.StatusOK, res)
}

func (c *hotelController) Update(ctx *gin.Context) {

	hotelId := ctx.Param("id")
	_, err := c.hotelService.GetHotelById(ctx.Request.Context(), hotelId)
	if err != nil {
		res := utils.BuildResponseFailed(dto.MESSAGE_FAILED_GET_HOTEL, err.Error(), nil)
		ctx.JSON(http.StatusBadRequest, res)
		return
	}
	
	var hotel dto.HotelUpdateRequest
	if err := ctx.ShouldBind(&hotel); err != nil {
		res := utils.BuildResponseFailed(dto.MESSAGE_FAILED_GET_DATA_FROM_BODY, err.Error(), nil)
		ctx.AbortWithStatusJSON(http.StatusBadRequest, res)
		return
	}

	result, err := c.hotelService.UpdateHotel(ctx.Request.Context(), hotel, hotelId)
	if err != nil {
		res := utils.BuildResponseFailed(dto.MESSAGE_FAILED_UPDATE_HOTEL, err.Error(), nil)
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	res := utils.BuildResponseSuccess(dto.MESSAGE_SUCCESS_UPDATE_HOTEL, result)
	ctx.JSON(http.StatusOK, res)
}

func (c *hotelController) GetAllHotel(ctx *gin.Context) {
	var req dto.PaginationRequest
	if err := ctx.ShouldBind(&req); err != nil {
		res := utils.BuildResponseFailed(dto.MESSAGE_FAILED_GET_DATA_FROM_BODY, err.Error(), nil)
		ctx.AbortWithStatusJSON(http.StatusBadRequest, res)
		return
	}

	result, err := c.hotelService.GetAllHotel(ctx.Request.Context(), req)
	if err != nil {
		res := utils.BuildResponseFailed(dto.MESSAGE_FAILED_GET_LIST_HOTEL, err.Error(), nil)
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	resp := utils.BuildResponseSuccess(dto.MESSAGE_SUCCESS_GET_LIST_HOTEL, result)
	ctx.JSON(http.StatusOK, resp)
}

func (c *hotelController) GetHotelById(ctx *gin.Context) {
	hotelId := ctx.Param("id")
	result, err := c.hotelService.GetHotelById(ctx.Request.Context(), hotelId)
	if err != nil {
		res := utils.BuildResponseFailed(dto.MESSAGE_FAILED_GET_HOTEL, err.Error(), nil)
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	res := utils.BuildResponseSuccess(dto.MESSAGE_SUCCESS_GET_HOTEL, result)
	ctx.JSON(http.StatusOK, res)
}

func (c *hotelController) Delete(ctx *gin.Context) {
	hotelId := ctx.Param("id")

	if err := c.hotelService.DeleteHotel(ctx.Request.Context(), hotelId); err != nil {
		res := utils.BuildResponseFailed(dto.MESSAGE_FAILED_DELETE_HOTEL, err.Error(), nil)
		ctx.AbortWithStatusJSON(http.StatusBadRequest, res)
		return
	}

	res := utils.BuildResponseSuccess(dto.MESSAGE_SUCCESS_DELETE_HOTEL, nil)
	ctx.JSON(http.StatusOK, res)
}

func (c *hotelController) CityList(ctx *gin.Context) {
	result, err := c.hotelService.CityList(ctx.Request.Context())
	if err != nil {
		res := utils.BuildResponseFailed(dto.MESSAGE_FAILED_GET_CITY_LIST, err.Error(), nil)
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	res := utils.BuildResponseSuccess(dto.MESSAGE_SUCCESS_GET_CITY_LIST, result)
	ctx.JSON(http.StatusOK, res)
}

func (c *hotelController) GetHotelByCity(ctx *gin.Context) {
	var req dto.PaginationRequest
	if err := ctx.ShouldBind(&req); err != nil {
		res := utils.BuildResponseFailed(dto.MESSAGE_FAILED_GET_DATA_FROM_BODY, err.Error(), nil)
		ctx.AbortWithStatusJSON(http.StatusBadRequest, res)
		return
	}
	city := ctx.Query("city")
	result, err := c.hotelService.GetHotelByCity(ctx.Request.Context(), req, city)
	if err != nil {
		res := utils.BuildResponseFailed(dto.MESSAGE_FAILED_GET_HOTEL, err.Error(), nil)
		ctx.JSON(http.StatusBadRequest, res)
		return
	}

	res := utils.BuildResponseSuccess(dto.MESSAGE_SUCCESS_GET_HOTEL, result)
	ctx.JSON(http.StatusOK, res)
}