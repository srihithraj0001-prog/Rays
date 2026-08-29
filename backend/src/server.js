const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
const express = require('express')
const cors = require('cors')

dotenv.config()
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// CORS configuration
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
const corsOptions = {
  origin: function(origin, callback){
    // allow requests with no origin (like curl, postman)
    if(!origin) return callback(null, true)
    if(origin === FRONTEND_URL) return callback(null, true)
    return callback(new Error('Not allowed by CORS'))
  }
}
app.use(cors(corsOptions))

const pathJoin = require('path').join
const ADMIN_AUTH = require('./middleware/adminAuth')

// serve admin UI with admin protection
app.use('/admin', ADMIN_AUTH, express.static(path.join(__dirname, 'admin')))

// serve uploaded PDFs (no auth)
const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(),'uploads')
if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, {recursive:true})
app.use('/uploads', express.static(uploadDir))

// routes
const questionsRoutes = require('./routes/questions')
const pdfsRoutes = require('./routes/pdfs')
const importsRoutes = require('./routes/imports')
const bookmarksRoutes = require('./routes/bookmarks')
const attemptsRoutes = require('./routes/attempts')
const analyticsRoutes = require('./routes/analytics')
const activityRoutes = require('./routes/activity')

app.use('/api/questions', questionsRoutes)
// protect uploads and imports
app.use('/api/pdfs', pdfsRoutes)
app.use('/api/imports', ADMIN_AUTH, importsRoutes)
app.use('/api/bookmarks', bookmarksRoutes)
app.use('/api/attempts', attemptsRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/activity', activityRoutes)

const PORT = process.env.PORT || 4000
app.listen(PORT, ()=> console.log(`Server listening on http://localhost:${PORT}`))
