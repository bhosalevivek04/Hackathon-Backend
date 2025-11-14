const express = require('express')
const cors = require('cors')
const os = require('os')
const userRouter = require('./routes/user')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Test endpoint to verify server is accessible
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Server is running and accessible!',
    timestamp: new Date().toISOString(),
    clientIP: req.ip || req.connection.remoteAddress
  })
})

app.use('/user', userRouter)

// Function to get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (loopback) and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address
      }
    }
  }
  return 'localhost'
}

app.listen(4000, '0.0.0.0', () => {
  const localIP = getLocalIP()
  console.log('='.repeat(50))
  console.log('Server started at port 4000')
  console.log('='.repeat(50))
  console.log('Local access: http://localhost:4000')
  console.log(`Network access: http://${localIP}:4000`)
  console.log('='.repeat(50))
  console.log('Your friend can use the Network access URL above')
  console.log('Make sure both devices are on the same WiFi/network')
  console.log('')
  console.log('TROUBLESHOOTING:')
  console.log('1. If friend cannot connect, run: open-firewall-port.ps1 (as Admin)')
  console.log('2. Test connection: http://' + localIP + ':4000 (should show JSON response)')
  console.log('3. Check NETWORK_SETUP.md for detailed instructions')
  console.log('='.repeat(50))
})
