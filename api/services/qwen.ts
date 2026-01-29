
import fs from 'fs'

const API_URL = 'https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation'

interface GenerateOptions {
  imagePath: string
  dynasty: string
  gender: string
  apiKey: string
}

export const generateHistoricalImage = async ({ imagePath, dynasty, gender, apiKey }: GenerateOptions) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    console.warn(`[QWEN-EDIT] Request timed out for ${imagePath}`)
    controller.abort()
  }, 60000)

  try {
    console.log(`[QWEN-EDIT] Preparing request for ${imagePath}, dynasty: ${dynasty}, gender: ${gender}`)
    
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file not found at ${imagePath}`)
    }

    const imageBuffer = fs.readFileSync(imagePath)
    const base64Image = imageBuffer.toString('base64')

    const prompt = `請對這張圖片進行編輯：將照片中的人物服裝更換為${dynasty}朝代的${gender === 'male' ? '男裝' : '女裝'}傳統服飾（漢服）。要求：1. 保持人物的面部特徵、表情、姿勢與原圖完全一致。2. 背景適配該朝代風格。3. 生成 512x512 的高質量圖像。`

    console.log(`[QWEN-EDIT] Sending request to DashScope (qwen-image-edit-max)...`)
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'qwen-image-edit-max',
        input: {
          messages: [
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
    const data: any = await response.json()
    
    if (!response.ok) {
      console.error(`[QWEN-EDIT] API Error:`, JSON.stringify(data))
      throw new Error(data.message || data.error?.message || `API error ${response.status}`)
    }

    console.log(`[QWEN-EDIT] Request successful`)
    return data
  } catch (error: any) {
    clearTimeout(timeoutId)
    console.error('[QWEN-EDIT] Service Error:', error.stack || error.message)
    throw error
  }
}
