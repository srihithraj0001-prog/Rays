const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', '..', 'data', 'rays.db')
const db = new sqlite3.Database(DB_PATH)

module.exports = db
