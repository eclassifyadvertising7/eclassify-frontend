# Backend Development Guide

This guide outlines the API requirements and conventions for the backend server that supports this Next.js marketplace application.

## Backend Server Configuration

### Base URL
- **Development**: `http://localhost:6500`
- **Production**: TBD (configure in `src/app/utils/constant.js`)

### Technology Requirements
- RESTful API architecture
- JSON request/response format
- CORS enabled for Next.js frontend
- File upload support (multipart/form-data)

## API Response Format

All API responses should follow this standard format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Required API Endpoints

### Authentication

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "fullName": "string",
  "userEmail": "string",
  "password": "string",
  "RegisteredType": "string" // e.g., "individual", "institute"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "string",
    "token": "string",
    "user": { /* user object */ }
  }
}
```

#### POST `/api/auth/login`
Authenticate user and return token.

**Request Body:**
```json
{
  "userEmail": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "string",
    "user": {
      "id": "string",
      "fullName": "string",
      "userEmail": "string",
      "RegisteredType": "string",
      "profileImage": "string"
    }
  }
}
```

#### POST `/api/auth/logout`
Invalidate user session/token.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### User Profile

#### GET `/api/user/profile`
Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "fullName": "string",
    "userEmail": "string",
    "gender": "string",
    "dateOfBirth": "string",
    "State": "string",
    "Address": "string",
    "Pincode": "string",
    "maritalStatus": "string",
    "mobileNumber": "string",
    "district": "string",
    "PANCardNo": "string",
    "instituteName": "string",
    "instituteBio": "string",
    "instituteCategory": "string",
    "Country": "string",
    "websiteUrl": "string",
    "profileImage": "string"
  }
}
```

#### PUT `/api/user/profile`
Update user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** (all fields optional)
```json
{
  "gender": "string",
  "dateOfBirth": "string",
  "State": "string",
  "Address": "string",
  "Pincode": "string",
  "maritalStatus": "string",
  "mobileNumber": "string",
  "district": "string",
  "PANCardNo": "string",
  "instituteName": "string",
  "instituteBio": "string",
  "instituteCategory": "string",
  "Country": "string",
  "websiteUrl": "string",
  "profileImage": "string"
}
```

### File Upload

#### POST `/api/upload`
Upload a file (image, document, etc.).

**Headers:** `Content-Type: multipart/form-data`

**Request Body:**
- `file`: File (multipart form data)

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "fileUrl": "https://your-cdn.com/path/to/file.jpg"
}
```

**Notes:**
- Return full URL to uploaded file
- Support common image formats (JPG, PNG, WebP)
- Implement file size limits (recommend 5MB for images)
- Generate unique filenames to prevent conflicts

### Listings (Cars & Properties)

#### POST `/api/listings`
Create a new listing (car or property).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "type": "car" | "property",
  "title": "string",
  "description": "string",
  "price": "number",
  "images": ["string"], // Array of image URLs
  "category": "string",
  "location": {
    "state": "string",
    "district": "string",
    "pincode": "string"
  },
  // Car-specific fields
  "make": "string",
  "model": "string",
  "year": "number",
  "mileage": "number",
  "fuelType": "string",
  // Property-specific fields
  "propertyType": "string",
  "bedrooms": "number",
  "bathrooms": "number",
  "area": "number",
  "areaUnit": "sqft" | "sqm"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Listing created successfully",
  "data": {
    "listingId": "string",
    /* listing object */
  }
}
```

#### GET `/api/listings`
Get all listings with filters and pagination.

**Query Parameters:**
- `type`: "car" | "property" (optional)
- `category`: string (optional)
- `minPrice`: number (optional)
- `maxPrice`: number (optional)
- `state`: string (optional)
- `district`: string (optional)
- `page`: number (default: 1)
- `limit`: number (default: 20)
- `sort`: "newest" | "oldest" | "price-low" | "price-high" (default: "newest")

**Response:**
```json
{
  "success": true,
  "data": {
    "listings": [/* array of listing objects */],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 200,
      "itemsPerPage": 20
    }
  }
}
```

#### GET `/api/listings/:id`
Get single listing details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "type": "string",
    "title": "string",
    "description": "string",
    "price": "number",
    "images": ["string"],
    "seller": {
      "id": "string",
      "fullName": "string",
      "profileImage": "string",
      "mobileNumber": "string"
    },
    "createdAt": "string",
    "updatedAt": "string"
    /* other listing fields */
  }
}
```

#### PUT `/api/listings/:id`
Update a listing (only by owner).

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Same as POST `/api/listings` (all fields optional)

#### DELETE `/api/listings/:id`
Delete a listing (only by owner or admin).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Listing deleted successfully"
}
```

#### GET `/api/listings/user/:userId`
Get all listings by a specific user.

**Query Parameters:** Same pagination as GET `/api/listings`

### Pricing & Packages

#### GET `/api/packages`
Get all available pricing packages.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": "number",
      "duration": "number", // days
      "features": ["string"],
      "listingLimit": "number",
      "featured": "boolean"
    }
  ]
}
```

#### POST `/api/packages/purchase`
Purchase a package.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "packageId": "string",
  "paymentMethod": "string"
}
```

### Admin Endpoints

#### GET `/api/admin/stats`
Get dashboard statistics.

**Headers:** `Authorization: Bearer <token>` (admin only)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": "number",
    "totalListings": "number",
    "activeListings": "number",
    "totalRevenue": "number",
    "recentUsers": [/* array */],
    "recentListings": [/* array */]
  }
}
```

#### GET `/api/admin/users`
Get all users with pagination.

**Headers:** `Authorization: Bearer <token>` (admin only)

**Query Parameters:**
- `page`: number
- `limit`: number
- `search`: string (optional)

#### PUT `/api/admin/users/:id`
Update user status or role.

**Headers:** `Authorization: Bearer <token>` (admin only)

**Request Body:**
```json
{
  "status": "active" | "suspended" | "banned",
  "role": "user" | "admin"
}
```

#### GET `/api/admin/listings`
Get all listings for management.

**Headers:** `Authorization: Bearer <token>` (admin only)

**Query Parameters:** Same as GET `/api/listings` plus:
- `status`: "pending" | "approved" | "rejected"

#### PUT `/api/admin/listings/:id/status`
Approve or reject a listing.

**Headers:** `Authorization: Bearer <token>` (admin only)

**Request Body:**
```json
{
  "status": "approved" | "rejected",
  "reason": "string" // required if rejected
}
```

### Contact

#### POST `/api/contact`
Submit a contact form.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

## Authentication & Authorization

### JWT Token
- Use JWT for authentication
- Include token in `Authorization: Bearer <token>` header
- Token should contain: `userId`, `email`, `role`
- Recommended expiry: 7 days (with refresh token support)

### Role-Based Access
- **User**: Can create/edit/delete own listings, update own profile
- **Admin**: Full access to all endpoints, user management, listing moderation

### Protected Routes
All endpoints except the following require authentication:
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/listings`
- GET `/api/listings/:id`
- GET `/api/packages`
- POST `/api/contact`

## Error Handling

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing or invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate entry)
- `500`: Internal Server Error

### Validation Errors
Return detailed validation errors:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "userEmail": "Invalid email format",
    "password": "Password must be at least 8 characters"
  }
}
```

## Database Considerations

### Required Collections/Tables
1. **Users**: Store user accounts and profiles
2. **Listings**: Store car and property listings
3. **Packages**: Store pricing packages
4. **Purchases**: Store package purchase history
5. **Contact**: Store contact form submissions

### Indexing Recommendations
- Users: `userEmail` (unique), `RegisteredType`
- Listings: `type`, `category`, `userId`, `createdAt`, `price`, `state`
- Packages: `name`

## Security Best Practices

1. **Password Hashing**: Use bcrypt with salt rounds ≥ 10
2. **Input Validation**: Validate and sanitize all inputs
3. **Rate Limiting**: Implement rate limiting on auth endpoints
4. **File Upload**: Validate file types and sizes, scan for malware
5. **SQL Injection**: Use parameterized queries
6. **XSS Protection**: Sanitize user-generated content
7. **CORS**: Configure CORS to allow only frontend domain in production

## Environment Variables

Backend should use these environment variables:
```
PORT=6500
DATABASE_URL=<database_connection_string>
JWT_SECRET=<random_secret_key>
JWT_EXPIRY=7d
FILE_UPLOAD_PATH=<path_or_cloud_storage>
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development|production
```

## Testing Requirements

Provide API documentation using:
- Swagger/OpenAPI specification
- Postman collection
- Example requests/responses for each endpoint

## Notes for Frontend Integration

- Frontend expects `baseUrl` from `src/app/utils/constant.js`
- All API calls should handle loading states and errors
- File uploads use `FormData` with field name `file`
- Success responses must include `success: true` boolean
- File upload responses must include `fileUrl` field
