# Complete test: Create user, then get profile

Write-Host "=== Complete Profile Endpoint Test ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Register a new user
Write-Host "Step 1: Registering a new user..." -ForegroundColor Yellow
$signupBody = @{
    firstName = "John"
    lastName = "Doe"
    email = "john.doe.$(Get-Date -Format 'yyyyMMddHHmmss')@example.com"
    mobile = "+1234567890"
    dob = "01/15/1990"
    password = "password123"
} | ConvertTo-Json

try {
    $signupResponse = Invoke-RestMethod -Uri "http://localhost:4000/user/signup" -Method POST -Body $signupBody -ContentType 'application/json'
    Write-Host "Signup Response:" -ForegroundColor Green
    $signupResponse | ConvertTo-Json -Depth 3
    
    if ($signupResponse.status -eq "success" -and $signupResponse.data.userId) {
        $userId = $signupResponse.data.userId
        Write-Host ""
        Write-Host "User created successfully! User ID: $userId" -ForegroundColor Green
        Write-Host ""
        
        # Step 2: Get profile with the new user ID
        Write-Host "Step 2: Getting profile for userId = $userId..." -ForegroundColor Yellow
        $headers = @{
            "userId" = $userId.ToString()
        }
        
        try {
            $profileResponse = Invoke-RestMethod -Uri "http://localhost:4000/user/profile" -Method GET -Headers $headers
            Write-Host "Profile Response:" -ForegroundColor Green
            $profileResponse | ConvertTo-Json -Depth 3
            Write-Host ""
            Write-Host "✅ Profile endpoint test PASSED!" -ForegroundColor Green
        } catch {
            Write-Host "❌ Profile request failed!" -ForegroundColor Red
            Write-Host "Error: $_" -ForegroundColor Red
            if ($_.Exception.Response) {
                $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $responseBody = $reader.ReadToEnd()
                Write-Host "Response Body: $responseBody" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "❌ User creation failed or no userId returned" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Signup failed!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Cyan

