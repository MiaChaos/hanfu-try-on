
import fs from 'fs'

const API_URL = 'https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/image2image/image-to-image'

interface GenerateOptions {
  imagePath: string
  dynasty: string
  gender: string
  apiKey: string
}

export const generateHistoricalImage = async ({ imagePath, dynasty, gender, apiKey }: GenerateOptions) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    console.warn(`[WANX] Request timed out for ${imagePath}`)
    controller.abort()
  }, 60000)

  try {
    console.log(`[WANX] Preparing request for ${imagePath}, dynasty: ${dynasty}, gender: ${gender}`)
    
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file not found at ${imagePath}`)
    }

    const imageBuffer = fs.readFileSync(imagePath)
    const base64Image = imageBuffer.toString('base64')

    const prompt = `將照片中的人物服裝更換為${dynasty}朝代的${gender === 'male' ? '男裝' : '女裝'}傳統服飾（漢服），保持人物面部特徵、表情和姿勢完全一致，背景適配該朝代風格，高清，細節豐富。`

    console.log(`[WANX] Sending request to DashScope (Wanx V1)...`)
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-DashScope-Async': 'enable'
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'wanx-v1',
        input: {
          image_base64: base64Image,
          prompt: prompt
        },
        parameters: {
          style: '<auto>',
          size: '512*512',
          n: 1
        }
      })
    })

    clearTimeout(timeoutId)
    const data: any = await response.json()
    
    if (!response.ok) {
      console.error(`[WANX] API Error:`, JSON.stringify(data))
      throw new Error(data.message || data.error?.message || `API error ${response.status}`)
    }

    // Wanx is asynchronous, we get a task_id
    console.log(`[WANX] Task created: ${data.output?.task_id}`)
    return data
  } catch (error: any) {
    clearTimeout(timeoutId)
    console.error('[WANX] Service Error:', error.stack || error.message)
    throw error
  }
}
