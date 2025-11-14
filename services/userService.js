const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('../db/db')
const config = require('../utils/config')

const createUser = async (userData) => {
  return new Promise((resolve, reject) => {
    const { firstName, lastName, email, mobileNumber, dateOfBirth, password } = userData

    const checkEmailSql = `SELECT id FROM users WHERE email = ?`
    pool.query(checkEmailSql, [email], async (error, existingUsers) => {
      if (error) {
        reject(new Error('Database error: ' + error.message))
        return
      }

      if (existingUsers && existingUsers.length > 0) {
        reject(new Error('Email already exists'))
        return
      }

      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      let formattedDateOfBirth = dateOfBirth
      if (dateOfBirth.includes('/')) {
        const [month, day, year] = dateOfBirth.split('/')
        formattedDateOfBirth = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      }

      const insertSql = `INSERT INTO users (first_name, last_name, email, password, mobile, birth) VALUES (?, ?, ?, ?, ?, ?)`
      pool.query(
        insertSql,
        [firstName, lastName, email, hashedPassword, mobileNumber, formattedDateOfBirth],
        (error, data) => {
          if (error) {
            reject(new Error('Registration failed: ' + error.message))
            return
          }
          resolve({
            message: 'User registered successfully',
            userId: data.insertId
          })
        }
      )
    })
  })
}

const loginUser = async (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users WHERE email = ?`
    pool.query(sql, [email], async (error, data) => {
      if (error) {
        reject(new Error('Database error: ' + error.message))
        return
      }

      if (!data || data.length === 0) {
        reject(new Error('Invalid email or password'))
        return
      }

      const user = data[0]
      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        reject(new Error('Invalid email or password'))
        return
      }

      const payload = {
        userId: user.id
      }
      const token = jwt.sign(payload, config.secret)

      resolve({
        token: token,
        firstName: user.first_name,
        lastName: user.last_name
      })
    })
  })
}

const getUserProfile = async (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT first_name, last_name, mobile, email FROM users WHERE id = ?`
    pool.query(sql, [userId], (error, data) => {
      if (error) {
        reject(new Error('Database error: ' + error.message))
        return
      }

      if (!data || data.length === 0) {
        reject(new Error('User not found'))
        return
      }

      const user = data[0]
      resolve({
        firstName: user.first_name,
        lastName: user.last_name,
        phoneNumber: user.mobile,
        email: user.email
      })
    })
  })
}

const updateUserProfile = async (userId, userData) => {
  return new Promise((resolve, reject) => {
    const { firstName, lastName, phone } = userData
    const sql = `UPDATE users SET first_name=?, last_name=?, mobile=? WHERE id = ?`
    pool.query(
      sql,
      [firstName, lastName, phone, userId],
      (error, data) => {
        if (error) {
          reject(new Error('Update failed: ' + error.message))
          return
        }
        resolve({
          message: 'Profile updated successfully'
        })
      }
    )
  })
}

module.exports = {
  createUser,
  loginUser,
  getUserProfile,
  updateUserProfile
}

