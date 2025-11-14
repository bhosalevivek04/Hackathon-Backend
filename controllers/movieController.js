const movieService = require('../services/movieService')
const result = require('../utils/result')

const getAllMovies = async (req, res) => {
  try {
    const movies = await movieService.getAllMovies()
    res.send(result.createSuccessResult(movies))
  } catch (error) {
    res.send(result.createErrorResult(error.message))
  }
}

const getMovieById = async (req, res) => {
  try {
    const { id } = req.params
    const movie = await movieService.getMovieById(id)
    res.send(result.createSuccessResult(movie))
  } catch (error) {
    res.send(result.createErrorResult(error.message))
  }
}

module.exports = {
  getAllMovies,
  getMovieById
}

