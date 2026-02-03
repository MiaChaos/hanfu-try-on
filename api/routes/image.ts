import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs' // Multer needs sync checks usually, or we can use ensureDirectory from service? 
// Multer's diskStorage destination function is synchronous or callback-based. 
// It's better to use sync methods there or ensure directory exists beforehand.
// To avoid sync I/O in event loop, we can just use /tmp or a fixed dir and move later?
// Or just keep the sync mkdir in multer config as it only happens once per upload request.

import { UPLOADS_DIR } from '../config.js'
import * as imageController from '../controllers/imageController.js'

const router = express.Router()

const sanitize = (str: string) => str.replace(/[^a-zA-Z0-9_-]/g, '')

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const dynasty = sanitize(req.body.dynasty || 'temp')
      const dir = path.join(UPLOADS_DIR, dynasty)
      
      // Ideally this should be async, but multer diskStorage is tricky with async.
      // Since Node 10+, fs.mkdirSync with recursive is fine.
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      cb(null, dir)
    } catch (err: any) {
      cb(err, '')
    }
  },
  filename: (req, file, cb) => {
    try {
      const ext = path.extname(file.originalname).toLowerCase()
      if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        return cb(new Error('Invalid file type'), '')
      }
      // Use crypto for better randomness if needed, but Math.random is acceptable for filenames here
      const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`
      cb(null, filename)
    } catch (err: any) {
      cb(err, '')
    }
  }
})

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
})

// POST /api/upload
router.post('/upload', upload.single('image'), imageController.uploadImage)

// POST /api/generate
router.post('/generate', imageController.generateImage)

// POST /api/generate-one-shot
router.post('/generate-one-shot', upload.single('image'), imageController.generateOneShot)

// GET /api/result/:filename
router.get('/result/:filename', imageController.getResult)

// GET /api/proxy-image
router.get('/proxy-image', async (req, res) => {
  const imageUrl = req.query.url as string
  if (!imageUrl) {
    res.status(400).send('Missing url parameter')
    return
  }

  try {
    const allowedDomains = ['.aliyuncs.com', 'localhost', '127.0.0.1']
    const urlObj = new URL(imageUrl)
    const isAllowed = allowedDomains.some(domain => urlObj.hostname.endsWith(domain)) || urlObj.hostname === 'localhost'
    
    if (!isAllowed) {
      return res.status(403).send('Forbidden: Domain not allowed')
    }

    const response = await fetch(imageUrl)
    if (!response.ok) {
      res.status(response.status).send(`Failed to fetch image: ${response.statusText}`)
      return
    }

    const contentType = response.headers.get('content-type')
    if (contentType) {
      res.setHeader('Content-Type', contentType)
    }
    
    // Set CORS headers to allow everything
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Cache-Control', 'public, max-age=86400') // Cache for 1 day

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    res.send(buffer)
  } catch (error) {
    console.error('Proxy error:', error)
    res.status(500).send('Internal Server Error')
  }
})

export default router
