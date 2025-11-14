const express = require('express')
const reviewController = require('../controllers/reviewController')

const router = express.Router()

router.post('/', reviewController.createReview)
router.get('/my', reviewController.getMyReviews)
router.get('/shared', reviewController.getSharedReviews)
router.get('/', reviewController.getAllReviews)
router.get('/users', reviewController.getAllUsersForSharing)
router.post('/:id/share', reviewController.shareReview)
router.get('/:id', reviewController.getReviewById)
router.put('/:id', reviewController.updateReview)
router.delete('/:id', reviewController.deleteReview)

module.exports = router

