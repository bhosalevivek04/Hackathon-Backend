const userService = require('../services/userService')
const result = require('../utils/result')

const register = async (req, res) => {
    try {
        const { firstName, lastName, email, mobile, dob, password } = req.body

        if (!firstName || !lastName || !email || !mobile || !dob || !password) {
            return res.send(result.createErrorResult('All fields are required'))
        }

        const userData = await userService.createUser({
            firstName,
            lastName,
            email,
            mobile,
            dob,
            password
        })

        res.send(result.createSuccessResult(userData))
    } catch (error) {
        res.send(result.createErrorResult(error.message))
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const userData = await userService.loginUser(email, password)
        res.send(result.createSuccessResult(userData))
    } catch (error) {
        res.send(result.createErrorResult(error.message))
    }
}

const getProfile = async (req, res) => {
    try {
        const userId = req.headers.userId
        const userData = await userService.getUserProfile(userId)
        res.send(result.createSuccessResult(userData))
    } catch (error) {
        res.send(result.createErrorResult(error.message))
    }
}

const updateProfile = async (req, res) => {
    try {
        const userId = req.headers.userId
        const { firstName, lastName, phone } = req.body
        const userData = await userService.updateUserProfile(userId, { firstName, lastName, phone })
        res.send(result.createSuccessResult(userData))
    } catch (error) {
        res.send(result.createErrorResult(error.message))
    }
}

const changePassword = async (req, res) => {
    try {
        const userId = req.headers.userId
        const { currentPassword, newPassword } = req.body

        if (!currentPassword || !newPassword) {
            return res.send(result.createErrorResult('Current password and new password are required'))
        }

        const userData = await userService.changePassword(userId, currentPassword, newPassword)
        res.send(result.createSuccessResult(userData))
    } catch (error) {
        res.send(result.createErrorResult(error.message))
    }
}

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword
}

