# Interior Gallery Assignment

A full-stack interior design gallery application built with Express.js, Next.js, and MongoDB. Features a responsive UI for browsing curated interior design images with tag-based filtering and cursor-based pagination.

## Project Structure

- **Backend**: Express.js + TypeScript, REST API with modular layered architecture
- **Frontend**: Next.js 16 with React 19, responsive image gallery interface
- **Database**: MongoDB with Mongoose
- **Orchestration**: Docker Compose for local development

## Prerequisites

- Docker and Docker Compose installed
- No need to install Node.js or MongoDB locally—Docker handles everything

## Getting Started with Docker

### 1. Start All Services

Navigate to the project root and run:

```bash
docker-compose up --build
```

This command:
- Builds the backend and frontend Docker images
- Starts MongoDB, backend API, and frontend services
- Automatically seeds the database with initial data
- Waits for health checks before starting dependent services

### 2. Access the Application

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **MongoDB**: `localhost:27017` (internal to Docker network)

### 3. Stopping Services

```bash
docker-compose down
```

To remove data volumes as well:

```bash
docker-compose down -v
```

### 4. Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongo
```

## Environment Variables

### Backend (/.env or docker-compose.yml environment)

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGO_URI` | `mongodb://mongo:27017/interior_gallery` | MongoDB connection string. Uses service name `mongo` when running in Docker. |
| `PORT` | `5000` | Port the backend API listens on |
| `NODE_ENV` | `production` | Environment mode (`development` or `production`) |

### Frontend (/.env or docker-compose.yml environment)

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_BACKEND_URL` | `http://localhost:3000` | Backend API URL for browser-side requests (rewritten by Next.js) |
| `BACKEND_INTERNAL_URL` | `http://backend:5000` | Backend service URL for server-side requests inside the frontend container |
| `NODE_ENV` | `production` | Environment mode for Next.js |

## Design and Schema Decisions

### Architecture: Modular Layered Monolith

The backend follows a strict layer separation for maintainability and testability:

```
Routes → Controllers → Services → Repositories → Mongoose Models
```

- **Routes**: Endpoint definitions and HTTP method bindings
- **Controllers**: HTTP request/response handling and validation
- **Services**: Business logic and data orchestration
- **Repositories**: Database query abstraction (all Mongoose calls here)
- **Models**: Schema definitions and validation

**Benefit**: Clear separation of concerns makes the codebase easy to understand, test, and modify.

### Data Model and Relations

#### Users
```typescript
{
  _id: ObjectId,
  name: String,
  avatar: String,
  bio: String,
  createdAt: Date
}
```

#### Tags
```typescript
{
  _id: ObjectId,
  name: String (e.g., "Modern Minimalist"),
  slug: String (e.g., "modern-minimalist", unique),
  createdAt: Date
}
```

#### Images
```typescript
{
  _id: ObjectId,
  title: String,
  description: String,
  imageUrl: String,
  tags: [String],                        // Array of tag slugs
  uploaderId: ObjectId,                  // Reference to User
  uploaderSnapshot: {                    // Denormalized user data
    _id: ObjectId,
    name: String,
    avatar: String
  },
  createdAt: Date
}
```

**Relations:**
- **1:N** - User has many Images (via `uploaderId`)
- **N:N** - Images have many Tags (via tag slugs array)

### Key Design Decisions

#### 1. **Denormalized Uploader Snapshot**
The `uploaderSnapshot` field stores a denormalized copy of uploader info (name, avatar) directly in each image document. This eliminates the need for joins when rendering image feeds, significantly improving performance for read-heavy workloads.

**Trade-off**: Minor inconsistency if a user updates their profile. Acceptable for galleries where user info changes infrequently.

#### 2. **Cursor-Based Pagination**
The feed endpoint uses cursor-based pagination (keyed by `createdAt` DESC) instead of skip/limit:
- Scalable to millions of images without performance degradation
- Prevents duplicate results when new images are added between requests
- Ideal for infinite scroll UX

#### 3. **Tag Slugs Array**
Images store tags as slug strings instead of ObjectId references:
- Faster reads (no join lookup needed)
- Tag names are denormalized into the gallery UI
- Tag creation doesn't require image document updates

#### 4. **Strategic Indexing**
Three indexes optimize the most common queries:
- `createdAt: -1` - Sorts feed by newest first
- `tags: 1` - Filters by tag in feed endpoint
- `uploaderId: 1` - Finds images by uploader

```typescript
imageSchema.index({ createdAt: -1 });
imageSchema.index({ tags: 1 });
imageSchema.index({ uploaderId: 1 });
```

#### 5. **Docker Compose with Health Checks**
Services include health checks and dependency management:
- MongoDB waits 30s before first health check (initialization time)
- Backend waits for MongoDB to be healthy
- Frontend waits for backend to be healthy
- Seed job runs after backend is ready
- Prevents race conditions during startup

#### 6. **Error Handling and Standard Response Contract**
All API responses follow a consistent shape:
```typescript
{
  success: boolean,
  message: string,
  data: object,
  meta: object
}
```

Centralized error middleware ensures consistent error responses across all endpoints.

## API Endpoints

### Images

- `GET /api/v1/images?limit=10&cursor=<id>&tag=<slug>` - Fetch image feed with cursor pagination and tag filtering
- `GET /api/v1/images/:id` - Get image details by ID
- `GET /api/v1/images/:id/related` - Get related images based on shared tags

## Local Development (Without Docker)

If you prefer to develop without Docker:

### Backend

```bash
cd backend
npm install
npm run dev
```

Requires MongoDB running on `mongodb://localhost:27017`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
