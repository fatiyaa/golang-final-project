package controller

import (
	"net/http"
	"github.com/fatiyaa/golang-final-project/dto"
	"github.com/fatiyaa/golang-final-project/service"
	"github.com/fatiyaa/golang-final-project/utils"
	"github.com/gin-gonic/gin"
)

type (
	OrderController interface {
		CreateOrder(ctx *gin.Context)
        UpdateOrderStatus(ctx *gin.Context)
		GetAllOrder(ctx *gin.Context)
		GetOrderById(ctx *gin.Context)
        GetAvailRoomByDate(ctx *gin.Context)
        DeleteOrder(ctx *gin.Context)
        GetBookedDates(ctx *gin.Context)
	}

	orderController struct {
		orderService service.OrderService
	}
)

func NewOrderController(os service.OrderService) OrderController {
    return &orderController{
        orderService: os,
    }
}

func (c *orderController) CreateOrder(ctx *gin.Context) {
    userId, ok := ctx.Value("user_id").(string)
    if !ok {
        res := utils.BuildResponseFailed(dto.ErrUserNotFound.Error(), "", nil)
        ctx.AbortWithStatusJSON(http.StatusBadRequest, res)
        return
    }
    var order dto.OrderCreateRequest
    if err := ctx.ShouldBind(&order); err != nil {
        res := utils.BuildResponseFailed(dto.MESSAGE_FAILED_GET_DATA_FROM_BODY, err.Error(), nil)
        ctx.AbortWithStatusJSON(http.StatusBadRequest, res)
        return
    }

    result, err := c.orderService.CreateOrder(ctx.Request.Context(), order, userId)
    if err != nil {
        res := utils.BuildResponseFailed(dto.MESSAGE_FAILED_CREATE_ORDER, err.Error(), nil)
        ctx.JSON(http.StatusBadRequest, res)
        return
    }

    res := utils.BuildResponseSuccess(dto.MESSAGE_SUCCESS_CREATE_ORDER, result)
    ctx.JSON(http.StatusOK, res)
}

func (c *orderController) GetAllOrder(ctx *gin.Context) {
    var req dto.PaginationRequest
    if err := ctx.ShouldBind(&req); err != nil {
        res := utils.BuildResponseFailed(dto.MESSAGE_FAILED_GET_DATA_FROM_BODY, err.Error(), nil)
        ctx.AbortWithStatusJSON(http.StatusBadRequest, res)
        return 
    }

    result, err := c.orderService.GetAllOrder(ctx.Request.Context(), req)
    if err != nil {
        res := utils.BuildResponseFailed(dto.MESSAGE_FAILED_GET_ORDERS, err.Error(), nil)
        ctx.JSON(http.StatusBadRequest, res)
        return
    }

    res := utils.BuildResponseSuccess(dto.MESSAGE_SUCCESS_GET_ORDERS, result)
    ctx.JSON(http.StatusOK, res)
}

func (c *orderController) GetOrderById(ctx *gin.Context) {
    orderId := ctx.Param("id")
    result, err := c.orderService.GetOrderById(ctx.Request.Context(), orderId)
    if err != nil {
        res := utils.BuildResponseFailed(dto.MESSAGE_FAILED_GET_ORDER, err.Error(), nil)
        ctx.JSON(http.StatusBadRequest, res)
        return
    }

    res := utils.BuildResponseSuccess(dto.MESSAGE_SUCCESS_GET_ORDER, result)
    ctx.JSON(http.StatusOK, res)
}

func (c *orderController) GetAvailRoomByDate(ctx *gin.Context) {
    var req dto.PaginationRequest
    if err := ctx.ShouldBind(&req); err != nil {
        res := utils.BuildResponseFailed(dto.MESSAGE_FAILED_GET_DATA_FROM_BODY, err.Error(), nil)
        ctx.AbortWithStatusJSON(http.StatusBadRequest, res)
        return
    }
    date := ctx.Param("date")
    result, err := c.orderService.GetAvailRoomByDate(ctx.Request.Context(), req, date)
    if err != nil {
        res := utils.BuildResponseFailed(dto.MESSAGE_FAILED_GET_AVAIL_ROOM, err.Error(), nil)
        ctx.JSON(http.StatusBadRequest, res)
        return
    }

    res := utils.BuildResponseSuccess(dto.MESSAGE_SUCCESS_GET_AVAIL_ROOM, result)
    ctx.JSON(http.StatusOK, res)
}

func (c *orderController) UpdateOrderStatus(ctx *gin.Context) {
    orderId := ctx.Param("id")
    status := ctx.Param("status")

    result, err := c.orderService.UpdateOrderStatus(ctx.Request.Context(), orderId, status)
    if err != nil {
        res := utils.BuildResponseFailed(dto.MESSAGE_FAILED_UPDATE_ORDER_STATUS, err.Error(), nil)
        ctx.JSON(http.StatusBadRequest, res)
        return
    }

    res := utils.BuildResponseSuccess(dto.MESSAGE_SUCCESS_UPDATE_ORDER_STATUS, result)
    ctx.JSON(http.StatusOK, res)
}

func (c *orderController) DeleteOrder(ctx *gin.Context) {
    orderId := ctx.Param("id")

    if err := c.orderService.DeleteOrder(ctx.Request.Context(), orderId); err != nil {
        res := utils.BuildResponseFailed(dto.MESSAGE_FAILED_DELETE_ORDER, err.Error(), nil)
        ctx.AbortWithStatusJSON(http.StatusBadRequest, res)
        return
    }

    res := utils.BuildResponseSuccess(dto.MESSAGE_SUCCESS_DELETE_ORDER, nil)
    ctx.JSON(http.StatusOK, res)
}

func (c *orderController) GetBookedDates(ctx *gin.Context) {
    roomId := ctx.Param("room_id")

    // Pastikan roomId valid sebelum melanjutkan
    if roomId == "" {
        res := utils.BuildResponseFailed(dto.MESSAGE_FAILED_GET_BOOKED_DATES, "Invalid room_id", nil)
        ctx.JSON(http.StatusBadRequest, res)
        return
    }

    blockedDates, err := c.orderService.GetBookedDates(ctx.Request.Context(), roomId)
    if err != nil {
        res := utils.BuildResponseFailed(dto.MESSAGE_FAILED_GET_BOOKED_DATES, err.Error(), nil)
        ctx.JSON(http.StatusBadRequest, res)
        return
    }

    res := utils.BuildResponseSuccess(dto.MESSAGE_SUCCESS_GET_BOOKED_DATES, blockedDates)
    ctx.JSON(http.StatusOK, res)
}
