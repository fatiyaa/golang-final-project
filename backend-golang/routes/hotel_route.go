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
		routes.POST("", middleware.AdminAuthenticate(jwtService), hotelController.Register)
		routes.PUT("/:id", middleware.AdminAuthenticate(jwtService), hotelController.Update)
		routes.GET("", hotelController.GetAllHotel)
		routes.GET("/:id", hotelController.GetHotelById)
		routes.DELETE("/:id", middleware.AdminAuthenticate(jwtService), hotelController.Delete)
		routes.GET("city", hotelController.CityList)
		routes.GET("by-city", hotelController.GetHotelByCity)
	}
}