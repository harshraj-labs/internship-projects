Task API:  Assignments 1–3

A simple REST API built during Assignments 1–3, gradually moving from an in-memory task list to a Dockerized PostgreSQL-backed application.

What I built
Assignment 1 - CRUD API
Built a REST API using Express.js
Implemented:
GET /tasks
GET /tasks/:id
POST /tasks
PUT /tasks/:id
DELETE /tasks/:id
Added request validation and proper 400, 404, 201, 204 responses
Added Swagger API documentation
Assignment 2 - SQLite
Replaced the in-memory array with SQLite
Added automatic table creation and seed data
CRUD operations were moved to SQL
Data survived server restarts
Assignment 3 - PostgreSQL + Docker
Replaced SQLite with PostgreSQL
Added a PostgreSQL repository to keep database logic separate from the routes
Added Dockerfile and Docker Compose
PostgreSQL data is persisted using a Docker volume
Added init.sql for automatic database/table initialization
Added .env configuration for the database connection
Project Structure
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
Running the project

Make sure Docker Desktop is running, then:

docker compose up --build

API:

http://localhost:3000

Swagger:

http://localhost:3000/docs
Database

The application uses PostgreSQL running inside Docker.

Database data is stored in the postgres_data Docker volume, so tasks remain available after restarting the containers.

Persistence was tested by creating tasks, stopping the containers, starting them again, and confirming the tasks were still present.

Tech Stack
Node.js
Express.js
PostgreSQL
Docker & Docker Compose
pg
Swagger/OpenAPI
dotenv
Key takeaway

The main thing I learned through these assignments is that the API doesn't need to change when the storage changes. The routes communicate with the repository, while the repository handles the database. This makes it much easier to replace or upgrade the database later.