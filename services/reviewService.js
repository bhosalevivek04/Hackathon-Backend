const pool = require('../db/db')

const createReview = async (reviewData) => {
  return new Promise((resolve, reject) => {
    const { movieId, userId, review, rating } = reviewData

    // Check if user already reviewed this movie
    const checkSql = `SELECT id FROM reviews WHERE movie_id = ? AND user_id = ?`
    pool.query(checkSql, [movieId, userId], (error, existingReviews) => {
      if (error) {
        reject(new Error('Database error: ' + error.message))
        return
      }

      if (existingReviews && existingReviews.length > 0) {
        reject(new Error('You have already reviewed this movie'))
        return
      }

      // Convert rating from 1-10 to 1-5 if needed (database stores 1-5)
      const dbRating = rating <= 5 ? rating : Math.ceil(rating / 2)

      const insertSql = `INSERT INTO reviews (movie_id, user_id, review, rating) VALUES (?, ?, ?, ?)`
      pool.query(
        insertSql,
        [movieId, userId, review, dbRating],
        (error, data) => {
          if (error) {
            reject(new Error('Failed to create review: ' + error.message))
            return
          }
          resolve({
            message: 'Review created successfully',
            reviewId: data.insertId
          })
        }
      )
    })
  })
}

const getMyReviews = async (userId) => {
  return new Promise((resolve, reject) => {
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
    pool.query(sql, [userId], (error, data) => {
      if (error) {
        reject(new Error('Database error: ' + error.message))
        return
      }
      // Convert rating from 1-5 to 1-10 for display
      const reviews = data.map(review => ({
        ...review,
        rating: review.rating * 2 // Convert 1-5 to 1-10
      }))
      resolve(reviews)
    })
  })
}

const getAllReviews = async () => {
  return new Promise((resolve, reject) => {
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
    pool.query(sql, (error, data) => {
      if (error) {
        reject(new Error('Database error: ' + error.message))
        return
      }
      // Convert rating from 1-5 to 1-10 for display
      const reviews = data.map(review => ({
        ...review,
        rating: review.rating * 2, // Convert 1-5 to 1-10
        reviewerName: `${review.reviewerFirstName} ${review.reviewerLastName}`
      }))
      resolve(reviews)
    })
  })
}

const getReviewById = async (reviewId, userId) => {
  return new Promise((resolve, reject) => {
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
    pool.query(sql, [reviewId], (error, data) => {
      if (error) {
        reject(new Error('Database error: ' + error.message))
        return
      }
      if (!data || data.length === 0) {
        reject(new Error('Review not found'))
        return
      }
      const review = data[0]
      // Check if user owns this review
      if (review.userId != userId) {
        reject(new Error('You do not have permission to access this review'))
        return
      }
      // Convert rating from 1-5 to 1-10 for display
      review.rating = review.rating * 2
      resolve(review)
    })
  })
}

const updateReview = async (reviewId, userId, reviewData) => {
  return new Promise((resolve, reject) => {
    const { review, rating } = reviewData

    // First check if review exists and belongs to user
    const checkSql = `SELECT user_id FROM reviews WHERE id = ?`
    pool.query(checkSql, [reviewId], (error, data) => {
      if (error) {
        reject(new Error('Database error: ' + error.message))
        return
      }
      if (!data || data.length === 0) {
        reject(new Error('Review not found'))
        return
      }
      if (data[0].user_id != userId) {
        reject(new Error('You do not have permission to update this review'))
        return
      }

      // Convert rating from 1-10 to 1-5 if needed
      const dbRating = rating <= 5 ? rating : Math.ceil(rating / 2)

      const updateSql = `UPDATE reviews SET review = ?, rating = ? WHERE id = ?`
      pool.query(
        updateSql,
        [review, dbRating, reviewId],
        (error, data) => {
          if (error) {
            reject(new Error('Failed to update review: ' + error.message))
            return
          }
          resolve({
            message: 'Review updated successfully'
          })
        }
      )
    })
  })
}

const deleteReview = async (reviewId, userId) => {
  return new Promise((resolve, reject) => {
    // First check if review exists and belongs to user
    const checkSql = `SELECT user_id FROM reviews WHERE id = ?`
    pool.query(checkSql, [reviewId], (error, data) => {
      if (error) {
        reject(new Error('Database error: ' + error.message))
        return
      }
      if (!data || data.length === 0) {
        reject(new Error('Review not found'))
        return
      }
      if (data[0].user_id != userId) {
        reject(new Error('You do not have permission to delete this review'))
        return
      }

      const deleteSql = `DELETE FROM reviews WHERE id = ?`
      pool.query(deleteSql, [reviewId], (error, data) => {
        if (error) {
          reject(new Error('Failed to delete review: ' + error.message))
          return
        }
        resolve({
          message: 'Review deleted successfully'
        })
      })
    })
  })
}

const shareReview = async (reviewId, userId, sharedWithUserIds) => {
  return new Promise((resolve, reject) => {
    // First check if review exists and belongs to user
    const checkSql = `SELECT user_id FROM reviews WHERE id = ?`
    pool.query(checkSql, [reviewId], (error, data) => {
      if (error) {
        reject(new Error('Database error: ' + error.message))
        return
      }
      if (!data || data.length === 0) {
        reject(new Error('Review not found'))
        return
      }
      if (data[0].user_id != userId) {
        reject(new Error('You do not have permission to share this review'))
        return
      }

      // Remove existing shares for this review
      const deleteSql = `DELETE FROM shares WHERE review_id = ?`
      pool.query(deleteSql, [reviewId], (error) => {
        if (error) {
          reject(new Error('Database error: ' + error.message))
          return
        }

        // Insert new shares
        if (sharedWithUserIds && sharedWithUserIds.length > 0) {
          const values = sharedWithUserIds.map(sharedUserId => [reviewId, sharedUserId])
          const insertSql = `INSERT INTO shares (review_id, user_id) VALUES ?`
          pool.query(insertSql, [values], (error) => {
            if (error) {
              reject(new Error('Failed to share review: ' + error.message))
              return
            }
            resolve({
              message: 'Review shared successfully',
              sharedWith: sharedWithUserIds.length
            })
          })
        } else {
          resolve({
            message: 'Review sharing removed',
            sharedWith: 0
          })
        }
      })
    })
  })
}

const getSharedReviews = async (userId) => {
  return new Promise((resolve, reject) => {
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
    pool.query(sql, [userId], (error, data) => {
      if (error) {
        reject(new Error('Database error: ' + error.message))
        return
      }
      // Convert rating from 1-5 to 1-10 for display
      const reviews = data.map(review => ({
        ...review,
        rating: review.rating * 2, // Convert 1-5 to 1-10
        reviewerName: `${review.reviewerFirstName} ${review.reviewerLastName}`
      }))
      resolve(reviews)
    })
  })
}

const getAllUsersForSharing = async (currentUserId) => {
  return new Promise((resolve, reject) => {
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
    pool.query(sql, [currentUserId], (error, data) => {
      if (error) {
        reject(new Error('Database error: ' + error.message))
        return
      }
      resolve(data)
    })
  })
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

