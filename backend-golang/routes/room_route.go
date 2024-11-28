package routes

import (
	"github.com/fatiyaa/golang-final-project/controller"
	"github.com/fatiyaa/golang-final-project/middleware"
	"github.com/fatiyaa/golang-final-project/service"
	"github.com/gin-gonic/gin"
)

func Room(route *gin.Engine, roomController controller.RoomController, jwtService service.JWTService) {
	routes := route.Group("/api/room")
	{
		routes.POST("", middleware.Authenticate(jwtService), roomController.CreateRoom)
		routes.PUT("/:id", middleware.Authenticate(jwtService), roomController.UpdateRoom)
		routes.GET("", middleware.Authenticate(jwtService), roomController.GetAllRoom)
		routes.GET("/:id", middleware.Authenticate(jwtService), roomController.GetRoomById)
		routes.DELETE("/:id", middleware.Authenticate(jwtService), roomController.DeleteRoom)
	}
}