
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

    const prompt = `請對這張圖片進行專業級的「人像換裝」編輯：
    1. 【核心要求】：嚴禁修改照片中人物的面部特徵（包括眼睛、鼻子、嘴巴、臉型、五官比例、表情和身份特徵），必須保持與原圖100%一致。
    2. 【更換內容】：僅將人物的服裝更換為${dynasty}朝代的${gender === 'male' ? '男裝' : '女裝'}傳統服飾（漢服）。
    3. 【細節描述】：服飾應符合${dynasty}時期的歷史特徵，工藝精湛，細節豐富。
    4. 【背景適配】：背景應自動調整為與${dynasty}朝代相符的古風場景（如古建築、中式園林等），但要與人物光影融合自然。
    5. 【畫質要求】：輸出 512x512 的超高清正方形圖像。`

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
