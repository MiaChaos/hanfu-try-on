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
}

export const imageService = new ImageService()
