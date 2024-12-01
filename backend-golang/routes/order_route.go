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
		routes.GET("", middleware.Authenticate(jwtService), orderController.GetAllOrder)
		routes.GET("/:id", middleware.Authenticate(jwtService), orderController.GetOrderById)
		routes.GET("available/:date", orderController.GetAvailRoomByDate)
	}
}