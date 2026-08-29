const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const pdfsController = require('../controllers/pdfsController')

const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(),'uploads')
const storage = multer.diskStorage({
  destination: (req,file,cb)=> cb(null, uploadDir),
  filename: (req,file,cb)=> cb(null, Date.now() + '-' + file.originalname)
})
const upload = multer({ storage })

router.get('/', pdfsController.list)
router.get('/:id', pdfsController.get)
router.post('/upload', upload.single('pdf'), pdfsController.upload)

module.exports = router
