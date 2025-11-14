# Movie Review API Endpoints

Complete API documentation for the Movie Review Application.

## Base URL
```
http://localhost:4000
```

## Authentication
All authenticated endpoints require `userId` in the request headers:
```
userId: <user_id>
```

---

## User Endpoints

### 1. Sign Up
**POST** `/user/signup`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "mobile": "1234567890",
  "dob": "01/15/1990",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "message": "User registered successfully",
    "userId": 1
  }
}
```

---

### 2. Login
**POST** `/user/login`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

---

### 3. Get Profile
**GET** `/user/profile`

**Headers:**
```
userId: 1
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "firstName": "John",
    "lastName": "Doe",
    "mobile": "1234567890",
    "email": "john.doe@example.com"
  }
}
```

---

### 4. Update Profile
**PUT** `/user/profile`

**Headers:**
```
userId: 1
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "mobile": "1234567890",
  "dob": "01/15/1990"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "message": "Profile updated successfully"
  }
}
```

---

### 5. Change Password
**PUT** `/user/change-password`

**Headers:**
```
userId: 1
```

**Request Body:**
```json
{
  "password": "password123",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "message": "Password changed successfully"
  }
}
```

---

## Movie Endpoints

### 6. Get All Movies
**GET** `/movies`

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "title": "The Shawshank Redemption",
      "releaseDate": "1994-09-23"
    },
    {
      "id": 2,
      "title": "The Godfather",
      "releaseDate": "1972-03-24"
    }
  ]
}
```

---

### 7. Get Movie by ID
**GET** `/movies/:id`

**Parameters:**
- `id` (path parameter): The ID of the movie to retrieve

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "title": "The Shawshank Redemption",
    "releaseDate": "1994-09-23"
  }
}
```


**Postman Usage:**
- **Method:** GET
- **URL:** `http://localhost:4000/movies/:id` (replace `:id` with the actual movie ID, e.g., `http://localhost:4000/movies/1`)
- **Headers:** None required
- **Body:** None
- Click **Send** to execute the request.
- **Expected Response:** JSON response as shown above for success, or error if the movie ID does not exist.

---

## Review Endpoints

### 8. Create Review
**POST** `/reviews`

**Headers:**
```
userId: 1
```

**Request Body:**
```json
{
  "movieId": 1,
  "review": "A timeless classic with powerful emotions and storytelling.",
  "rating": 8
}
```

**Note:** Rating must be between 1-10

**Response:**
```json
{
  "status": "success",
  "data": {
    "message": "Review created successfully",
    "reviewId": 1
  }
}
```

---

### 9. Get My Reviews
**GET** `/reviews/my`

**Headers:**
```
userId: 1
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "movieId": 1,
      "movieTitle": "Titanic",
      "rating": 9,
      "review": "An emotionally charged masterpiece. Beautiful cinematography!",
      "lastUpdated": "2023-05-15T10:30:00.000Z"
    }
  ]
}
```

---

### 10. Get All Reviews
**GET** `/reviews`

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "movieId": 1,
      "movieTitle": "Titanic",
      "rating": 9,
      "review": "An emotionally charged masterpiece. Beautiful cinematography!",
      "lastUpdated": "2023-05-15T10:30:00.000Z",
      "reviewerName": "John Doe"
    }
  ]
}
```

---

### 11. Get Shared Reviews
**GET** `/reviews/shared`

**Headers:**
```
userId: 1
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 2,
      "movieId": 1,
      "movieTitle": "Titanic",
      "rating": 8,
      "review": "Great movie!",
      "lastUpdated": "2023-05-14T10:30:00.000Z",
      "reviewerName": "Jane Smith"
    }
  ]
}
```

---

### 12. Get Review by ID
**GET** `/reviews/:id`

**Headers:**
```
userId: 1
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "movieId": 1,
    "movieTitle": "Titanic",
    "rating": 9,
    "review": "An emotionally charged masterpiece. Beautiful cinematography!",
    "lastUpdated": "2023-05-15T10:30:00.000Z"
  }
}
```

---

### 13. Update Review
**PUT** `/reviews/:id`

**Headers:**
```
userId: 1
```

**Request Body:**
```json
{
  "review": "An emotionally charged masterpiece. Beautiful cinematography!",
  "rating": 9
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "message": "Review updated successfully"
  }
}
```

---

### 14. Delete Review
**DELETE** `/reviews/:id`

**Headers:**
```
userId: 1
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "message": "Review deleted successfully"
  }
}
```

---

### 15. Share Review
**POST** `/reviews/:id/share`

**Headers:**
```
userId: 1
```

**Request Body:**
```json
{
  "userIds": [2, 3, 4]
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "message": "Review shared successfully",
    "sharedWith": 3
  }
}
```

---

### 16. Get All Users for Sharing
**GET** `/reviews/users`

**Headers:**
```
userId: 1
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 2,
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@example.com"
    },
    {
      "id": 3,
      "firstName": "Mike",
      "lastName": "Johnson",
      "email": "mike@example.com"
    }
  ]
}
```

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "status": "error",
  "error": "Error message here"
}
```

## Common Error Messages

- `"All fields are required"` - Missing required fields
- `"Email already exists"` - Email is already registered
- `"Invalid email or password"` - Login credentials are incorrect
- `"User not found"` - User ID doesn't exist
- `"Movie not found"` - Movie ID doesn't exist
- `"Review not found"` - Review ID doesn't exist
- `"You have already reviewed this movie"` - User already created a review for this movie
- `"You do not have permission to access this review"` - User doesn't own the review
- `"Current password is incorrect"` - Wrong current password when changing password
- `"Rating must be between 1 and 10"` - Invalid rating value

---

## Notes

1. **Rating System**: The API accepts ratings from 1-10, but the database stores them as 1-5. The conversion is handled automatically.

2. **Authentication**: Currently uses `userId` header. In production, this should be replaced with JWT token authentication.

3. **Date Format**: 
   - Date of birth: `MM/DD/YYYY` (e.g., `01/15/1990`)
   - Release dates: `YYYY-MM-DD` (e.g., `1994-09-23`)

4. **Sharing**: When a review is deleted, all shares are automatically removed (CASCADE).

5. **One Review Per Movie**: Each user can only create one review per movie.

