# API Testing Guide - Postman

This guide shows how to test the Movie Review Backend APIs using Postman.

## Prerequisites

1. **Install Postman** (if not already installed)
   - Download from: https://www.postman.com/downloads/

2. **Start the server:**
   ```bash
   node server.js
   ```
   Server runs on: `http://localhost:4000`

3. **Keep the server running** while testing

## Base URL

```
http://localhost:4000
```

## Setting Up Postman Environment (Recommended)

1. Click on **Environments** in the left sidebar
2. Click **+** to create a new environment
3. Name it "Movie Review API"
4. Add the following variables:
   - `base_url`: `http://localhost:4000`
   - `token`: (leave empty, will be set after login)
   - `userId`: (leave empty, will be set after login)

5. Select this environment from the dropdown in the top right

## API Endpoints

### 1. Register API (Signup)

**Endpoint:** `POST /user/signup`  
**Purpose:** Register a new user account

**Postman Setup:**
1. Create a new request
2. Set method to **POST**
3. Enter URL: `{{base_url}}/user/signup` (or `http://localhost:4000/user/signup`)
4. Go to **Headers** tab:
   - Key: `Content-Type`
   - Value: `application/json`
5. Go to **Body** tab:
   - Select **raw**
   - Select **JSON** from dropdown
   - Paste the following JSON:

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

6. Click **Send**

**Expected Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "message": "User registered successfully",
    "userId": 1
  }
}
```

**Expected Error Response (200 OK with error status):**
```json
{
  "status": "error",
  "error": "Email already exists"
}
```

**Other Possible Errors:**
- `"All fields are required"` - Missing required fields

---

### 2. Login API (Authentication)

**Endpoint:** `POST /user/login`  
**Purpose:** Authenticate user and get access token

**Postman Setup:**
1. Create a new request
2. Set method to **POST**
3. Enter URL: `{{base_url}}/user/login` (or `http://localhost:4000/user/login`)
4. Go to **Headers** tab:
   - Key: `Content-Type`
   - Value: `application/json`
5. Go to **Body** tab:
   - Select **raw**
   - Select **JSON** from dropdown
   - Paste the following JSON:

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

6. Click **Send**

**Expected Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY5ODc2NTQzMn0.abc123...",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**💡 Tip:** After successful login, copy the `token` value and save it to your Postman environment variable for use in authenticated requests.

**Expected Error Response (200 OK with error status):**
```json
{
  "status": "error",
  "error": "Invalid email or password"
}
```

---

### 3. Get User Profile

**Endpoint:** `GET /user/profile`  
**Purpose:** Get authenticated user's profile information  
**Authentication:** Required (userId header)

**Postman Setup:**
1. Create a new request
2. Set method to **GET**
3. Enter URL: `{{base_url}}/user/profile` (or `http://localhost:4000/user/profile`)
4. Go to **Headers** tab:
   - Key: `userId`
   - Value: `1` (replace with actual user ID from signup response)

**Note:** Currently, the API expects `userId` in headers. In a production app, this would typically use JWT token authentication.

**Expected Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "email": "john.doe@example.com"
  }
}
```

**Expected Error Response (200 OK with error status):**
```json
{
  "status": "error",
  "error": "User not found"
}
```

---

### 4. Update User Profile

**Endpoint:** `PUT /user/profile`  
**Purpose:** Update authenticated user's profile  
**Authentication:** Required (userId header)

**Postman Setup:**
1. Create a new request
2. Set method to **PUT**
3. Enter URL: `{{base_url}}/user/profile` (or `http://localhost:4000/user/profile`)
4. Go to **Headers** tab:
   - Key: `Content-Type`
   - Value: `application/json`
   - Key: `userId`
   - Value: `1` (replace with actual user ID)
5. Go to **Body** tab:
   - Select **raw**
   - Select **JSON** from dropdown
   - Paste the following JSON:

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com",
  "mobile": "0987654321",
  "dob": "01/15/1990"
}
```

6. Click **Send**

**Expected Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "message": "Profile updated successfully"
  }
}
```

**Expected Error Response (200 OK with error status):**
```json
{
  "status": "error",
  "error": "Update failed: [error message]"
}
```

---

## Testing Different Scenarios

### Test Register with Different Email

1. In the Signup request, change the `email` field in the body:
   ```json
   {
     "email": "newuser@example.com",
     ...
   }
   ```
2. Click **Send** to test with a new email

### Test with Wrong Password

1. In the Login request, change the `password` field:
   ```json
   {
     "email": "john.doe@example.com",
     "password": "wrongpassword"
   }
   ```
2. Click **Send** to see error response

### Test Register with Missing Fields

1. In the Signup request, remove a required field (e.g., `mobile`):
   ```json
   {
     "firstName": "John",
     "lastName": "Doe",
     "email": "john.doe@example.com",
     "dob": "01/15/1990",
     "password": "password123"
   }
   ```
2. Click **Send** to see "All fields are required" error

### Test Profile Endpoints with Invalid User ID

1. In Get/Update Profile requests, set `userId` header to an invalid ID (e.g., `999`)
2. Click **Send** to see "User not found" error

---

## Creating a Postman Collection

1. Click **New** → **Collection**
2. Name it "Movie Review API"
3. Add all 4 requests to this collection:
   - Register (Signup)
   - Login
   - Get Profile
   - Update Profile

**Benefits:**
- Organize all requests in one place
- Share with team members
- Export/Import easily
- Run collection as a test suite

---

## Using Postman Variables

### Setting Token Automatically (Advanced)

You can use Postman's **Tests** tab to automatically save the token:

1. In the **Login** request, go to **Tests** tab
2. Add this script:
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    if (jsonData.status === "success" && jsonData.data.token) {
        pm.environment.set("token", jsonData.data.token);
        pm.environment.set("userId", jsonData.data.userId);
    }
}
```

3. Now the token will be automatically saved after login

### Using Saved Token

In authenticated requests, you can use:
- Header: `Authorization: Bearer {{token}}` (if JWT middleware is added)
- Or Header: `userId: {{userId}}` (current implementation)

---

## Request Examples Summary

### Register (Signup)
```
POST http://localhost:4000/user/signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "mobile": "1234567890",
  "dob": "01/15/1990",
  "password": "password123"
}
```

### Login
```
POST http://localhost:4000/user/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Get Profile
```
GET http://localhost:4000/user/profile
userId: 1
```

### Update Profile
```
PUT http://localhost:4000/user/profile
Content-Type: application/json
userId: 1

{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+9876543210"
}
```

---

## Notes

- **Signup = Register**: The `/user/signup` endpoint is for user registration (creating new accounts)
- **Login = Authentication**: The `/user/login` endpoint is for actual login (authenticating existing users)
- Always ensure the server is running before testing
- Use different email addresses for testing multiple user registrations
- Save the token from login response for authenticated API calls
- The `dob` (date of birth) format should be `MM/DD/YYYY` (e.g., `01/15/1990`)
- The `mobile` field accepts phone numbers without country code prefix (e.g., `1234567890`)
- Profile endpoints require `userId` in headers (current implementation)
- All responses return HTTP 200, but check the `status` field in the JSON response body

---

## Troubleshooting

### "Cannot GET /user/profile"
- Make sure you're using `GET` method, not `POST`

### "User not found"
- Verify the `userId` in headers matches an existing user ID
- Check that you've registered a user first

### "Email already exists"
- The email is already registered. Use a different email or delete the user from the database

### Connection Refused
- Make sure the server is running on port 4000
- Check if another application is using port 4000

### Invalid JSON
- Ensure Content-Type header is set to `application/json`
- Verify JSON syntax is correct (no trailing commas, proper quotes)
