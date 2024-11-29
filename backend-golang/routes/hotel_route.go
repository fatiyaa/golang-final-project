package routes

import (
	"github.com/fatiyaa/golang-final-project/controller"
	"github.com/fatiyaa/golang-final-project/middleware"
	"github.com/fatiyaa/golang-final-project/service"
	"github.com/gin-gonic/gin"
)

func Hotel(route *gin.Engine, hotelController controller.HotelController, jwtService service.JWTService) {
	routes := route.Group("/api/hotel")
	{
		routes.POST("", middleware.Authenticate(jwtService), hotelController.Register)
		routes.PUT("/:id", middleware.Authenticate(jwtService), hotelController.Update)
		routes.GET("", hotelController.GetAllHotel)
		routes.GET("/:id", hotelController.GetHotelById)
		routes.DELETE("/:id", middleware.Authenticate(jwtService), hotelController.Delete)
	}
}