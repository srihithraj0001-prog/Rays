const express = require('express')
const router = express.Router()
const QuestionsController = require('../controllers/questionsController')

router.get('/', QuestionsController.list)
router.get('/:id', QuestionsController.get)
router.post('/', QuestionsController.create)

module.exports = router
