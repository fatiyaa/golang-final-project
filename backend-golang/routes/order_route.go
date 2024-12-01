package routes

import (
	"github.com/fatiyaa/golang-final-project/controller"
	"github.com/fatiyaa/golang-final-project/middleware"
	"github.com/fatiyaa/golang-final-project/service"
	"github.com/gin-gonic/gin"
)

func Order(route *gin.Engine, orderController controller.OrderController, jwtService service.JWTService) {
	routes := route.Group("/api/order")
	{
		routes.POST("", middleware.Authenticate(jwtService), orderController.CreateOrder)
		routes.PUT("/:id/:status", middleware.Authenticate(jwtService), orderController.UpdateOrderStatus)
		routes.GET("", middleware.AdminAuthenticate(jwtService), orderController.GetAllOrder)
		routes.GET("user", middleware.Authenticate(jwtService), orderController.GetOrderByUserId)
		routes.GET("/:id", middleware.Authenticate(jwtService), orderController.GetOrderById)
		routes.GET("available/:date", orderController.GetAvailRoomByDate)
		routes.DELETE("/:id", middleware.AdminAuthenticate(jwtService), orderController.DeleteOrder)
		routes.GET("booked/:room_id", orderController.GetBookedDates)
	}
}