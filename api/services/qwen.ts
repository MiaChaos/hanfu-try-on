
import fs from 'fs'

const API_URL = 'https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation'

interface GenerateOptions {
  imagePath: string
  dynasty: string
  apiKey: string
}

export const generateHistoricalImage = async ({ imagePath, dynasty, apiKey }: GenerateOptions) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    console.warn(`[QWEN] Request timed out for ${imagePath}`)
    controller.abort()
  }, 30000)

  try {
    console.log(`[QWEN] Preparing request for ${imagePath}, dynasty: ${dynasty}`)
    
    if (!fs.existsSync(imagePath)) {
      console.error(`[QWEN] File not found: ${imagePath}`)
      throw new Error(`Image file not found at ${imagePath}`)
    }

    const stats = fs.statSync(imagePath)
    console.log(`[QWEN] Image size: ${stats.size} bytes`)
    
    if (stats.size > 10 * 1024 * 1024) {
      console.warn(`[QWEN] Image too large: ${stats.size}`)
      throw new Error('Image file is too large (max 10MB)')
    }

    const imageBuffer = fs.readFileSync(imagePath)
    const base64Image = imageBuffer.toString('base64')
    console.log(`[QWEN] Base64 conversion completed (length: ${base64Image.length})`)

    const prompt = `將照片中的人物服裝更換為${dynasty}朝代的傳統服飾，保持人物面部表情和姿勢不變，背景適配該朝代風格。`

    console.log(`[QWEN] Sending request to DashScope...`)
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'qwen-vl-max',
        input: {
          messages: [
            {
              role: 'system',
              content: 'You are a professional historical costume designer.'
            },
            {
              role: 'user',
              content: [
                { image: `data:image/jpeg;base64,${base64Image}` },
                { text: prompt }
              ]
            }
          ]
        },
        parameters: {
          result_format: 'message'
        }
      })
    })

    clearTimeout(timeoutId)
    console.log(`[QWEN] Received response from DashScope, status: ${response.status}`)

    const data: any = await response.json()
    console.log(`[QWEN] Response body parsed`)
    
    if (!response.ok) {
      console.error(`[QWEN] API Error:`, JSON.stringify(data))
      const errorMsg = data.message || data.error?.message || `API error ${response.status}`
      throw new Error(errorMsg)
    }

    console.log(`[QWEN] Generation successful`)
    return data
  } catch (error: any) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      console.error(`[QWEN] Request aborted due to timeout`)
      throw new Error('Qwen API request timed out')
    }
    console.error('[QWEN] Service Error:', error.stack || error.message)
    throw error
  }
}
