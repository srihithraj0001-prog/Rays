const express = require('express')
const cors = require('cors')
const path = require('path')
const dotenv = require('dotenv')

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// static admin UI
app.use('/admin', express.static(path.join(__dirname, 'admin')))
// serve uploaded PDFs
app.use('/uploads', express.static(path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads')))

// routes
const questionsRoutes = require('./routes/questions')
const pdfsRoutes = require('./routes/pdfs')
const importsRoutes = require('./routes/imports')
const bookmarksRoutes = require('./routes/bookmarks')

app.use('/api/questions', questionsRoutes)
app.use('/api/pdfs', pdfsRoutes)
app.use('/api/imports', importsRoutes)
app.use('/api/bookmarks', bookmarksRoutes)

const PORT = process.env.PORT || 4000
app.listen(PORT, ()=> console.log(`Server listening on http://localhost:${PORT}`))
