const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
const express = require('express')
const cors = require('cors')
const session = require('express-session')
const SQLiteStore = require('connect-sqlite3')(session)

dotenv.config()
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// CORS configuration
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
const corsOptions = {
  origin: function(origin, callback){
    if(!origin) return callback(null, true)
    if(origin === FRONTEND_URL) return callback(null, true)
    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true
}
app.use(cors(corsOptions))

// session configuration
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev_secret'
const COOKIE_SECURE = process.env.COOKIE_SECURE === 'true'
const COOKIE_SAME_SITE = process.env.COOKIE_SAME_SITE || 'lax'
const SESSION_MAX_AGE = Number(process.env.SESSION_MAX_AGE || 24*60*60*1000)

const sessionStoreDir = path.join(process.cwd(), 'data')
if(!fs.existsSync(sessionStoreDir)) fs.mkdirSync(sessionStoreDir, {recursive:true})

app.use(session({
  store: new SQLiteStore({dir: sessionStoreDir, db: 'sessions.sqlite'}),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: COOKIE_SAME_SITE,
    maxAge: SESSION_MAX_AGE
  }
}))

// attach user middleware
const { attachUser, requireAuth, requireAdmin } = require('./middleware/auth')
app.use(attachUser)

// serve admin UI protected by role
app.use('/admin', requireAdmin, express.static(path.join(__dirname, 'admin')))

// serve uploads
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
const authRoutes = require('./routes/auth')

app.use('/api/auth', authRoutes)
app.use('/api/questions', questionsRoutes)
app.use('/api/pdfs', pdfsRoutes)
app.use('/api/imports', requireAdmin, importsRoutes)
app.use('/api/bookmarks', bookmarksRoutes)
app.use('/api/attempts', attemptsRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/activity', activityRoutes)

const PORT = process.env.PORT || 4000
app.listen(PORT, ()=> console.log(`Server listening on http://localhost:${PORT}`))
