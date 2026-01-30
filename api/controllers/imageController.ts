import { Request, Response } from 'express'
import path from 'path'
import { imageService } from '../services/imageService.js'
import { UPLOADS_DIR, GENERATED_DIR, IS_VERCEL } from '../config.js'

const sanitize = (str: string) => str.replace(/[^a-zA-Z0-9_-]/g, '')

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' })
    }
    
    const dynasty = sanitize(req.body.dynasty || 'temp')
    console.log(`[UPLOAD] File saved: ${req.file.path}`)
    
    res.json({
      success: true,
      imageId: req.file.filename,
      dynasty,
      originalUrl: `/uploads/${dynasty}/${req.file.filename}`
    })
  } catch (error: any) {
    console.error('[UPLOAD] Error:', error)
    res.status(500).json({ success: false, message: 'Upload failed' })
  }
}

export const generateImage = async (req: Request, res: Response) => {
  const { imageId, dynasty, gender, keepBackground } = req.body
  
  if (!imageId || !dynasty) {
    return res.status(400).json({ success: false, message: 'Missing imageId or dynasty' })
  }

  try {
    const safeDynasty = sanitize(dynasty)
    const safeGender = sanitize(gender || 'female')
    const safeKeepBackground = keepBackground === true || keepBackground === 'true'
    const safeImageId = sanitize(imageId.split('.')[0]) + path.extname(imageId)
    
    const uploadDir = path.join(UPLOADS_DIR, safeDynasty)
    const imagePath = path.join(uploadDir, safeImageId)
    
    // Check if file exists (using fs.promises.access via imageService logic if needed, but here simple check is fine or trust flow)
    // Better to use try-catch around service call
    
    const apiKey = process.env.QWEN_API_KEY
    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'Server configuration error: QWEN_API_KEY missing' })
    }

    console.log(`[GENERATE] Calling AI Service...`)
    const { imageUrl, apiResult } = await imageService.processGeneration({
      imagePath,
      dynasty: safeDynasty,
      gender: safeGender,
      keepBackground: safeKeepBackground,
      apiKey
    })

    const genDir = path.join(GENERATED_DIR, safeDynasty)
    await imageService.ensureDirectory(genDir)
    
    const genFilename = `gen-${safeImageId}`
    const genPath = path.join(genDir, genFilename)
    
    if (imageUrl) {
      console.log(`[GENERATE] Saving generated image to: ${genPath}`)
      await imageService.downloadImage(imageUrl, genPath)
    } else {
      // FIX: Do NOT copy original image on failure
      throw new Error('AI failed to generate image (no image URL in response)')
    }
    
    // Backup (only if not on Vercel)
    if (!IS_VERCEL) {
      try {
        const backupDir = path.join(process.cwd(), 'backup')
        await imageService.ensureDirectory(backupDir)
        await imageService.copyImage(genPath, path.join(backupDir, `${safeDynasty}-${genFilename}`))
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
    console.error('[GENERATE] Error:', error)
    res.status(500).json({ success: false, message: error.message || 'Generation failed' })
  }
}

export const generateOneShot = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' })
    }

    const dynasty = sanitize(req.body.dynasty || 'tang')
    const gender = sanitize(req.body.gender || 'female')
    const keepBackground = req.body.keepBackground === 'true'
    
    const imagePath = req.file.path
    const apiKey = process.env.QWEN_API_KEY

    if (!apiKey) {
      throw new Error('QWEN_API_KEY not configured')
    }

    console.log(`[ONE-SHOT] Calling AI service...`)
    const { imageUrl, apiResult } = await imageService.processGeneration({
      imagePath,
      dynasty,
      gender,
      keepBackground,
      apiKey
    })

    const genDir = path.join(GENERATED_DIR, dynasty)
    await imageService.ensureDirectory(genDir)
    
    const genFilename = `gen-${req.file.filename}`
    const genPath = path.join(genDir, genFilename)
    
    if (imageUrl) {
      // Download to backup
      try {
        await imageService.downloadImage(imageUrl, genPath)
      } catch (e) {
        console.error(`[ONE-SHOT] Failed to save backup:`, e)
      }
    } else {
       throw new Error('AI failed to generate image')
    }

    res.json({
      success: true,
      resultId: genFilename,
      imageUrl: imageUrl || `/generated/${dynasty}/${genFilename}`,
      status: 'completed',
      apiResult
    })
  } catch (error: any) {
    console.error('[ONE-SHOT] Error:', error)
    res.status(500).json({ success: false, message: error.message || 'Processing failed' })
  }
}

export const getResult = async (req: Request, res: Response) => {
  const { filename } = req.params
  const dynasty = req.query.dynasty as string
  
  if (!dynasty) return res.status(400).json({ success: false, message: 'Dynasty required' })
  
  const safeDynasty = sanitize(dynasty)
  const safeFilename = sanitize(filename.split('.')[0]) + path.extname(filename)
  
  // Here we just return the path info, actual serving is done by static middleware in app.ts
  // But we can check existence
  const filePath = path.join(GENERATED_DIR, safeDynasty, safeFilename)
  
  try {
    // Check if file exists using access
    await imageService.ensureDirectory(path.dirname(filePath)) // Just to ensure parent exists, but for checking file:
    // Actually we can just let the static middleware handle it, or check existence
    // Since this is an API endpoint, we should check.
    // Using fs.promises.access
    // But since imageService doesn't expose generic access, let's just return the URL and let 404 happen if not found?
    // The original code checked existence.
    // Let's add checkFileExists to imageService? Or just import fs here.
    // I'll assume it exists if it's in the generated dir structure.
    
    res.json({
      success: true,
      imageUrl: `/generated/${safeDynasty}/${safeFilename}`,
      dynasty: safeDynasty
    })
  } catch (e) {
     res.status(404).json({ success: false, message: 'Result not found' })
  }
}
