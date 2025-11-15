const pool = require('../db/db')

const createReview = async (reviewData) => {
  const { movieId, userId, review, rating } = reviewData

  try {
    const checkSql = `SELECT id FROM reviews WHERE movie_id = ? AND user_id = ?`
    const [existingReviews] = await pool.query(checkSql, [movieId, userId])

    if (existingReviews && existingReviews.length > 0) {
      throw new Error('You have already reviewed this movie')
    }

    const insertSql = `INSERT INTO reviews (movie_id, user_id, review, rating) VALUES (?, ?, ?, ?)`
    const [data] = await pool.query(insertSql, [movieId, userId, review, rating])

    return {
      message: 'Review created successfully',
      reviewId: data.insertId
    }
  } catch (error) {
    throw new Error('Database error: ' + error.message)
  }
}

const getMyReviews = async (userId) => {
  const sql = `
    SELECT
      r.id,
      r.rating,
      r.review,
      r.modified as lastUpdated,
      m.id as movieId,
      m.title as movieTitle
    FROM reviews r
    INNER JOIN movies m ON r.movie_id = m.id
    WHERE r.user_id = ?
    ORDER BY r.modified DESC
  `
  try {
    const [data] = await pool.query(sql, [userId])
    const reviews = data.map(review => ({
      ...review
    }))
    return reviews
  } catch (error) {
    throw new Error('Database error: ' + error.message)
  }
}

const getAllReviews = async () => {
  const sql = `
    SELECT
      r.id,
      r.rating,
      r.review,
      r.modified as lastUpdated,
      m.id as movieId,
      m.title as movieTitle,
      u.first_name as reviewerFirstName,
      u.last_name as reviewerLastName
    FROM reviews r
    INNER JOIN movies m ON r.movie_id = m.id
    INNER JOIN users u ON r.user_id = u.id
    ORDER BY r.modified DESC
  `
  try {
    const [data] = await pool.query(sql)
    const reviews = data.map(review => ({
      ...review,
      reviewerName: `${review.reviewerFirstName} ${review.reviewerLastName}`
    }))
    return reviews
  } catch (error) {
    throw new Error('Database error: ' + error.message)
  }
}

const getReviewById = async (reviewId, userId) => {
  const sql = `
    SELECT
      r.id,
      r.rating,
      r.review,
      r.modified as lastUpdated,
      r.user_id as userId,
      m.id as movieId,
      m.title as movieTitle
    FROM reviews r
    INNER JOIN movies m ON r.movie_id = m.id
    WHERE r.id = ?
  `
  try {
    const [data] = await pool.query(sql, [reviewId])
    if (!data || data.length === 0) {
      throw new Error('Review not found')
    }
    const review = data[0]
    if (review.userId != userId) {
      throw new Error('You do not have permission to access this review')
    }
    return review
  } catch (error) {
    throw new Error('Database error: ' + error.message)
  }
}

const updateReview = async (reviewId, userId, reviewData) => {
  const { review, rating } = reviewData

  try {
    const checkSql = `SELECT user_id FROM reviews WHERE id = ?`
    const [checkData] = await pool.query(checkSql, [reviewId])
    if (!checkData || checkData.length === 0) {
      throw new Error('Review not found')
    }
    if (checkData[0].user_id != userId) {
      throw new Error('You do not have permission to update this review')
    }

    const updateSql = `UPDATE reviews SET review = ?, rating = ? WHERE id = ?`
    await pool.query(updateSql, [review, rating, reviewId])

    return {
      message: 'Review updated successfully'
    }
  } catch (error) {
    throw new Error('Database error: ' + error.message)
  }
}

const deleteReview = async (reviewId, userId) => {
  try {
    const checkSql = `SELECT user_id FROM reviews WHERE id = ?`
    const [checkData] = await pool.query(checkSql, [reviewId])
    if (!checkData || checkData.length === 0) {
      throw new Error('Review not found')
    }
    if (checkData[0].user_id != userId) {
      throw new Error('You do not have permission to delete this review')
    }

    const deleteSql = `DELETE FROM reviews WHERE id = ?`
    await pool.query(deleteSql, [reviewId])

    return {
      message: 'Review deleted successfully'
    }
  } catch (error) {
    throw new Error('Database error: ' + error.message)
  }
}

const shareReview = async (reviewId, userId, sharedWithUserIds) => {
  try {
    const checkSql = `SELECT user_id FROM reviews WHERE id = ?`
    const [checkData] = await pool.query(checkSql, [reviewId])
    if (!checkData || checkData.length === 0) {
      throw new Error('Review not found')
    }
    if (checkData[0].user_id != userId) {
      throw new Error('You do not have permission to share this review')
    }

    const deleteSql = `DELETE FROM shares WHERE review_id = ?`
    await pool.query(deleteSql, [reviewId])

    if (sharedWithUserIds && sharedWithUserIds.length > 0) {
      const values = sharedWithUserIds.map(sharedUserId => [reviewId, sharedUserId])
      const insertSql = `INSERT INTO shares (review_id, user_id) VALUES ?`
      await pool.query(insertSql, [values])
      return {
        message: 'Review shared successfully',
        sharedWith: sharedWithUserIds.length
      }
    } else {
      return {
        message: 'Review sharing removed',
        sharedWith: 0
      }
    }
  } catch (error) {
    throw new Error('Database error: ' + error.message)
  }
}

const getSharedReviews = async (userId) => {
  const sql = `
    SELECT
      r.id,
      r.rating,
      r.review,
      r.modified as lastUpdated,
      m.id as movieId,
      m.title as movieTitle,
      u.first_name as reviewerFirstName,
      u.last_name as reviewerLastName
    FROM reviews r
    INNER JOIN movies m ON r.movie_id = m.id
    INNER JOIN users u ON r.user_id = u.id
    INNER JOIN shares s ON r.id = s.review_id
    WHERE s.user_id = ?
    ORDER BY r.modified DESC
  `
  try {
    const [data] = await pool.query(sql, [userId])
    const reviews = data.map(review => ({
      ...review,
      reviewerName: `${review.reviewerFirstName} ${review.reviewerLastName}`
    }))
    return reviews
  } catch (error) {
    throw new Error('Database error: ' + error.message)
  }
}

const getAllUsersForSharing = async (currentUserId) => {
  const sql = `
    SELECT
      id,
      first_name as firstName,
      last_name as lastName,
      email
    FROM users
    WHERE id != ?
    ORDER BY first_name, last_name
  `
  try {
    const [data] = await pool.query(sql, [currentUserId])
    return data
  } catch (error) {
    throw new Error('Database error: ' + error.message)
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

