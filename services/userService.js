const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('../db/db')
const config = require('../utils/config')

const createUser = async (userData) => {
  const { firstName, lastName, email, mobile, dob, password } = userData

  try {
    const checkEmailSql = `SELECT id FROM users WHERE email = ?`
    const [existingUsers] = await pool.query(checkEmailSql, [email])

    if (existingUsers && existingUsers.length > 0) {
      throw new Error('Email already exists')
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    let formattedDateOfBirth = dob
    if (dob && dob.includes('/')) {
      const [month, day, year] = dob.split('/')
      formattedDateOfBirth = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }

    const insertSql = `INSERT INTO users (first_name, last_name, email, password, mobile, birth) VALUES (?, ?, ?, ?, ?, ?)`
    const [data] = await pool.query(insertSql, [firstName, lastName, email, hashedPassword, mobile, formattedDateOfBirth])

    return {
      message: 'User registered successfully',
      userId: data.insertId
    }
  } catch (error) {
    throw new Error('Database error: ' + error.message)
  }
}

const loginUser = async (email, password) => {
  try {
    const sql = `SELECT * FROM users WHERE email = ?`
    const [data] = await pool.query(sql, [email])

    if (!data || data.length === 0) {
      throw new Error('Invalid email or password')
    }

    const user = data[0]
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw new Error('Invalid email or password')
    }

    const payload = {
      userId: user.id
    }
    const token = jwt.sign(payload, config.secret)

    return {
      token: token,
      firstName: user.first_name,
      lastName: user.last_name
    }
  } catch (error) {
    throw new Error('Database error: ' + error.message)
  }
}

const getUserProfile = async (userId) => {
  const userIdInt = parseInt(userId, 10)
  if (isNaN(userIdInt)) {
    throw new Error('Invalid user ID')
  }
  const sql = `SELECT first_name, last_name, mobile, email, birth FROM users WHERE id = ?`
  try {
    const [data] = await pool.query(sql, [userIdInt])
    if (!data || data.length === 0) {
      throw new Error('User not found')
    }

    const user = data[0]
    return {
      firstName: user.first_name,
      lastName: user.last_name,
      mobile: user.mobile,
      email: user.email,
      dob: user.birth
    }
  } catch (error) {
    throw new Error('Database error: ' + error.message)
  }
}

const updateUserProfile = async (userId, userData) => {
  const { firstName, lastName, email, mobile, dob } = userData

  let formattedDateOfBirth = dob
  if (dob && dob.includes('/')) {
    const [month, day, year] = dob.split('/')
    formattedDateOfBirth = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  const sql = `UPDATE users SET first_name=?, last_name=?, email=?, mobile=?, birth=? WHERE id = ?`
  try {
    await pool.query(sql, [firstName, lastName, email, mobile, formattedDateOfBirth, userId])
    return {
      message: 'Profile updated successfully'
    }
  } catch (error) {
    throw new Error('Update failed: ' + error.message)
  }
}

const changePassword = async (userId, password, newPassword) => {
  try {
    const sql = `SELECT password FROM users WHERE id = ?`
    const [data] = await pool.query(sql, [userId])
    if (!data || data.length === 0) {
      throw new Error('User not found')
    }

    const user = data[0]
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw new Error('Current password is incorrect')
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

    const updateSql = `UPDATE users SET password = ? WHERE id = ?`
    await pool.query(updateSql, [hashedPassword, userId])

    return {
      message: 'Password changed successfully'
    }
  } catch (error) {
    throw new Error('Database error: ' + error.message)
  }
}

module.exports = {
  createUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword
}

