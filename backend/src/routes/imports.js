const express = require('express')
const router = express.Router()
const importsController = require('../controllers/importsController')

router.post('/pyqs', importsController.importPYQs)
router.post('/pdfs-manifest', importsController.importPDFManifest)
router.get('/logs', importsController.logs)

module.exports = router
