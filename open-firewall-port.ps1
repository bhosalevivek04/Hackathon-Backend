# PowerShell script to open Windows Firewall port 4000 for Node.js server
# Run this script as Administrator

Write-Host "Opening Windows Firewall port 4000..." -ForegroundColor Yellow

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator', then run this script again." -ForegroundColor Yellow
    pause
    exit 1
}

# Remove existing rule if it exists
$existingRule = Get-NetFirewallRule -DisplayName "Node.js Server Port 4000" -ErrorAction SilentlyContinue
if ($existingRule) {
    Write-Host "Removing existing firewall rule..." -ForegroundColor Yellow
    Remove-NetFirewallRule -DisplayName "Node.js Server Port 4000"
}

# Create new firewall rule
try {
    New-NetFirewallRule -DisplayName "Node.js Server Port 4000" `
        -Direction Inbound `
        -LocalPort 4000 `
        -Protocol TCP `
        -Action Allow `
        -Profile Domain,Private,Public | Out-Null
    
    Write-Host "SUCCESS: Firewall port 4000 has been opened!" -ForegroundColor Green
    Write-Host "Your server should now be accessible from other devices on your network." -ForegroundColor Green
} catch {
    Write-Host "ERROR: Failed to create firewall rule: $_" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

