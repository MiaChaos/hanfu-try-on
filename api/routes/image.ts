
import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { generateHistoricalImage } from '../services/qwen.js'
import { UPLOADS_DIR, GENERATED_DIR } from '../app.js'

const router = express.Router()

// Helper to sanitize filename and dynasty
const sanitize = (str: string) => str.replace(/[^a-zA-Z0-9_-]/g, '')

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const dynasty = sanitize(req.body.dynasty || 'temp')
      const dir = path.join(UPLOADS_DIR, dynasty)
      console.log(`[DEBUG] Multer destination: ${dir}`)
      if (!fs.existsSync(dir)) {
        console.log(`[DEBUG] Creating directory for upload: ${dir}`)
        fs.mkdirSync(dir, { recursive: true })
      }
      cb(null, dir)
    } catch (err: any) {
      console.error(`[ERROR] Multer destination error:`, err)
      cb(err, '')
    }
  },
  filename: (req, file, cb) => {
    try {
      // Keep original extension
      const ext = path.extname(file.originalname).toLowerCase()
      console.log(`[DEBUG] Multer filename, original: ${file.originalname}, ext: ${ext}`)
      // Validate extension to prevent non-image uploads
      if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        console.warn(`[WARN] Invalid file type: ${ext}`)
        return cb(new Error('Invalid file type'), '')
      }
      const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`
      console.log(`[DEBUG] Generated filename: ${filename}`)
      cb(null, filename)
    } catch (err: any) {
      console.error(`[ERROR] Multer filename error:`, err)
      cb(err, '')
    }
  }
})

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // Increased to 10MB to match Qwen limit
})

// POST /api/upload
router.post('/upload', (req, res, next) => {
  console.log(`[UPLOAD] Starting upload request...`)
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error(`[UPLOAD] Multer error:`, err)
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` })
    } else if (err) {
      console.error(`[UPLOAD] Unknown error during upload:`, err)
      return res.status(400).json({ success: false, message: err.message })
    }
    
    try {
      if (!req.file) {
        console.warn(`[UPLOAD] No file received`)
        return res.status(400).json({ success: false, message: 'No image uploaded' })
      }
      
      const dynasty = sanitize(req.body.dynasty || 'tang')
      console.log(`[UPLOAD] File uploaded successfully: ${req.file.filename}, dynasty: ${dynasty}`)
      
      res.json({
        success: true,
        imageId: req.file.filename,
        dynasty,
        originalUrl: `/uploads/${dynasty}/${req.file.filename}`
      })
    } catch (error) {
      console.error('[UPLOAD] Processing error after upload:', error)
      res.status(500).json({ success: false, message: 'Upload failed' })
    }
  })
})

// POST /api/generate
router.post('/generate', async (req, res) => {
  console.log(`[GENERATE] Starting generate request with body:`, req.body)
  const { imageId, dynasty } = req.body
  
  if (!imageId || !dynasty) {
    console.warn(`[GENERATE] Missing imageId or dynasty`)
    return res.status(400).json({ success: false, message: 'Missing imageId or dynasty' })
  }

  try {
    const safeDynasty = sanitize(dynasty)
    const safeImageId = sanitize(imageId.split('.')[0]) + path.extname(imageId)
    
    const uploadDir = path.join(UPLOADS_DIR, safeDynasty)
    const imagePath = path.join(uploadDir, safeImageId)
    
    console.log(`[GENERATE] Looking for image at: ${imagePath}`)
    
    if (!fs.existsSync(imagePath)) {
       console.error(`[GENERATE] Image not found: ${imagePath}`)
       return res.status(404).json({ success: false, message: 'Image not found' })
    }

    const apiKey = process.env.QWEN_API_KEY
    if (!apiKey) {
      console.warn('[GENERATE] QWEN_API_KEY not found in env, using mock generation')
    }

    // Call AI Service
    let apiResult = null
    if (apiKey) {
      try {
         console.log(`[GENERATE] Calling Qwen API for dynasty: ${safeDynasty}`)
         apiResult = await generateHistoricalImage({ imagePath, dynasty: safeDynasty, apiKey })
         console.log(`[GENERATE] Qwen API call successful`)
      } catch (e: any) {
        console.error('[GENERATE] AI Generation failed:', e.message)
        if (e.message.includes('401') || e.message.includes('API key')) {
           return res.status(500).json({ success: false, message: 'AI Service configuration error' })
        }
      }
    }

    const genDir = path.join(GENERATED_DIR, safeDynasty)
    if (!fs.existsSync(genDir)) {
      console.log(`[GENERATE] Creating generated directory: ${genDir}`)
      fs.mkdirSync(genDir, { recursive: true })
    }
    
    const genFilename = `gen-${safeImageId}`
    const genPath = path.join(genDir, genFilename)
    
    console.log(`[GENERATE] Saving generated image to: ${genPath}`)
    
    // Simulate generation by copying original if AI fails or no key
    // In real app: download image from apiResult
    try {
      fs.copyFileSync(imagePath, genPath)
      console.log(`[GENERATE] Image file saved successfully`)
    } catch (fsErr) {
      console.error(`[GENERATE] File system error during copy:`, fsErr)
      throw fsErr
    }
    
    // Backup (only if not on Vercel to avoid unnecessary writes)
    if (!process.env.VERCEL) {
      try {
        const backupDir = path.join(process.cwd(), 'backup')
        if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true })
        fs.copyFileSync(genPath, path.join(backupDir, `${safeDynasty}-${genFilename}`))
        console.log(`[GENERATE] Backup created`)
      } catch (backupErr) {
        console.warn(`[GENERATE] Backup failed (non-critical):`, backupErr)
      }
    }

    res.json({
      success: true,
      resultId: genFilename,
      imageUrl: `/generated/${safeDynasty}/${genFilename}`,
      status: 'completed',
      apiResult
    })
    
  } catch (error: any) {
    console.error('[GENERATE] Error in generate route:', error)
    res.status(500).json({ success: false, message: error.message || 'Generation failed' })
  }
})

// GET /api/result/:id
router.get('/result/:filename', (req, res) => {
  const { filename } = req.params
  const dynasty = req.query.dynasty as string
  
  if (!dynasty) return res.status(400).json({ success: false, message: 'Dynasty required' })
  
  const safeDynasty = sanitize(dynasty)
  const safeFilename = sanitize(filename.split('.')[0]) + path.extname(filename)
  
  const filePath = path.join(GENERATED_DIR, safeDynasty, safeFilename)
  
  if (fs.existsSync(filePath)) {
    res.json({
      success: true,
      imageUrl: `/generated/${safeDynasty}/${safeFilename}`,
      dynasty: safeDynasty
    })
  } else {
    res.status(404).json({ success: false, message: 'Result not found' })
  }
})

export default router
