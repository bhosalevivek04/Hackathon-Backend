const express = require('express')
const cors = require('cors')
const userRouter = require('./routes/user')
const movieRouter = require('./routes/movie')
const reviewRouter = require('./routes/review')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/user', userRouter)
app.use('/movies', movieRouter)
app.use('/reviews', reviewRouter)

app.listen(4000, 'localhost', () => {
  console.log('server started at port 4000')
})
