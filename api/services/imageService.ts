import fs from 'fs/promises'
import path from 'path'
import { generateHistoricalImage } from './qwen.js'

export class ImageService {
  /**
   * Ensure directory exists
   */
  async ensureDirectory(dir: string): Promise<void> {
    try {
      await fs.access(dir)
    } catch {
      await fs.mkdir(dir, { recursive: true })
    }
  }

  /**
   * Save buffer to file
   */
  async saveImage(filePath: string, buffer: Buffer): Promise<void> {
    await fs.writeFile(filePath, buffer)
  }

  /**
   * Copy file
   */
  async copyImage(src: string, dest: string): Promise<void> {
    await fs.copyFile(src, dest)
  }

  /**
   * Download image from URL and save to destination
   */
  async downloadImage(url: string, dest: string): Promise<void> {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Failed to download image: ${response.statusText}`)
    const buffer = Buffer.from(await response.arrayBuffer())
    await this.saveImage(dest, buffer)
  }

  /**
   * Process image generation using Qwen
   */
  async processGeneration(params: {
    imagePath: string
    dynasty: string
    gender: string
    role?: string
    composition?: string
    colors?: { top: string; bottom: string; accessory: string }
    keepBackground: boolean
    apiKey: string
  }): Promise<{ imageUrl: string | null; apiResult: any }> {
    const apiResult = await generateHistoricalImage(params)
    
    let imageUrl: string | null = null
    const content = apiResult.output?.choices?.[0]?.message?.content
    
    if (Array.isArray(content)) {
      const imageItem = content.find((item: any) => item.image)
      imageUrl = imageItem?.image || null
    }

    return { imageUrl, apiResult }
  }

  /**
   * Cleanup files older than specified age (in milliseconds)
   */
  async cleanupOldFiles(dir: string, maxAgeMs: number = 24 * 60 * 60 * 1000): Promise<void> {
    try {
      const files = await fs.readdir(dir)
      const now = Date.now()

      for (const file of files) {
        const filePath = path.join(dir, file)
        try {
          const stats = await fs.stat(filePath)
          if (stats.isDirectory()) {
            await this.cleanupOldFiles(filePath, maxAgeMs) // Recursive
          } else {
            if (now - stats.mtimeMs > maxAgeMs) {
              await fs.unlink(filePath)
              console.log(`[CLEANUP] Deleted old file: ${filePath}`)
            }
          }
        } catch (err) {
          console.warn(`[CLEANUP] Failed to process file ${filePath}:`, err)
        }
      }
    } catch (err) {
      // Directory might not exist or other error, just ignore
      // console.warn(`[CLEANUP] Error reading directory ${dir}:`, err)
    }
  }
}

export const imageService = new ImageService()
