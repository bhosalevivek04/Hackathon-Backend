# Movie Review Backend

A Node.js/Express backend API for a movie review application with user authentication, movie management, and review functionality.

## Features

- User registration and authentication with JWT tokens
- User profile management with date of birth formatting (MM/DD/YYYY)
- Movie database with pre-populated movies
- Review system with rating (1-10 scale, stored as 1-5 in database)
- Review sharing functionality
- MySQL database with proper foreign key relationships

## API Endpoints

### User Management
- `POST /user/signup` - Register new user
- `POST /user/login` - User login
- `GET /user/profile` - Get user profile (requires userId header)
- `PUT /user/profile` - Update user profile (requires userId header)
- `PUT /user/change-password` - Change password (requires userId header)

### Movie Management
- `GET /movies` - Get all movies
- `GET /movies/:id` - Get movie by ID

### Review Management
- `POST /reviews` - Create review (requires userId header)
- `GET /reviews` - Get all reviews
- `GET /reviews/my` - Get user's reviews (requires userId header)
- `GET /reviews/:id` - Get review by ID (requires userId header)
- `PUT /reviews/:id` - Update review (requires userId header)
- `DELETE /reviews/:id` - Delete review (requires userId header)
- `POST /reviews/:id/share` - Share review (requires userId header)
- `GET /reviews/shared` - Get shared reviews (requires userId header)
- `GET /reviews/users` - Get all users for sharing (requires userId header)

## Database Schema

The application uses MySQL with the following tables:
- `users` - User information
- `movies` - Movie catalog
- `reviews` - User reviews and ratings
- `shares` - Review sharing relationships

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up MySQL database:
   - Create a database named `movie_review_db`
   - Run the SQL script in `db/db.sql` to create tables and populate initial data

3. Configure database connection in `utils/config.js`

4. Start the server:
   ```bash
   npm start
   ```

The server runs on port 4000 by default.

## Authentication

Most endpoints require authentication via the `userId` header (case-insensitive, accepts both `userId` and `userid`).

## Date Formatting

Date of birth in profile updates accepts MM/DD/YYYY format and is automatically converted to YYYY-MM-DD for database storage.

## Rating System

Ratings are provided on a 1-10 scale in API requests but stored as 1-5 in the database for consistency.
