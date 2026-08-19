# 📰 News Management API

A robust, production-ready **RESTful API** for news management, built with **Node.js**, **Express**, and **PostgreSQL** via **Prisma ORM**. Features JWT-based authentication, profile image uploads, Swagger documentation, and Docker support.

---

## 🚀 Features

- 🔐 **JWT Authentication** — Secure register & login with bcrypt password hashing
- 👤 **User Profile Management** — View and update profile with image upload support
- 📄 **Swagger UI Docs** — Interactive API documentation auto-generated at `/api-docs`
- 🐘 **PostgreSQL + Prisma ORM** — Type-safe database access with migrations
- 🐳 **Docker Ready** — One-command setup with Docker Compose (PostgreSQL + Redis + Adminer)
- ✅ **Request Validation** — Schema-based validation using VineJS
- 📁 **File Upload** — Profile image uploads with type and size validation

---

## 🛠️ Tech Stack

| Layer        | Technology                         |
|--------------|------------------------------------|
| Runtime      | Node.js (ESM)                      |
| Framework    | Express.js v5                      |
| Database     | PostgreSQL 15                      |
| ORM          | Prisma v7                          |
| Auth         | JWT (`jsonwebtoken`) + bcryptjs    |
| Validation   | VineJS                             |
| File Upload  | express-fileupload                 |
| API Docs     | Swagger UI + swagger-autogen       |
| Dev Tools    | tsx, nodemon                       |
| Container    | Docker + Docker Compose            |

---

## 📁 Project Structure

```
news-mgmt/
├── controller/
│   ├── auth.controller.js            # Register & Login logic
│   └── profile.controller.js         # Profile CRUD operations
├── middleware/
│   └── Authentication.middleware.js  # JWT verification
├── routes/
│   └── api.js                        # All API route definitions
├── prisma/
│   ├── schema.prisma                 # Database schema
│   └── migrations/                   # Database migration history
├── validations/
│   └── auth.validation.js            # VineJS validation schemas
├── utils/
│   └── helper.js                     # Utility functions (UUID, image validator)
├── DB/
│   └── db.config.js                  # Prisma client instance
├── config/                           # App configuration
├── public/
│   └── images/                       # Uploaded profile images
├── generated/
│   └── prisma/                       # Auto-generated Prisma client
├── server.js                         # App entry point
├── swagger.js                        # Swagger autogen script
├── swagger-output.json               # Generated Swagger spec
├── docker-compose.yml                # Docker services config
├── .env.example                      # Environment variable template
└── package.json
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Docker](https://www.docker.com/) & Docker Compose (for database)
- npm

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/news-mgmt.git
cd news-mgmt
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

```env
PORT=3000
JWT_SECRET="your-super-secret-key"
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/news_mgmt
```

### 4. Start the Database (Docker)

```bash
docker compose up -d
```

This spins up:
- **PostgreSQL** on port `5432`
- **Redis** on port `6379`
- **Adminer** (DB GUI) on port `8080` → http://localhost:8080

### 5. Run Database Migrations

```bash
npx prisma migrate dev
```

### 6. Generate Prisma Client

```bash
npm run db:generate
```

### 7. Start the Server

```bash
# Development (with auto-reload)
npm run nodemon

# Production
npm start
```

Server runs at → **http://localhost:3000**

---

## 📖 API Documentation

Interactive Swagger UI is available at:

> **http://localhost:3000/api-docs**

---

## 🔌 API Endpoints

### 🏥 Health Check

| Method | Endpoint | Description          |
|--------|----------|----------------------|
| GET    | `/`      | Server health check  |

### 🔐 Authentication (Public)

| Method | Endpoint             | Description           |
|--------|----------------------|-----------------------|
| POST   | `/api/auth/register` | Register a new user   |
| POST   | `/api/auth/login`    | Login & get JWT token |

#### Register — `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response `201`:**
```json
{
  "message": "User created successfully",
  "newUser": {
    "id": "uuid",
    "name": "John Doe",
    "email": "johndoe@example.com",
    "createdAt": "2026-08-19T00:00:00.000Z"
  }
}
```

#### Login — `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "johndoe@example.com",
  "password": "password123"
}
```

**Response `200`:**
```json
{
  "message": "Login successful",
  "access_token": "Bearer <jwt_token>"
}
```

---

### 👤 Profile (Protected — requires `Authorization: Bearer <token>`)

| Method | Endpoint           | Description                    |
|--------|--------------------|--------------------------------|
| GET    | `/api/profile`     | Get authenticated user profile |
| PUT    | `/api/profile/:id` | Update profile image           |

#### Get Profile — `GET /api/profile`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response `200`:**
```json
{
  "status": 200,
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "johndoe@example.com",
    "profile": "image.png",
    "createdAt": "2026-08-19T00:00:00.000Z"
  }
}
```

#### Update Profile Image — `PUT /api/profile/:id`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data
```

**Form Data:**

| Field     | Type   | Required | Description              |
|-----------|--------|----------|--------------------------|
| `profile` | `file` | Yes      | Profile image (PNG/JPG)  |

**Response `200`:**
```json
{
  "status": 200,
  "message": "Profile updated successfully!"
}
```

---

## 🗃️ Database Schema

```prisma
model User {
  id        String   @id @default(uuid())
  name      String   @db.VarChar(255)
  email     String   @unique @db.VarChar(255)
  password  String
  profile   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 🐳 Docker Services

| Service    | Image              | Port | Purpose           |
|------------|--------------------|------|-------------------|
| postgresql | postgres:15-alpine | 5432 | Primary database  |
| redis      | redis:alpine       | 6379 | Caching / queues  |
| adminer    | adminer            | 8080 | Database GUI      |

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# View logs
docker compose logs -f
```

---

## 📦 Available Scripts

| Script                    | Description                                   |
|---------------------------|-----------------------------------------------|
| `npm start`               | Generate Swagger docs then start server       |
| `npm run nodemon`         | Start server with hot-reload via nodemon      |
| `npm run swagger-autogen` | Regenerate Swagger documentation              |
| `npm run db:generate`     | Regenerate Prisma client after schema changes |

---

## 🔒 Security

- Passwords are hashed using **bcryptjs** (salt rounds: 10)
- Authentication via signed **JWT tokens** (1h expiry)
- Protected routes verified by `Authentication.middleware.js`
- Environment secrets managed via `.env` (never committed to VCS)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

<div align="center">
  Made with ❤️ using Node.js + Express + Prisma
</div>
