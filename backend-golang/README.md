## Prerequisite 🏆

- Go Version `>= go 1.20`
- PostgreSQL Version `>= version 15.0`

## How To Use

There are 2 ways to do running

### With Docker

1. Copy the example environment file and configure it:

```bash
cp.env.example .env
```

2. Build Docker

```bash
docker-compose build --no-cache
```

3. Run Docker Compose

```bash
docker compose up -d
```

### Without Docker

1. Clone the repository

```bash
git clone https://github.com/fatiyaa/golang-final-project.git
```

2. Navigate to the project directory:

```bash
cd go-gin-clean-starter
```

3. Copy the example environment file and configure it:

```bash
cp .env.example .env
```

4. Configure `.env` with your PostgreSQL credentials:

```bash
DB_HOST=localhost
DB_USER=postgres
DB_PASS=
DB_NAME=
DB_PORT=5432
```

5. Open the terminal and follow these steps:

- If you haven't downloaded PostgreSQL, download it first.
- Run:
  ```bash
  psql -U postgres
  ```
- Create the database according to what you put in `.env`
  ```bash
  CREATE DATABASE your_database;
  ```

6. Run the application:

```bash
go run main.go
```

## Run Migrations, Seeder, and Script

To run migrations, seed the database, and execute a script while keeping the application running, use the following command:

```bash
go run main.go --migrate --seed --run --script:example_script
```

- `--migrate` will apply all pending migrations.
- `--seed` will seed the database with initial data.
- `--script:example_script` will run the specified script (replace `example_script` with your script name).
- `--run` will ensure the application continues running after executing the commands above.
- `--fresh` will drop the tables and reapply the migration

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

#### Script Run

To run a specific script:

```bash
go run main.go --script:example_script
```

Replace `example_script` with the actual script name in **script.go** at script folder

If you need the application to continue running after performing migrations, seeding, or executing a script, always append the `--run` option.

### Postman Documentation

`https://www.postman.com/security-pilot-8592004/workspace/pbkk-golang`
