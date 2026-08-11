# README.md

# Task API — Assignments 1–3

A simple REST API built with Node.js and Express. The project started with an in-memory task list and was gradually moved to SQLite and finally PostgreSQL with Docker.

## Assignment 1 — CRUD API

- Built a REST API using Express.js
- Added CRUD operations for tasks
- Added request validation and proper HTTP status codes
- Added Swagger/OpenAPI documentation

Endpoints:

- `GET /tasks`
- `GET /tasks/:id`
- `POST /tasks`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`

## Assignment 2 — SQLite

- Replaced the in-memory array with SQLite
- Automatically created the database and `tasks` table
- Added initial seed tasks
- CRUD operations were handled using SQL
- Data persisted after restarting the server

## Assignment 3 — PostgreSQL + Docker

- Replaced SQLite with PostgreSQL
- Added a PostgreSQL repository for database operations
- Kept the API routes and service behaviour unchanged
- Added Dockerfile and Docker Compose
- Added a PostgreSQL Docker volume for persistent data
- Added `init.sql` for database initialization
- Added `.env` for the database connection

## Project Structure

```text
assignment 1/
├── db/
│   └── init.sql
├── repositories/
│   └── taskRepository.js
├── docker-compose.yml
├── Dockerfile
├── openapi.json
├── package.json
├── package-lock.json
└── server.js
```
## How to Run

Make sure Docker Desktop is running.

docker compose up --build

API:

http://localhost:3000

Swagger:

http://localhost:3000/docs

## Database Persistence

PostgreSQL runs inside Docker and uses a Docker volume to store its data.

I tested persistence by:

Creating tasks through the API.
Stopping the Docker containers.
Starting them again.
Checking GET /tasks.
Confirming that the previously created tasks were still there.

## Tech Stack
Node.js
Express.js
PostgreSQL
Docker
Docker Compose
pg
Swagger/OpenAPI
dotenv