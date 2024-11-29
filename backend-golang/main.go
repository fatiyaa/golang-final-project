package main

import (
	"log"
	"os"

	"github.com/fatiyaa/golang-final-project/command"
	"github.com/fatiyaa/golang-final-project/config"
	"github.com/fatiyaa/golang-final-project/controller"
	"github.com/fatiyaa/golang-final-project/middleware"
	"github.com/fatiyaa/golang-final-project/repository"
	"github.com/fatiyaa/golang-final-project/routes"
	"github.com/fatiyaa/golang-final-project/service"

	"github.com/gin-gonic/gin"
)

func main() {
	db := config.SetUpDatabaseConnection()
	defer config.CloseDatabaseConnection(db)

	if len(os.Args) > 1 {
		flag := command.Commands(db)
		if !flag {
			return
		}
	}

	var (
		jwtService service.JWTService = service.NewJWTService()

		// Implementation Dependency Injection
		// Repository
		userRepository repository.UserRepository = repository.NewUserRepository(db)
		hotelRepository repository.HotelRepository = repository.NewHotelRepository(db)
		roomRepository repository.RoomRepository = repository.NewRoomRepository(db)

		// Service
		userService service.UserService = service.NewUserService(userRepository, jwtService)
		hotelService service.HotelService = service.NewHotelService(hotelRepository)
		roomService service.RoomService = service.NewRoomService(roomRepository)

		// Controller
		userController controller.UserController = controller.NewUserController(userService)
		hotelController controller.HotelController = controller.NewHotelController(hotelService)
		roomController controller.RoomController = controller.NewRoomController(roomService)
	)

	server := gin.Default()
	server.Use(middleware.CORSMiddleware())

	// routes
	routes.User(server, userController, jwtService)
	routes.Hotel(server, hotelController, jwtService)
	routes.Room(server, roomController, jwtService)

	server.Static("/assets", "./assets")
	port := os.Getenv("PORT")
	if port == "" {
		port = "8888"
	}

	var serve string
	if os.Getenv("APP_ENV") == "localhost" {
		serve = "127.0.0.1:" + port
	} else {
		serve = ":" + port
	}

	if err := server.Run(serve); err != nil {
		log.Fatalf("error running server: %v", err)
	}
}
