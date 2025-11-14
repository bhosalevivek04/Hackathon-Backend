const mysql = require('mysql2')

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Vivek@123',
    database: 'movie_review_db'
})

module.exports = pool