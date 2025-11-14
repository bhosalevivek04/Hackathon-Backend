# Network Setup Guide - Accessing Server from Other Devices

## Quick Fix: Open Windows Firewall Port

### Option 1: Run PowerShell Script (Easiest)

1. **Right-click** on `open-firewall-port.ps1`
2. Select **"Run with PowerShell"** (or "Run as Administrator")
3. If prompted, click **"Yes"** to allow the script to run
4. The script will automatically open port 4000 in Windows Firewall

### Option 2: Manual Windows Firewall Configuration

1. Press `Win + R`, type `wf.msc` and press Enter (opens Windows Firewall)
2. Click **"Inbound Rules"** in the left panel
3. Click **"New Rule..."** in the right panel
4. Select **"Port"** and click **Next**
5. Select **"TCP"** and enter port **4000**, click **Next**
6. Select **"Allow the connection"**, click **Next**
7. Check all three profiles (Domain, Private, Public), click **Next**
8. Name it: **"Node.js Server Port 4000"**, click **Finish**

## Verify Your Setup

### Step 1: Check Server is Running
Make sure your server is running:
```bash
node server.js
```

You should see output like:
```
==================================================
Server started at port 4000
==================================================
Local access: http://localhost:4000
Network access: http://192.168.x.x:4000
==================================================
```

### Step 2: Find Your IP Address
If the server doesn't show your IP, find it manually:

**Windows:**
```powershell
ipconfig
```
Look for "IPv4 Address" under your active network adapter (usually WiFi or Ethernet)

**Or use this command:**
```powershell
ipconfig | findstr /i "IPv4"
```

### Step 3: Test from Your Own Device First
1. Open a browser on your computer
2. Try accessing: `http://YOUR_IP_ADDRESS:4000` (replace with the IP shown by server)
3. If this works, the server is configured correctly

### Step 4: Test from Friend's Device
1. Make sure both devices are on the **same WiFi network**
2. Your friend should use: `http://YOUR_IP_ADDRESS:4000` in their frontend code
3. They can test in browser first: `http://YOUR_IP_ADDRESS:4000/user/signup` (or any endpoint)

## Troubleshooting

### Problem: Friend still can't connect

**Check 1: Same Network?**
- Both devices must be on the same WiFi/network
- Check WiFi name matches on both devices

**Check 2: Firewall Still Blocking?**
- Run the PowerShell script again as Administrator
- Or manually check Windows Firewall (see Option 2 above)

**Check 3: Antivirus Software**
- Some antivirus software has its own firewall
- Temporarily disable it to test, or add Node.js to exceptions

**Check 4: Router/Network Settings**
- Some routers block device-to-device communication
- Check if "AP Isolation" or "Client Isolation" is enabled in router settings
- Disable it if found

**Check 5: Test Connection**
From your friend's device, try:
```bash
ping YOUR_IP_ADDRESS
```
If ping fails, it's a network connectivity issue, not a server issue.

**Check 6: Verify Port is Open**
From your friend's device, try:
```bash
telnet YOUR_IP_ADDRESS 4000
```
Or use an online port checker tool.

### Alternative: Use ngrok for External Access

If same-network access doesn't work, you can use **ngrok** to create a public tunnel:

1. Download ngrok from: https://ngrok.com/download
2. Extract and run:
   ```bash
   ngrok http 4000
   ```
3. ngrok will give you a public URL like: `https://abc123.ngrok.io`
4. Share this URL with your friend (works from anywhere, not just same network)

**Note:** Free ngrok URLs change each time you restart it.

## Frontend Configuration

Your friend should update their frontend API base URL:

**Instead of:**
```javascript
const API_URL = 'http://localhost:4000'
```

**Use:**
```javascript
const API_URL = 'http://YOUR_IP_ADDRESS:4000'
```

Replace `YOUR_IP_ADDRESS` with the IP shown when your server starts.

## Security Note

⚠️ **Warning:** Opening port 4000 makes your server accessible to anyone on your network. This is fine for development/testing, but:
- Don't use this in production
- Make sure your server has proper authentication
- Close the firewall port when not testing

