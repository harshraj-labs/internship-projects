# Task API — Assignments 1–4

A simple REST API built with Node.js and Express. The project started as an in-memory CRUD API and was gradually moved to SQLite, PostgreSQL with Docker, and finally JWT-based authentication.

## Assignment 1 — CRUD API

Built a REST API using Express.js with:

* Create, read, update and delete operations
* Input validation
* Proper HTTP status codes
* Swagger/OpenAPI documentation

Task endpoints:

* `GET /tasks`
* `GET /tasks/:id`
* `POST /tasks`
* `PUT /tasks/:id`
* `DELETE /tasks/:id`

## Assignment 2 — SQLite

Replaced the in-memory task list with SQLite.

* Automatically created the database and `tasks` table
* Added initial seed tasks
* Replaced array operations with SQL queries
* Data survived server restarts

## Assignment 3 — PostgreSQL + Docker

Replaced SQLite with PostgreSQL and moved the database into Docker.

* PostgreSQL runs in Docker
* Database data is stored in a persistent Docker volume
* Added `Dockerfile` and `docker-compose.yml`
* Added `init.sql` for database initialization
* Added a PostgreSQL repository to keep database logic separate from routes
* Database connection is configured through environment variables
* Verified that task data survives app and container restarts

## Assignment 4 — Authentication

Added user authentication using bcrypt and JWT.

Authentication endpoints:

* `POST /auth/register` — create a user account
* `POST /auth/login` — authenticate and receive a JWT
* `POST /auth/logout` — protected logout endpoint

Protected task endpoints require:

```text
Authorization: Bearer <JWT>
```

Authentication features:

* Passwords are stored as bcrypt hashes
* JWTs are generated on successful login
* JWT middleware protects task routes
* Invalid, missing and expired tokens return `401`
* Duplicate email registration returns `409`
* Authentication secrets are stored in `.env`

## Project Structure

```text
assignment/
├── db/
│   └── init.sql
├── middleware/
│   └── auth.js
├── repositories/
│   └── taskRepository.js
├── services/
│   └── authService.js
├── docker-compose.yml
├── Dockerfile
├── openapi.json
├── package.json
├── package-lock.json
└── server.js
```

## How to Run

Make sure Docker Desktop is running.

```bash
docker compose up --build
```

API:

```text
http://localhost:3000
```

Swagger UI:

```text
http://localhost:3000/docs
```

## Authentication Flow

Register:

```http
POST /auth/register
```

```json
{
  "email": "test@example.com",
  "password": "mypassword123"
}
```

Login:

```http
POST /auth/login
```

The response contains a JWT:

```json
{
  "token": "your-jwt-token"
}
```

Use that token when calling protected task endpoints:

```http
Authorization: Bearer your-jwt-token
```

## Database Persistence

PostgreSQL runs inside Docker and uses a Docker volume for persistent data.

Persistence was tested by:

1. Creating tasks through the API.
2. Stopping the Docker containers.
3. Starting them again.
4. Calling `GET /tasks`.
5. Confirming that the previously created tasks were still present.

## Security

* `.env` is excluded from Git.
* `.env.example` contains placeholder values only.
* Passwords are never stored in plaintext.
* JWT secrets are loaded from environment variables.
* Protected routes reject requests without a valid token.

## Tech Stack

* Node.js
* Express.js
* PostgreSQL
* Docker
* Docker Compose
* `pg`
* bcrypt
* JSON Web Token
* Swagger/OpenAPI
* dotenv

## Key Learning

The project progressively separated the API from its storage and authentication layers.

The routes communicate with repositories and authentication middleware instead of directly handling database or JWT logic. This makes the application easier to change and extend as new requirements are added.
