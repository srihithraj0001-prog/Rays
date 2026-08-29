const express = require('express')
const router = express.Router()
const controller = require('../controllers/attemptsController')

router.post('/:questionId', controller.recordAttempt)
router.get('/', controller.listAttempts)

module.exports = router
