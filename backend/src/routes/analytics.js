const express = require('express')
const router = express.Router()
const analytics = require('../controllers/analyticsController')
const { requireAuth } = require('../middleware/auth')

router.get('/subjects', requireAuth, analytics.subjects)
router.get('/chapters', requireAuth, analytics.chapters)

module.exports = router
