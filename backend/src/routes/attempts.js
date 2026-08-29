const express = require('express')
const router = express.Router()
const controller = require('../controllers/attemptsController')
const { requireAuth } = require('../middleware/auth')

router.post('/:questionId', requireAuth, controller.recordAttempt)
router.get('/', requireAuth, controller.listAttempts)

module.exports = router
