# API Testing Guide

This guide shows how to test the APIs using JSON files.

## Prerequisites

1. Start the server:
   ```bash
   node server.js
   ```

2. Keep the server running in one terminal window.

## Available JSON Files

- `signup.json` - Test data for user registration (signup = register)
- `login.json` - Test data for user login (actual login/authentication)

## API Endpoints

### 1. Register API (Signup)

**Endpoint:** `POST /user/signup`  
**Purpose:** Register a new user account (signup = register)

**Using JSON file:**
```bash
curl.exe -X POST http://localhost:4000/user/signup -H "Content-Type: application/json" --data-binary "@signup.json"
```

**PowerShell (Alternative):**
```powershell
Invoke-RestMethod -Uri http://localhost:4000/user/signup -Method POST -Body (Get-Content signup.json -Raw) -ContentType 'application/json'
```

**Expected Success Response:**
```json
{
  "status": "success",
  "data": {
    "message": "User registered successfully",
    "userId": 1
  }
}
```

**Expected Error Response (Email exists):**
```json
{
  "status": "error",
  "error": "Email already exists"
}
```

### 2. Login API (Authentication)

**Endpoint:** `POST /user/login`  
**Purpose:** Authenticate user and get access token (actual login)

**Using JSON file:**
```bash
curl.exe -X POST http://localhost:4000/user/login -H "Content-Type: application/json" --data-binary "@login.json"
```

**PowerShell (Alternative):**
```powershell
Invoke-RestMethod -Uri http://localhost:4000/user/login -Method POST -Body (Get-Content login.json -Raw) -ContentType 'application/json'
```

**Expected Success Response:**
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

**Expected Error Response:**
```json
{
  "status": "error",
  "error": "Invalid email or password"
}
```

## JSON File Structure

### signup.json (User Registration)
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "mobileNumber": "+1234567890",
  "dateOfBirth": "01/15/1990",
  "password": "password123",
  "confirmPassword": "password123"
}
```

### login.json (User Authentication)
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

## Quick Test Commands

### Windows PowerShell

**Test Register (Signup):**
```powershell
curl.exe -X POST http://localhost:4000/user/signup -H "Content-Type: application/json" --data-binary "@signup.json"
```

**Test Login (Authentication):**
```powershell
curl.exe -X POST http://localhost:4000/user/login -H "Content-Type: application/json" --data-binary "@login.json"
```

### Linux/Mac

**Test Register (Signup):**
```bash
curl -X POST http://localhost:4000/user/signup -H "Content-Type: application/json" -d @signup.json
```

**Test Login (Authentication):**
```bash
curl -X POST http://localhost:4000/user/login -H "Content-Type: application/json" -d @login.json
```

## Testing Different Scenarios

### Test Register with Different Email

1. Edit `signup.json` and change the email:
   ```json
   {
     "email": "newuser@example.com",
     ...
   }
   ```

2. Run the register (signup) command again.

### Test with Wrong Password

1. Edit `login.json` and change the password:
   ```json
   {
     "email": "john.doe@example.com",
     "password": "wrongpassword"
   }
   ```

2. Run the login command to see error response.

### Test Register with Password Mismatch

1. Edit `signup.json` and make passwords different:
   ```json
   {
     ...
     "password": "password123",
     "confirmPassword": "differentpassword"
   }
   ```

2. Run the register (signup) command to see validation error.

## Batch Testing Script

The `test-all.bat` file is already created. It tests:
1. Register API (Signup) - Creates a new user account
2. Login API (Authentication) - Authenticates user and returns token

Run with:
```bash
test-all.bat
```

## Notes

- **Signup = Register**: The `/user/signup` endpoint is for user registration (creating new accounts)
- **Login = Authentication**: The `/user/login` endpoint is for actual login (authenticating existing users)
- Always ensure the server is running before testing
- Use `--data-binary` flag with curl.exe on Windows to preserve JSON formatting
- JSON files must be in the same directory as the command or use full path
- Change email in signup.json to test with new users
- Save the token from login response for authenticated API calls

