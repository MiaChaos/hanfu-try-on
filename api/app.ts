/**
 * This is a API server
 */

import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import imageRoutes from './routes/image.js'

// for esm mode
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// load env
dotenv.config()

console.log(`[DEBUG] Environment check: NODE_ENV=${process.env.NODE_ENV}, VERCEL=${process.env.VERCEL}`)
console.log(`[DEBUG] QWEN_API_KEY present: ${!!process.env.QWEN_API_KEY}`)

// Global unhandled error logging
process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception:', err.stack || err)
})

process.on('unhandledRejection', (reason: any, promise) => {
  console.error('[FATAL] Unhandled Rejection at:', promise, 'reason:', reason?.stack || reason)
})

const app: express.Application = express()

// Define storage base directory
export const STORAGE_BASE = process.env.VERCEL ? '/tmp' : process.cwd()
export const UPLOADS_DIR = path.join(STORAGE_BASE, 'uploads')
export const GENERATED_DIR = path.join(STORAGE_BASE, 'generated')

console.log(`[DEBUG] Storage Base: ${STORAGE_BASE}`)
console.log(`[DEBUG] Uploads Dir: ${UPLOADS_DIR}`)
console.log(`[DEBUG] Generated Dir: ${GENERATED_DIR}`)

// Ensure directories exist
try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    console.log(`[DEBUG] Creating uploads directory...`)
    fs.mkdirSync(UPLOADS_DIR, { recursive: true })
  }
  if (!fs.existsSync(GENERATED_DIR)) {
    console.log(`[DEBUG] Creating generated directory...`)
    fs.mkdirSync(GENERATED_DIR, { recursive: true })
  }
} catch (err) {
  console.error(`[ERROR] Failed to create directories:`, err)
}

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()
  console.log(`[REQUEST] ${req.method} ${req.url} - Started`)
  
  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(`[RESPONSE] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`)
  })
  
  next()
})

// Serve static files
app.use('/uploads', express.static(UPLOADS_DIR))
app.use('/generated', express.static(GENERATED_DIR))

/**
 * API Routes
 */
app.use('/api/auth', authRoutes)
app.use('/api', imageRoutes)

/**
 * health
 */
app.use(
  '/api/health',
  (req: Request, res: Response, next: NextFunction): void => {
    res.status(200).json({
      success: true,
      message: 'ok',
    })
  },
)

/**
 * error handler middleware
 */
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`[${new Date().toISOString()}] Error ${req.method} ${req.url}:`, error.stack || error)
  
  const status = error.status || error.statusCode || 500
  const message = process.env.NODE_ENV === 'production' 
    ? 'Server internal error' 
    : (error.message || 'Server internal error')

  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  })
})

/**
 * 404 handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'API not found',
  })
})

export default app
