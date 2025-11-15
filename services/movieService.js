const pool = require('../db/db')

const getAllMovies = async () => {
  const sql = `SELECT id, title, \`release\` FROM movies ORDER BY \`release\` DESC`
  try {
    const [data] = await pool.query(sql)
    return data
  } catch (error) {
    throw new Error('Database error: ' + error.message)
  }
}

const getMovieById = async (movieId) => {
  try {
    const sql = `SELECT id, title, \`release\` FROM movies WHERE id = ?`
    const [data] = await pool.query(sql, [movieId])
    if (!data || data.length === 0) {
      throw new Error('Movie not found')
    }
    return data[0]
  } catch (error) {
    throw new Error('Database error: ' + error.message)
  }
}

module.exports = {
  getAllMovies,
  getMovieById
}

