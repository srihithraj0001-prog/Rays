const express = require('express')
const router = express.Router()
const activity = require('../controllers/activityController')
const { requireAuth } = require('../middleware/auth')

router.get('/recent', requireAuth, activity.recent)

module.exports = router
