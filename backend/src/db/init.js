const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const fs = require('fs')

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'rays.db')
const DIR = path.dirname(DB_PATH)
if(!fs.existsSync(DIR)) fs.mkdirSync(DIR, {recursive:true})

const db = new sqlite3.Database(DB_PATH)

function run(sql){
  return new Promise((res, rej)=> db.run(sql, function(err){ if(err) rej(err); else res(this) }))
}

async function init(){
  // basic schema
  await run(`CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY,
    exam TEXT,
    year INTEGER,
    session TEXT,
    subject TEXT,
    chapter TEXT,
    topic TEXT,
    question TEXT,
    options TEXT,
    answer TEXT,
    solution TEXT,
    difficulty TEXT,
    questionType TEXT,
    source TEXT,
    sourceUrl TEXT,
    officialQuestion INTEGER DEFAULT 0,
    officialSolution INTEGER DEFAULT 0,
    imported_from TEXT,
    imported_at INTEGER
  )`)

  await run(`CREATE TABLE IF NOT EXISTS pdfs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    subject TEXT,
    chapter TEXT,
    type TEXT,
    source TEXT,
    sourceUrl TEXT,
    year TEXT,
    license TEXT,
    file_path TEXT,
    stored INTEGER DEFAULT 0,
    imported_from TEXT,
    imported_at INTEGER
  )`)

  await run(`CREATE TABLE IF NOT EXISTS bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    type TEXT,
    ref_id TEXT,
    created_at INTEGER
  )`)

  await run(`CREATE TABLE IF NOT EXISTS question_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    question_id TEXT,
    answer TEXT,
    correct INTEGER,
    time_taken INTEGER,
    created_at INTEGER
  )`)

  await run(`CREATE TABLE IF NOT EXISTS imports_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id TEXT,
    status TEXT,
    errors TEXT,
    inserted_count INTEGER,
    duplicates_count INTEGER,
    raw_filename TEXT,
    created_at INTEGER
  )`)

  console.log('Database initialized at', DB_PATH)
  db.close()
}

if(require.main === module) init().catch(e=>{console.error(e); process.exit(1)})

module.exports = { init }
