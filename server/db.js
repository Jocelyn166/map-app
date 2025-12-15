import sqlite3 from 'sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

sqlite3.verbose()

const DB_PATH = process.env.DB_PATH
  ? path.resolve(__dirname, process.env.DB_PATH)
  : path.join(__dirname, 'locations.db')

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('[DB] Failed to connect to SQLite:', err)
    process.exit(1)
  }
  console.log('[DB] Connected to SQLite:', DB_PATH)
})

db.serialize(() => {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      address TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
    `,
    (err) => {
      if (err) {
        console.error('[DB] Failed to create locations table:', err)
      }
    }
  )

  db.run(
    `
    CREATE INDEX IF NOT EXISTS idx_locations_created_at
    ON locations (created_at DESC)
    `,
    (err) => {
      if (err) {
        console.error('[DB] Failed to create index:', err)
      }
    }
  )
})

export default db
