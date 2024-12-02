# Backend Layer

## How to run the backend

1. Make sure to have go by `go version` and the database using PostgreSQL
2. Copy the .env.example

```
cp .env.example .env
```

3. Configure the database env in the env file
4. Setup your database
5. Run the backend app
   - Make sure that you are in the `/backend` level when runing the app

```
go run main.go
```

#### Migrate Database

To migrate the database schema

```bash
go run main.go --migrate
```

This command will apply all pending migrations to your PostgreSQL database specified in `.env`

#### Seeder Database

To seed the database with initial data:

```bash
go run main.go --seed
```

This command will populate the database with initial data using the seeders defined in your application.

### Fresh Migrate Database

To drop and re-migrate the database 

```bash
go run main.go --fresh
```

This command will reapply all migrations to your PostgreSQL database specified in `.env`

### Postman Documentation

`https://www.postman.com/security-pilot-8592004/workspace/pbkk-golang`
