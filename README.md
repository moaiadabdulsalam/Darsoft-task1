# Darsoft Technical Assessment — Modular Backend API

A production-ready, modular REST & WebSocket backend API built with **NestJS**, **MongoDB (Mongoose)**, and **Redis**, designed following **SOLID principles**, Domain-Driven Design modularity, and enterprise clean architecture patterns.

---

## 📋 Table of Contents

- [Overview & Key Features](#-overview--key-features)
- [Architecture & Design Principles](#-architecture--design-principles)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Environment Variables](#-environment-variables)
- [Installation & Setup](#-installation--setup)
- [Running the Application](#-running-the-application)
- [Special Admin Credentials](#-special-admin-credentials-required-by-assignment)
- [Postman Collection](#-postman-collection)
- [API Documentation & Endpoints](#-api-documentation--endpoints)
- [Interactive Swagger UI](#interactive-swagger-ui)
- [Core REST Endpoints](#core-rest-endpoints)
- [Sample cURL Requests & Responses](#sample-curl-requests--responses)
- [Real-Time WebSockets](#-real-time-websockets)
- [Available Scripts & Testing](#-available-scripts--testing)
- [Project Directory Structure](#-project-directory-structure)

---

## 🚀 Overview & Key Features

This backend service powers a multi-tier platform providing robust authentication, user profile management, user address books with ownership validation, and a real-time news management system with Redis caching and WebSocket broadcasting.

- **Authentication & Authorization**:
  - JWT-based authentication using Passport (`@nestjs/passport`, `passport-jwt`).
  - Secure password hashing with `bcrypt` (salt rounds: 10).
  - Role-Based Access Control (RBAC) via `@Roles()` decorator and `RolesGuard` (`user` vs `admin`).
  - Automatic Default Admin Seeding on application bootstrap (`OnModuleInit`).
- **User & Profile Management**:
  - Protected user profile retrieval and patch updates (`/api/users/profile`).
  - Strict input validation and sanitization using `class-validator` and `class-transformer`.
- **Address Management (Ownership Protected)**:
  - Add, list, and delete user addresses linked by user `ObjectId`.
  - Strict ownership verification preventing unauthorized access or deletion of third-party addresses.
- **News Engine & Real-Time Events (Bonus Feature)**:
  - News CRUD with Admin-only mutation guards (`@Roles(Role.ADMIN)`).
  - High-performance caching layer with **Redis** (`ioredis`) with automatic cache invalidation on mutations.
  - Real-time broadcasts across all connected clients via **WebSockets** (`Socket.io`) on `newsCreated`, `newsUpdated`, and `newsDeleted`.
  - Built-in HTML client demo for testing live socket streams.
- **Global Error Handling & Logging**:
  - Centralized exception filter (`HttpExceptionFilter`) standardizing error responses with ISO timestamps and path context.
  - Global validation pipe enforcing parameter whitelisting and implicit type conversions.

---

## 🏛 Architecture & Design Principles

The application is engineered strictly around **SOLID principles (100% compliance)**:
- **S — Single Responsibility**: Dedicated classes for Controllers, Services, Repositories, Seeders, and Gateways. For example, `AdminSeederService` is completely decoupled from `AuthService`.
- **O & D — Open/Closed & Dependency Inversion**: Higher-level modules and controllers rely entirely on abstractions (interfaces) and Injection Tokens (`USER_SERVICE`, `USER_REPOSITORY`, `ADDRESS_SERVICE`, `NEWS_SERVICE`, `AUTH_SERVICE`) rather than concrete class implementations.
- **L — Liskov Substitution**: Storage implementations conform to explicit contracts (`IUsersRepository`, `IAddressesRepository`, `INewsRepository`), allowing seamless swapping with mock repositories or alternative database engines without modifying business logic.
- **I — Interface Segregation**: Distinct, client-specific interfaces tailored for each layer and domain module.

---

## 🛠 Tech Stack

- **Runtime & Language:** [Node.js](https://nodejs.org/) (v18+ or v20+) & [TypeScript](https://www.typescriptlang.org/) (v5.7+)
- **Framework:** [NestJS](https://nestjs.com/) (v11.x)
- **Database:** [MongoDB](https://www.mongodb.com/) (v7.0) via [Mongoose ODM](https://mongoosejs.com/) (v9.x)
- **In-Memory Cache & Broker:** [Redis](https://redis.io/) (v7.x) via [`ioredis`](https://github.com/redis/ioredis)
- **Real-Time Gateway:** [Socket.io](https://socket.io/) (`@nestjs/platform-socket.io`, `@nestjs/websockets`)
- **Security & Authentication:** [Passport.js](http://www.passportjs.org/), `@nestjs/jwt`, `bcrypt`
- **Validation:** `class-validator`, `class-transformer`
- **API Documentation:** [Swagger / OpenAPI 3.0](https://swagger.io/) (`@nestjs/swagger`, `swagger-ui-express`)
- **Containerization:** [Docker](https://www.docker.com/) & Docker Compose

---

## 📦 Prerequisites

Ensure you have the following installed on your local development machine:

| Requirement | Recommended Version | Verification Command |
| :--- | :--- | :--- |
| **Node.js** | `>= 18.18.0` (LTS recommended) | `node -v` |
| **npm** | `>= 9.0.0` | `npm -v` |
| **Docker Engine** | `>= 24.0.0` | `docker -v` |
| **Docker Compose** | `>= 2.20.0` | `docker compose version` |

---

## 🔑 Environment Variables

The project uses `@nestjs/config` to read environment variables from a `.env` file at the root.

Create your local `.env` file by duplicating the template:

```bash
cp .env.example .env
```

### Configuration Keys

| Variable | Type | Default / Example | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | `number` | `3000` | Application HTTP & WebSocket port |
| `NODE_ENV` | `string` | `development` | Runtime environment (`development`, `production`, `test`) |
| `MONGODB_URI` | `string` | `mongodb://admin:admin123@localhost:27017/darsoft_db?authSource=admin` | Full MongoDB connection string |
| `JWT_SECRET` | `string` | `your-super-secret-key-change-in-production` | Secret key used to sign and verify JWT tokens |
| `JWT_EXPIRATION`| `string` | `7d` | JWT token lifetime (e.g. `1d`, `7d`, `24h`) |
| `REDIS_HOST` | `string` | `localhost` | Redis server hostname |
| `REDIS_PORT` | `number` | `6379` | Redis server port |
| `ADMIN_FULLNAME`| `string` | `Super Admin` | Full name of the auto-seeded default admin |
| `ADMIN_EMAIL` | `string` | `admin@darsoft.com` | Email address of the auto-seeded default admin |
| `ADMIN_PASSWORD`| `string` | `Admin@123` | Password of the auto-seeded default admin |

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Darsoft-task1
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Database & Cache Containers
Start the local MongoDB and Redis instances using Docker Compose:

```bash
docker-compose up -d
```

Check container health:
```bash
docker-compose ps
```

### 4. Automatic Admin Seeding
You do not need to run a manual database migration or seeding script. On application bootstrap (`onModuleInit`), the [`AdminSeederService`](file:///c:/Users/moaiadabdulsalam/Desktop/Darsoft-task1/src/modules/auth/services/admin-seeder.service.ts) automatically checks for the admin account specified in `.env` and creates it if it does not already exist:
* **Admin Email:** `admin@darsoft.com`
* **Admin Password:** `Admin@123`

---

## 💻 Running the Application

### Development Mode (with hot-reload)
```bash
npm run start:dev
```

### Debug Mode
```bash
npm run start:debug
```

### Production Build & Run
```bash
# 1. Compile TypeScript to dist/
npm run build

# 2. Start compiled production server
npm run start:prod
```

Once started, the server listens at `http://localhost:3000`.

---

## 🔑 Special Admin Credentials (Required by Assignment)

As requested in the assignment guidelines, the application automatically seeds an administrator account on application startup (`OnModuleInit`). You can use these credentials to log in and test Admin-only features:

| Role | Email | Password | Allowed Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** (Seeded) | `admin@darsoft.com` | `Admin@123` | Full access: User management, Address management, News CRUD (Create, Update, Delete) |
| **Standard User** | `jane@example.com` | `Password123!` | User profile management, Address book, Read-only News live feed |

> [!NOTE]
> Upon logging in via `POST /api/auth/login` with the admin credentials above, the signed JWT payload contains `role: "admin"`.

---

## 📖 API Documentation & Endpoints

### Interactive Swagger UI
Interactive OpenAPI documentation is generated automatically and accessible in your browser:
👉 **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

> **Tip:** You can authenticate directly within Swagger by clicking the **Authorize** button (top right) and entering your JWT token with the format `Bearer <token>`.

---

### Core REST Endpoints

All REST routes are prefixed with `/api`.

#### 1. User Management & Authentication (`/api/auth`, `/api/users`)
| Method | Endpoint | Description | Assignment Task | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account (name, email, password) | **Task 1: Create User API** | No |
| `POST` | `/api/auth/login` | Authenticate credentials (supports **Special Admin Login**) | **Task 1: User Login API** | No |
| `GET` | `/api/users/profile` | Retrieve the currently logged-in user profile | **Task 1: User Management** | Bearer JWT |
| `PATCH`| `/api/users/profile` | Update profile (name, birthday, country, gender, phone) | **Task 1: Update Profile API** | Bearer JWT |

#### 2. Address Management (`/api/addresses`)
| Method | Endpoint | Description | Assignment Task | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/addresses` | Create a new address (name, city, street, locationDetails) | **Task 2: Create Address API** | Bearer JWT |
| `GET` | `/api/addresses` | Retrieve all addresses owned by the user | **Task 2: List User Addresses API** | Bearer JWT |
| `DELETE`| `/api/addresses/:id` | Delete an address (enforces strict ownership check) | **Task 2: Delete Address API** | Bearer JWT |

#### 3. Home Screen & Real-Time News (Bonus Task — `/api/news`)
| Method | Endpoint | Description | Assignment Task | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/news` | List all news articles for home screen (cached via Redis) | **Task 3: Real-time News Update API** | Bearer JWT (User/Admin) |
| `GET` | `/api/news/:id` | Get details for a single news article | **Task 3: Real-time News Update API** | Bearer JWT (User/Admin) |
| `POST` | `/api/news` | Create news (broadcasts `newsCreated` via WS) | **Task 3: News Management API (Admin)**| Bearer JWT (Admin) |
| `PATCH`| `/api/news/:id` | Update news (broadcasts `newsUpdated` via WS) | **Task 3: News Management API (Admin)**| Bearer JWT (Admin) |
| `DELETE`| `/api/news/:id` | Delete news (broadcasts `newsDeleted` via WS) | **Task 3: News Management API (Admin)**| Bearer JWT (Admin) |

---

### Sample cURL Requests & Responses

#### A. User Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "password": "Password123!",
    "phoneNumber": "+966500000000",
    "country": "Saudi Arabia",
    "gender": "female"
  }'
```
**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "userId": "6640c5f0a7b4e6d2189a01bc"
}
```

#### B. User Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "Password123!"
  }'
```
**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjQwYzVmMG..."
}
```

#### C. Fetch Profile
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```
**Response (200 OK):**
```json
{
  "user": {
    "_id": "6640c5f0a7b4e6d2189a01bc",
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "phoneNumber": "+966500000000",
    "country": "Saudi Arabia",
    "gender": "female",
    "role": "user",
    "createdAt": "2026-09-09T22:00:00.000Z",
    "updatedAt": "2026-09-09T22:00:00.000Z"
  }
}
```

#### D. Create Address
```bash
curl -X POST http://localhost:3000/api/addresses \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Home",
    "city": "Riyadh",
    "street": "King Fahd Road",
    "locationDetails": "Building 4, Apt 12"
  }'
```
**Response (201 Created):**
```json
{
  "message": "Address created successfully",
  "address": {
    "_id": "6640c8b9a7b4e6d2189a01df",
    "name": "Home",
    "city": "Riyadh",
    "street": "King Fahd Road",
    "locationDetails": "Building 4, Apt 12",
    "userId": "6640c5f0a7b4e6d2189a01bc",
    "createdAt": "2026-09-09T22:15:00.000Z",
    "updatedAt": "2026-09-09T22:15:00.000Z"
  }
}
```

---

## 📡 Real-Time WebSockets

A dedicated WebSocket Gateway (`NewsGateway`) broadcasts instant news updates to all connected clients.

- **Gateway URL:** `ws://localhost:3000` (or `http://localhost:3000`)
- **Supported Events:**
  - `newsCreated`: Emitted whenever a news article is published.
  - `newsUpdated`: Emitted whenever an article is edited.
  - `newsDeleted`: Emitted with `{ id }` whenever an article is deleted.

### Testing the WebSocket Live Feed
A ready-to-use HTML/JS test client is included:
1. Ensure the server is running on `http://localhost:3000`.
2. Open [`public/ws-test.html`](file:///c:/Users/moaiadabdulsalam/Desktop/Darsoft-task1/public/ws-test.html) directly in any modern browser.
3. Trigger news mutations using the Admin account in Swagger; events will appear instantly on the test dashboard with colored status cards.

---

## 🧪 Available Scripts & Testing

| Command | Purpose |
| :--- | :--- |
| `npm run build` | Compiles the TypeScript project into `dist/` |
| `npm run start:dev` | Starts the server in watch/hot-reload mode |
| `npm run start:prod` | Starts the compiled production bundle |
| `npm run lint` | Runs ESLint and automatically fixes formatting issues |
| `npm run format` | Runs Prettier across `src` and `test` files |
| `npm run test` | Executes Jest unit test suite |
| `npm run test:watch` | Runs Jest in interactive watch mode |
| `npm run test:cov` | Generates a code coverage report in `coverage/` |
| `npm run test:e2e` | Executes end-to-end (e2e) tests |

---

## 📁 Project Directory Structure

```text
Darsoft-task1/
├── Darsoft_API.postman_collection.json # Production Postman collection (v2.1)
├── docker-compose.yml                  # Local MongoDB & Redis services
├── .env.example                        # Environment template
├── public/
│   └── ws-test.html                    # WebSocket live client test dashboard
├── src/
│   ├── main.ts                         # Application bootstrap & Swagger setup
│   ├── app.module.ts                   # Root module
│   ├── common/                         # Cross-cutting concerns
│   │   ├── decorators/                 # Custom decorators (@Roles)
│   │   ├── enums/                      # Role & Gender enums
│   │   ├── filters/                    # Global HttpExceptionFilter
│   │   └── guards/                     # JwtAuthGuard, RolesGuard
│   ├── config/                         # Environment configuration logic
│   └── modules/
│       ├── users/                      # User management domain
│       │   ├── constants/              # User Injection Tokens
│       │   ├── controllers/            # UsersController
│       │   ├── dto/                    # CreateUserDto, UpdateProfileDto
│       │   ├── interfaces/             # IUserService, IUsersRepository
│       │   ├── repositories/           # UsersRepository (Mongoose)
│       │   ├── schemas/                # User schema
│       │   ├── services/               # UsersService
│       │   └── users.module.ts
│       ├── auth/                       # Authentication & Authorization domain
│       │   ├── constants/              # Auth constants & Tokens
│       │   ├── controllers/            # AuthController
│       │   ├── dto/                    # RegisterDto, LoginDto
│       │   ├── interfaces/             # IAuthService
│       │   ├── services/               # AuthService, AdminSeederService
│       │   ├── strategies/             # JwtStrategy (Passport)
│       │   └── auth.module.ts
│       ├── addresses/                  # Address management domain
│       │   ├── constants/              # Address Injection Tokens
│       │   ├── controllers/            # AddressesController
│       │   ├── dto/                    # CreateAddressDto
│       │   ├── interfaces/             # IAddressService, IAddressesRepository
│       │   ├── repositories/           # AddressesRepository (Mongoose)
│       │   ├── schemas/                # Address schema
│       │   ├── services/               # AddressesService
│       │   └── addresses.module.ts
│       ├── news/                       # News & Real-time domain
│       │   ├── constants/              # News constants & Tokens
│       │   ├── controllers/            # NewsController
│       │   ├── dto/                    # CreateNewsDto, UpdateNewsDto
│       │   ├── gateways/               # NewsGateway (Socket.io)
│       │   ├── interfaces/             # INewsService, INewsRepository
│       │   ├── repositories/           # NewsRepository (Mongoose)
│       │   ├── schemas/                # News schema
│       │   ├── services/               # NewsService
│       │   └── news.module.ts
│       └── redis/                      # Redis connection module (ioredis)
└── tsconfig.json                       # TypeScript compiler configuration
```

---

## 📄 License

This project is developed as part of a technical assignment. All rights reserved.