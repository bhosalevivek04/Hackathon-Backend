const reviewService = require('../services/reviewService')
const result = require('../utils/result')

const createReview = async (req, res) => {
  try {
    const userId = req.headers.userId || req.headers.userid
    const { movieId, review, rating } = req.body

    if (!userId) {
      return res.send(result.createErrorResult('User ID is required in headers'))
    }

    if (!movieId || !review || !rating) {
      return res.send(result.createErrorResult('Movie ID, review, and rating are required'))
    }

    if (rating < 1 || rating > 10) {
      return res.send(result.createErrorResult('Rating must be between 1 and 10'))
    }

    const reviewData = await reviewService.createReview({
      movieId,
      userId,
      review,
      rating
    })

    res.send(result.createSuccessResult(reviewData))
  } catch (error) {
    res.send(result.createErrorResult(error.message))
  }
}

const getMyReviews = async (req, res) => {
  try {
    const userId = req.headers.userId || req.headers.userid
    if (!userId) {
      return res.send(result.createErrorResult('User ID is required in headers'))
    }
    const reviews = await reviewService.getMyReviews(userId)
    res.send(result.createSuccessResult(reviews))
  } catch (error) {
    res.send(result.createErrorResult(error.message))
  }
}

const getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewService.getAllReviews()
    res.send(result.createSuccessResult(reviews))
  } catch (error) {
    res.send(result.createErrorResult(error.message))
  }
}

const getReviewById = async (req, res) => {
  try {
    const userId = req.headers.userId || req.headers.userid
    if (!userId) {
      return res.send(result.createErrorResult('User ID is required in headers'))
    }
    const { id } = req.params
    const review = await reviewService.getReviewById(id, userId)
    res.send(result.createSuccessResult(review))
  } catch (error) {
    res.send(result.createErrorResult(error.message))
  }
}

const updateReview = async (req, res) => {
  try {
    const userId = req.headers.userId
    const { id } = req.params
    const { review, rating } = req.body

    if (!review || !rating) {
      return res.send(result.createErrorResult('Review and rating are required'))
    }

    if (rating < 1 || rating > 10) {
      return res.send(result.createErrorResult('Rating must be between 1 and 10'))
    }

    const reviewData = await reviewService.updateReview(id, userId, { review, rating })
    res.send(result.createSuccessResult(reviewData))
  } catch (error) {
    res.send(result.createErrorResult(error.message))
  }
}

const deleteReview = async (req, res) => {
  try {
    const userId = req.headers.userId
    const { id } = req.params
    const reviewData = await reviewService.deleteReview(id, userId)
    res.send(result.createSuccessResult(reviewData))
  } catch (error) {
    res.send(result.createErrorResult(error.message))
  }
}

const shareReview = async (req, res) => {
  try {
    const userId = req.headers.userId
    const { id } = req.params
    const { userIds } = req.body

    if (!Array.isArray(userIds)) {
      return res.send(result.createErrorResult('userIds must be an array'))
    }

    const shareData = await reviewService.shareReview(id, userId, userIds)
    res.send(result.createSuccessResult(shareData))
  } catch (error) {
    res.send(result.createErrorResult(error.message))
  }
}

const getSharedReviews = async (req, res) => {
  try {
    const userId = req.headers.userId
    const reviews = await reviewService.getSharedReviews(userId)
    res.send(result.createSuccessResult(reviews))
  } catch (error) {
    res.send(result.createErrorResult(error.message))
  }
}

const getAllUsersForSharing = async (req, res) => {
  try {
    const userId = req.headers.userId
    const users = await reviewService.getAllUsersForSharing(userId)
    res.send(result.createSuccessResult(users))
  } catch (error) {
    res.send(result.createErrorResult(error.message))
  }
}

module.exports = {
  createReview,
  getMyReviews,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
  shareReview,
  getSharedReviews,
  getAllUsersForSharing
}

