
import fs from 'fs'

const API_URL = 'https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation'

const DYNASTY_PROMPTS: Record<string, { male: string; female: string }> = {
  tang: {
    female: '唐代齊胸襦裙，色彩鮮豔如石榴紅，搭配精美披帛，髮髻高聳點綴金飾，展現盛唐華貴之美。',
    male: '唐代圓領袍，腰繫革帶，頭戴幞頭，面料考究，盡顯盛唐男子健碩大氣之風。'
  },
  song: {
    female: '宋代清雅褙子搭配百褶長裙，色彩清新柔和，剪裁修長合體，體現文人雅士的簡約優雅。',
    male: '宋代寬袖襴衫，搭配東坡巾，風格儒雅淡泊，展現宋代文人的風骨。'
  },
  ming: {
    female: '明代織金馬面裙搭配立領襖裙，工藝精湛，裝飾繁複，展現大明端莊典雅的風範。',
    male: '明代交領道袍，領口挺括，搭配網巾，氣宇軒昂，展現大明君子之風。'
  },
  qing: {
    female: '清代華麗旗裝，領口與袖口裝飾繁複刺繡，搭配精緻旗頭與盤扣，盡顯宮廷典雅。',
    male: '清代長袍馬褂，領口立挺，裝飾如意紋樣，展現清代滿漢交融的獨特風格。'
  }
}

interface GenerateOptions {
  imagePath: string
  dynasty: string
  gender: string
  keepBackground: boolean
  apiKey: string
}

export const generateHistoricalImage = async ({ imagePath, dynasty, gender, keepBackground, apiKey }: GenerateOptions) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    console.warn(`[QWEN-EDIT] Request timed out for ${imagePath}`)
    controller.abort()
  }, 60000)

  try {
    console.log(`[QWEN-EDIT] Preparing request for ${imagePath}, dynasty: ${dynasty}, gender: ${gender}, keepBackground: ${keepBackground}`)
    
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file not found at ${imagePath}`)
    }

    const imageBuffer = fs.readFileSync(imagePath)
    const base64Image = imageBuffer.toString('base64')

    const dynastyDetail = DYNASTY_PROMPTS[dynasty] || DYNASTY_PROMPTS.tang
    const clothingDescription = gender === 'male' ? dynastyDetail.male : dynastyDetail.female

    const backgroundInstruction = keepBackground 
      ? '4. 【環境保留】：必須完整保留原圖中的背景環境、光影氛圍和所有背景細節，不得進行任何修改。'
      : `4. 【環境融合】：將背景調整為適配該朝代風格的【寫實古風場景】（如古建築、中式園林、宮廷內部等）。人物與背景的光影、色調必須融合自然，如同在實景中拍攝。`

    const prompt = `請對這張圖片進行「大師級」人像換裝編輯：
    1. 【核心禁令 - 絕對保護面部】：嚴禁以任何形式修改照片中人物的面部特徵！必須完整保留原圖中的眼睛形狀、瞳孔、鼻子輪廓、嘴部特徵、臉型曲線、五官比例、表情神態以及所有身份特徵。人物的面部必須與原圖100%完全一致，如同照片本身。
    2. 【服飾更換】：僅將人物穿著的現代服裝更換為【${dynasty}朝代】的【${gender === 'male' ? '男裝' : '女裝'}】。具體要求：${clothingDescription}
    3. 【藝術細節】：服飾面料應具有真實的絲綢或棉麻質感，刺繡紋樣需清晰細膩，符合歷史實物特徵。
    ${backgroundInstruction}
    5. 【規格要求】：輸出 512x512 的超高清正方形圖像，構圖比例保持人像居中。`

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
