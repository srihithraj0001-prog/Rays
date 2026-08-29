const express = require('express')
const router = express.Router()
const importsController = require('../controllers/importsController')

// import pyqs JSON/CSV (multipart for files)
router.post('/pyqs', importsController.importPYQs)
// import pdf manifest (JSON/CSV) — does not download files, stores metadata
router.post('/pdfs-manifest', importsController.importPDFManifest)
// logs
router.get('/logs', importsController.logs)

module.exports = router
