# API Endpoints Reference Guide

Complete reference of all backend API endpoints with request/response examples.

## Base URL
- Development: `http://localhost:8787/api`
- Production: Set via `NEXT_PUBLIC_API_URL` environment variable

## Authentication
All authenticated endpoints use HTTP-only cookies set by Better Auth.

---

## 🎨 Paintings API

### GET `/paintings`
Get all paintings with pagination and search.

**Query Parameters:**
- `page` (number, optional, default: 1)
- `limit` (number, optional, default: 10)
- `search` (string, optional) - Searches in title and description

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Sunset",
      "description": "Beautiful sunset painting",
      "imageUrl": "https://...",
      "userId": "uuid",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### GET `/paintings/my`
Get current user's paintings (requires authentication).

**Query Parameters:**
- `page` (number, optional, default: 1)
- `limit` (number, optional, default: 10)

**Response:** Same as GET `/paintings`

### GET `/paintings/:id`
Get a single painting by ID.

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "title": "Sunset",
    "description": "Beautiful sunset painting",
    "imageUrl": "https://...",
    "userId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST `/paintings`
Create a new painting (requires authentication, active user).

**Request Body:**
```json
{
  "title": "Sunset",
  "description": "Beautiful sunset painting",
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "title": "Sunset",
    "description": "Beautiful sunset painting",
    "imageUrl": "https://...",
    "userId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### PUT `/paintings/:id`
Update a painting (requires authentication, owner only).

**Request Body:**
```json
{
  "title": "Updated Sunset",
  "description": "Updated description",
  "imageUrl": "https://example.com/new-image.jpg"
}
```

**Response:** Same as POST

### DELETE `/paintings/:id`
Delete a painting (requires authentication, owner only).

**Response:**
```json
{
  "message": "Painting deleted successfully"
}
```

---

## 📅 Events API

### GET `/events`
Get all events with pagination.

**Query Parameters:**
- `page` (number, optional, default: 1)
- `limit` (number, optional, default: 10)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Art Exhibition",
      "description": "Annual art show",
      "location": "Art Gallery",
      "startDate": "2024-06-01T10:00:00.000Z",
      "endDate": "2024-06-01T18:00:00.000Z",
      "organizerId": "uuid",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 20,
    "totalPages": 2
  }
}
```

### GET `/events/upcoming`
Get upcoming events (startDate >= now).

**Query Parameters:** Same as GET `/events`

**Response:** Same as GET `/events`

### GET `/events/my`
Get current user's organized events (requires authentication).

**Query Parameters:** Same as GET `/events`

**Response:** Same as GET `/events`

### GET `/events/:id`
Get a single event by ID.

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "title": "Art Exhibition",
    "description": "Annual art show",
    "location": "Art Gallery",
    "startDate": "2024-06-01T10:00:00.000Z",
    "endDate": "2024-06-01T18:00:00.000Z",
    "organizerId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "attendeesCount": 25
  }
}
```

### POST `/events`
Create a new event (requires authentication, active user).

**Request Body:**
```json
{
  "title": "Art Exhibition",
  "description": "Annual art show",
  "location": "Art Gallery",
  "startDate": "2024-06-01T10:00:00.000Z",
  "endDate": "2024-06-01T18:00:00.000Z"
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "title": "Art Exhibition",
    "description": "Annual art show",
    "location": "Art Gallery",
    "startDate": "2024-06-01T10:00:00.000Z",
    "endDate": "2024-06-01T18:00:00.000Z",
    "organizerId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### PUT `/events/:id`
Update an event (requires authentication, organizer only).

**Request Body:**
```json
{
  "title": "Updated Exhibition",
  "location": "New Gallery"
}
```

**Response:** Same as POST

### DELETE `/events/:id`
Delete an event (requires authentication, organizer only).

**Response:**
```json
{
  "message": "Event deleted successfully"
}
```

### POST `/events/:id/join`
Join an event as attendee (requires authentication, active user).

**Response:**
```json
{
  "message": "Successfully joined event"
}
```

### DELETE `/events/:id/leave`
Leave an event (requires authentication).

**Response:**
```json
{
  "message": "Successfully left event"
}
```

### GET `/events/:id/attendees`
Get event attendees.

**Query Parameters:**
- `page` (number, optional, default: 1)
- `limit` (number, optional, default: 10)

**Response:**
```json
{
  "data": [
    {
      "eventId": "uuid",
      "userId": "uuid"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

---

## 📢 Announcements API

### GET `/announcements`
Get all announcements with pagination.

**Query Parameters:**
- `page` (number, optional, default: 1)
- `limit` (number, optional, default: 10)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Important Notice",
      "message": "Please read carefully...",
      "authorId": "uuid",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2
  }
}
```

### GET `/announcements/my`
Get current user's announcements (requires authentication).

**Query Parameters:** Same as GET `/announcements`

**Response:** Same as GET `/announcements`

### GET `/announcements/:id`
Get a single announcement by ID.

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "title": "Important Notice",
    "message": "Please read carefully...",
    "authorId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST `/announcements`
Create a new announcement (requires admin).

**Request Body:**
```json
{
  "title": "Important Notice",
  "message": "Please read carefully..."
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "title": "Important Notice",
    "message": "Please read carefully...",
    "authorId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### PUT `/announcements/:id`
Update an announcement (requires authentication, author or admin).

**Request Body:**
```json
{
  "title": "Updated Notice",
  "message": "Updated message..."
}
```

**Response:** Same as POST

### DELETE `/announcements/:id`
Delete an announcement (requires authentication, author or admin).

**Response:**
```json
{
  "message": "Announcement deleted successfully"
}
```

---

## 🎓 Alumni API

### GET `/alumni`
Get all alumni with search filters.

**Query Parameters:**
- `page` (number, optional, default: 1)
- `limit` (number, optional, default: 10)
- `name` (string, optional) - Search by name
- `batchYear` (number, optional) - Filter by batch year
- `email` (string, optional) - Search by email

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "batchYear": 2020,
      "details": "Alumni bio...",
      "imageUrl": "https://...",
      "website": "https://...",
      "linkedin": "https://...",
      "twitter": null,
      "instagram": null,
      "github": null,
      "adminId": "uuid",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### GET `/alumni/batch/:year`
Get alumni by batch year.

**Query Parameters:**
- `page` (number, optional, default: 1)
- `limit` (number, optional, default: 10)

**Response:** Same as GET `/alumni`

### GET `/alumni/:id`
Get a single alumni record by ID.

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "batchYear": 2020,
    "details": "Alumni bio...",
    "imageUrl": "https://...",
    "website": "https://...",
    "linkedin": "https://...",
    "twitter": null,
    "instagram": null,
    "github": null,
    "adminId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST `/alumni`
Create a new alumni record (requires admin).

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "batchYear": 2020,
  "details": "Alumni bio...",
  "imageUrl": "https://...",
  "website": "https://...",
  "linkedin": "https://...",
  "twitter": "https://...",
  "instagram": "https://...",
  "github": "https://..."
}
```

**Response:** Same as GET single alumni

### PUT `/alumni/:id`
Update an alumni record (requires admin).

**Request Body:** All fields optional
```json
{
  "name": "John Updated",
  "batchYear": 2021
}
```

**Response:** Same as GET single alumni

### DELETE `/alumni/:id`
Delete an alumni record (requires admin).

**Response:**
```json
{
  "message": "Alumni record deleted successfully"
}
```

### GET `/alumni/stats/overview`
Get alumni statistics (requires admin).

**Response:**
```json
{
  "data": {
    "totalAlumni": 150,
    "recentAdditions": 5,
    "alumniByBatch": {
      "2020": 30,
      "2021": 35,
      "2022": 40,
      "2023": 45,
      "Unknown": 0
    }
  }
}
```

---

## 👥 Admin API

### GET `/admin/users`
Get all users with search and filters (requires admin).

**Query Parameters:**
- `page` (number, optional, default: 1)
- `limit` (number, optional, default: 10)
- `search` (string, optional) - Search name or email
- `role` (string, optional) - Filter by role: "MEMBER" | "ADMIN"
- `isStale` (boolean, optional) - Filter by stale status

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "User Name",
      "email": "user@example.com",
      "image": null,
      "role": "MEMBER",
      "isStale": false,
      "expiresAt": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### GET `/admin/users/:id`
Get a single user with stats (requires admin).

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "name": "User Name",
    "email": "user@example.com",
    "emailVerified": true,
    "image": null,
    "role": "MEMBER",
    "isStale": false,
    "expiresAt": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "stats": {
      "paintingsCount": 5,
      "eventsCount": 2,
      "announcementsCount": 0
    }
  }
}
```

### PUT `/admin/users/:id/status`
Update user status (requires admin).

**Request Body:**
```json
{
  "isStale": true,
  "role": "ADMIN",
  "expiresAt": "2024-12-31T23:59:59.000Z"
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "name": "User Name",
    "email": "user@example.com",
    "role": "ADMIN",
    "isStale": true,
    "expiresAt": "2024-12-31T23:59:59.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "User marked as stale successfully"
}
```

### DELETE `/admin/users/:id`
Deactivate a user (soft delete) (requires admin).

**Response:**
```json
{
  "message": "User deactivated successfully"
}
```

### GET `/admin/stats`
Get platform statistics (requires admin).

**Response:**
```json
{
  "data": {
    "users": {
      "total": 100,
      "active": 85,
      "stale": 15,
      "admins": 5,
      "recentSignups": 10
    },
    "content": {
      "paintings": 250,
      "events": 50,
      "announcements": 30,
      "alumni": 150,
      "recentPaintings": 15,
      "recentEvents": 3
    }
  }
}
```

### POST `/admin/users/bulk`
Perform bulk actions on users (requires admin).

**Request Body:**
```json
{
  "userIds": ["uuid1", "uuid2", "uuid3"],
  "action": "make_stale"
}
```

**Actions:**
- `"make_stale"` - Mark users as stale
- `"activate"` - Activate users (isStale = false)
- `"promote_to_admin"` - Make users admins
- `"demote_to_member"` - Demote users to members

**Response:**
```json
{
  "data": [
    {
      "id": "uuid1",
      "name": "User 1",
      "isStale": true,
      ...
    },
    {
      "id": "uuid2",
      "name": "User 2",
      "isStale": true,
      ...
    }
  ],
  "message": "Bulk action 'make_stale' applied to 2 users"
}
```

---

## 🔐 Authentication API

### POST `/auth/sign-up/email`
Register a new user (handled by Better Auth).

### POST `/auth/sign-in/email`
Sign in with email and password (handled by Better Auth).

### POST `/auth/sign-out`
Sign out (handled by Better Auth).

### GET `/auth/session`
Get current session (handled by Better Auth).

---

## ❤️ Health Check

### GET `/health`
Check API health status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Error Responses

All endpoints return errors in this format:

**4xx/5xx Response:**
```json
{
  "error": "Error message describing what went wrong",
  "status": 404,
  "code": "NOT_FOUND"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

**Example Error:**
```json
{
  "error": "Painting not found or access denied",
  "status": 404
}
```
