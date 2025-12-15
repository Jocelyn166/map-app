import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import db from './db.js'

const app = express()
const PORT = Number(process.env.PORT) || 3000

app.use(cors())
app.use(express.json())

function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)))
  })
}

function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err)
      else resolve(this)
    })
  })
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// GET locations with optional pagination
app.get('/api/locations', async (req, res) => {
  const limitRaw = req.query.limit
  const offsetRaw = req.query.offset

  const limit = Number.isFinite(Number(limitRaw)) ? Math.min(Number(limitRaw), 500) : 100
  const offset = Number.isFinite(Number(offsetRaw)) ? Math.max(Number(offsetRaw), 0) : 0

  try {
    const rows = await dbAll(
      `
      SELECT *
      FROM locations
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
      `,
      [limit, offset]
    )
    res.json(rows)
  } catch (err) {
    console.error('[API] Failed to fetch locations:', err)
    res.status(500).json({ error: 'Failed to load locations' })
  }
})

// POST create location
app.post('/api/locations', async (req, res) => {
  const { latitude, longitude, address } = req.body

  if (
    typeof latitude !== 'number' ||
    !Number.isFinite(latitude) ||
    typeof longitude !== 'number' ||
    !Number.isFinite(longitude) ||
    typeof address !== 'string' ||
    !address.trim()
  ) {
    return res.status(400).json({ error: 'Invalid request payload' })
  }

  try {
    const result = await dbRun(
      `INSERT INTO locations (latitude, longitude, address) VALUES (?, ?, ?)`,
      [latitude, longitude, address.trim()]
    )

    res.status(201).json({
      id: result.lastID,
      latitude,
      longitude,
      address: address.trim(),
      created_at: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[API] Failed to insert location:', err)
    res.status(500).json({ error: 'Failed to save location' })
  }
})

app.listen(PORT, () => {
  console.log(`[API] Server running on http://localhost:${PORT}`)
})
