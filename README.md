# 📰 News Management API

A robust, production-ready **RESTful API** for news management, built with **Node.js**, **Express**, and **PostgreSQL** via **Prisma ORM**. Features JWT-based authentication, user profiles, full news CRUD with offset pagination and response transforms, image uploads, Swagger documentation, and Docker support.

---

## 🚀 Features

- 🔐 **JWT Authentication** — Secure register & login with bcrypt password hashing
- 👤 **User Profile Management** — View and update profile with image upload support
- 📰 **News CRUD** — Create, read, update, and delete news with author-only permissions
- 📄 **Offset Pagination** — Page/limit based listing with rich page metadata
- 🔄 **Response Transformation** — Clean, consistent API responses via a transform layer
- 🖼️ **Image Uploads** — News & profile images with type/size validation, UUID filenames, and automatic cleanup of replaced images
- 📄 **Swagger UI Docs** — Interactive API documentation auto-generated at `/api-docs`
- 🐘 **PostgreSQL + Prisma ORM** — Type-safe database access
- 🐳 **Docker Ready** — One-command setup with Docker Compose (PostgreSQL + Redis + Adminer)
- ✅ **Request Validation** — Schema-based validation using VineJS with a custom error reporter

---

## 🛠️ Tech Stack

| Layer        | Technology                         |
|--------------|------------------------------------|
| Runtime      | Node.js (ESM)                      |
| Framework    | Express.js v5                      |
| Database     | PostgreSQL 15                      |
| ORM          | Prisma v7 (with `@prisma/adapter-pg`) |
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
│   ├── news.controller.js            # News CRUD + pagination logic
│   └── profile.controller.js         # Profile operations
├── middleware/
│   └── Authentication.middleware.js  # JWT verification
├── routes/
│   └── api.js                        # All API route definitions
├── transform/
│   └── news.transform.js             # News response transformer
├── prisma/
│   ├── schema.prisma                 # Database schema
│   └── migrations/                   # Database migration history
├── validations/
│   ├── auth.validation.js            # Auth VineJS schemas
│   ├── news.validation.js            # News VineJS schema
│   └── CustomErrorReporter.js        # Custom validation error format
├── utils/
│   └── helper.js                     # Image validate/upload/remove + helpers
├── DB/
│   └── db.config.js                  # Prisma client instance
├── config/                           # App configuration
│   └── filesystem.js                 # Supported MIME types
├── public/
│   └── images/                       # Uploaded profile & news images
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
APP_URL="http://localhost"
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/news_mgmt?schema=public
```

> `APP_URL` + `PORT` are used to build the public image URLs returned by the News API.

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
#ifdef Development (with auto-reload + Swagger regeneration)
npm run nodemon

# Production
npm start
#endif
```

Server runs at → **http://localhost:3000** (or your configured `PORT`)

---

## 📖 API Documentation

Interactive Swagger UI is available at:

> **http://localhost:3000/api-docs**

Swagger docs are regenerated from the annotated controllers each time the server starts (`npm start`).

---

## 🔌 API Endpoints

| Category | Method | Endpoint             | Access   | Description                        |
|----------|--------|----------------------|----------|------------------------------------|
| Health   | GET    | `/`                  | Public   | Server health check                |
| Auth     | POST   | `/api/auth/register` | Public   | Register a new user                |
| Auth     | POST   | `/api/auth/login`    | Public   | Login & get JWT token              |
| Profile  | GET    | `/api/profile`       | Private  | Get authenticated user profile     |
| Profile  | PUT    | `/api/profile/:id`   | Private  | Update profile image               |
| News     | GET    | `/api/news`          | Public   | List all news (paginated)          |
| News     | GET    | `/api/news/:id`      | Public   | Get a single news article          |
| News     | POST   | `/api/news`          | Private  | Create news                        |
| News     | PUT    | `/api/news/:id`      | Private  | Update news (author only)          |
| News     | DELETE | `/api/news/:id`      | Private  | Delete news (author only)          |

> 🔒 **Private** endpoints require the header: `Authorization: Bearer <jwt_token>`

---

### 🏥 Health Check

| Method | Endpoint | Description          |
|--------|----------|----------------------|
| GET    | `/`      | Server health check  |

**Response `200`:**

```json
{
  "status": 200,
  "message": "Server is running successfully!!!!"
}
```

---

### 🔐 Authentication (Public)

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

> ⏱ Tokens expire after **1 hour**.

---

### 👤 Profile (Protected)

#### Get Profile — `GET /api/profile`

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

**Headers:** `Authorization: Bearer <token>` · `multipart/form-data`

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

### 📰 News

#### List News — `GET /api/news`

**Query Parameters:**

| Parameter | Type    | Default | Range     | Description            |
|-----------|---------|---------|-----------|------------------------|
| `page`    | integer | `1`     | ≥ 1       | Page number            |
| `limit`   | integer | `10`    | 1 – 100   | Records per page       |

**Response `200`:**

```json
{
  "news": [
    {
      "id": "uuid",
      "heading": "Breaking News 😎",
      "news": "Here is the Content! ❤",
      "image": "http://localhost:3000/images/<uuid>.jpg",
      "created_at": "2026-10-23T14:25:24.596Z",
      "reporter": {
        "id": "uuid",
        "name": "John Doe",
        "profile": "http://localhost:3000/images/<uuid>.png"
      }
    }
  ],
  "metadata": {
    "totalPages": 1,
    "currentPage": 1,
    "currentLimit": 10,
    "totalRecords": 3,
    "hasNextPage": false,
    "hasPrevPage": false,
    "nextPage": null,
    "prevPage": null
  }
}
```

#### Show News — `GET /api/news/:id`

Returns the same transformed shape as above. `404` if not found.

#### Create News — `POST /api/news`

**Headers:** `Authorization: Bearer <token>` · `multipart/form-data`

**Form Data:**

| Field     | Type     | Required | Description                                      |
|-----------|----------|----------|--------------------------------------------------|
| `title`   | `string` | Yes      | 5 – 190 characters                               |
| `content` | `string` | Yes      | 10 – 30,000 characters                           |
| `image`   | `file`   | Yes      | PNG/JPG/JPEG/SVG/WEBP/GIF, max **2 MB**          |

**Response `201`:**

```json
{
  "message": "News created successfully!",
  "news": {
    "id": "uuid",
    "author_id": "uuid",
    "title": "News Title",
    "content": "News content",
    "image": "<uuid>.png",
    "created_at": "2026-10-26T12:36:09.118Z",
    "updated_at": "2026-10-26T12:36:09.118Z"
  }
}
```

#### Update News — `PUT /api/news/:id`

Same form data as create, but `image` is **optional** (when provided, the old image file is deleted from disk and replaced). Only the **author** may update.

**Response `200`:**

```json
{
  "message": "News updated successfully!"
}
```

#### Delete News — `DELETE /api/news/:id`

Deletes the news record **and** its image file from disk. Only the **author** may delete.

**Response `200`:**

```json
{
  "message": "News deleted successfully!"
}
```

**Other responses:** `401 Unauthorized` (not the author) · `404 Not Found` · `422 Validation Error`:

```json
{
  "errors": {
    "title": "The title field must have a minimum length of 5 characters",
    "image": "Image size must be less than 2 MB"
  }
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
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  news      News[]
}

model News {
  id         String   @id @default(uuid())
  author_id  String
  title      String   @db.VarChar(255)
  content    String
  image      String?
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
  author     User     @relation(fields: [author_id], references: [id])
}
```

---

## 📦 Image Uploads

All images are stored under **`public/images/`** with UUID filenames:

- Validated by type (`image/png`, `image/jpg`, `image/jpeg`, `image/svg`, `image/gif`, `image/webp`) and size (max **2 MB**)
- News/profile **update**: the previous image is automatically removed when a new one is uploaded
- News **delete**: the associated image is removed from disk
- Public image URLs are built from `APP_URL` + `PORT` by the response transformer

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

| Script                    | Description                                            |
|---------------------------|--------------------------------------------------------|
| `npm start`               | Generate Swagger docs then start server                |
| `npm run nodemon`         | Start server with hot-reload via nodemon               |
| `npm run dev`             | Swagger regeneration + hot-reload (combined)           |
| `npm run swagger-autogen` | Regenerate Swagger documentation                       |
| `npm run db:generate`     | Regenerate Prisma client after schema changes          |

---

## 🔒 Security

- Passwords are hashed using **bcryptjs** (salt rounds: 10)
- Authentication via signed **JWT tokens** (1h expiry)
- Protected routes verified by `Authentication.middleware.js`
- News update/delete restricted to the article's **author**
- Validation errors returned in a consistent format via `CustomErrorReporter`
- Environment secrets managed via `.env` (never committed to VCS)

---

## 🗺️ Roadmap

- [ ] Serve uploaded images statically (`/images` currently referenced by the transform URLs)
- [ ] Search & filtering on the news index
- [ ] Redis paging caching for the news index
- [ ] News title uniqueness (409) enforcement
- [ ] Soft deletes / timestamped audit trail

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
