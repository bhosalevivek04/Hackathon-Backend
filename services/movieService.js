const pool = require('../db/db')

const getAllMovies = async () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id, title, release as releaseDate FROM movies ORDER BY release DESC`
    pool.query(sql, (error, data) => {
      if (error) {
        reject(new Error('Database error: ' + error.message))
        return
      }
      resolve(data)
    })
  })
}

const getMovieById = async (movieId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id, title, release as releaseDate FROM movies WHERE id = ?`
    pool.query(sql, [movieId], (error, data) => {
      if (error) {
        reject(new Error('Database error: ' + error.message))
        return
      }
      if (!data || data.length === 0) {
        reject(new Error('Movie not found'))
        return
      }
      resolve(data[0])
    })
  })
}

module.exports = {
  getAllMovies,
  getMovieById
}

