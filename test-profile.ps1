# Test GET /user/profile endpoint

Write-Host "Testing GET /user/profile endpoint..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Without userId header (should fail)
Write-Host "Test 1: Request without userId header" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:4000/user/profile" -Method GET
    Write-Host "Response:" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 2: With userId header = 1
Write-Host "Test 2: Request with userId header = 1" -ForegroundColor Yellow
try {
    $headers = @{
        "userId" = "1"
    }
    $response = Invoke-RestMethod -Uri "http://localhost:4000/user/profile" -Method GET -Headers $headers
    Write-Host "Response:" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
}
Write-Host ""

# Test 3: With userId header = 999 (non-existent user)
Write-Host "Test 3: Request with userId header = 999 (non-existent)" -ForegroundColor Yellow
try {
    $headers = @{
        "userId" = "999"
    }
    $response = Invoke-RestMethod -Uri "http://localhost:4000/user/profile" -Method GET -Headers $headers
    Write-Host "Response:" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Test completed!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: To test with a real user, first register a user using POST /user/signup" -ForegroundColor Yellow
Write-Host "Then use the userId from the signup response in the userId header." -ForegroundColor Yellow

