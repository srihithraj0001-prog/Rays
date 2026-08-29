const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const fs = require('fs')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
require('dotenv').config()

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'rays.db')
const DIR = path.dirname(DB_PATH)
if(!fs.existsSync(DIR)) fs.mkdirSync(DIR, {recursive:true})

const db = new sqlite3.Database(DB_PATH)

function run(sql){
  return new Promise((res, rej)=> db.run(sql, function(err){ if(err) rej(err); else res(this) }))
}

function get(sql, params=[]){
  return new Promise((res, rej)=> db.get(sql, params, (err,row)=> err?rej(err):res(row)))
}

async function init(){
  // schema
  await run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    password_hash TEXT,
    role TEXT DEFAULT 'student',
    created_at INTEGER,
    updated_at INTEGER
  )`)

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

  // create sessions table will be managed by connect-sqlite3 automatically when session store initialized

  console.log('Database initialized at', DB_PATH)

  // Admin bootstrap: if ADMIN_EMAIL set and no user exists with that email, create one
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPass = process.env.ADMIN_PASSWORD
  const adminName = process.env.ADMIN_NAME || 'Admin'
  if(adminEmail && adminPass){
    const existing = await get(`SELECT id FROM users WHERE email = ?`, [adminEmail])
    if(!existing){
      const id = uuidv4()
      const hash = bcrypt.hashSync(adminPass, 10)
      await run(`INSERT INTO users (id,name,email,password_hash,role,created_at,updated_at) VALUES (?,?,?,?,?,?,?)`, [id, adminName, adminEmail, hash, 'admin', Date.now(), Date.now()])
      console.log('Admin user created:', adminEmail)
    } else {
      console.log('Admin user already exists:', adminEmail)
    }
  }

  // Migrate legacy demo-user: if any bookmarks or attempts reference DEMO_LEGACY_ID, ensure a users row exists with that id
  const legacyId = process.env.DEMO_LEGACY_ID || 'demo-user'
  const demoReferences = await get(`SELECT COUNT(*) as c FROM bookmarks WHERE user_id = ?`, [legacyId])
  const demoAttempts = await get(`SELECT COUNT(*) as c FROM question_attempts WHERE user_id = ?`, [legacyId])
  if((demoReferences && demoReferences.c > 0) || (demoAttempts && demoAttempts.c > 0)){
    const u = await get(`SELECT id FROM users WHERE id = ?`, [legacyId])
    if(!u){
      // create a seeding demo user with that id so existing rows map to a real user
      const demoEmail = `demo+legacy@localhost`
      await run(`INSERT INTO users (id,name,email,password_hash,role,created_at,updated_at) VALUES (?,?,?,?,?,?,?)`, [legacyId, 'Legacy Demo', demoEmail, null, 'student', Date.now(), Date.now()])
      console.log('Legacy demo user created with id', legacyId)
    }
  }

  db.close()
}

if(require.main === module) init().catch(e=>{console.error(e); process.exit(1)})

module.exports = { init }
