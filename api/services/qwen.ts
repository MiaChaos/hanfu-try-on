
import fs from 'fs'

const API_URL = 'https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation'

const DYNASTY_PROMPTS: Record<string, Record<string, { male: { upper: string; full: string }; female: { upper: string; full: string } }>> = {
  tang: {
    commoner: {
      female: {
        full: '唐代平民女裝：齊胸襦裙，棉麻材質，顏色淡雅（淡青、淺褐），無刺繡。簡單髮髻，木釵裝飾。風格樸素自然。',
        upper: '唐代平民女裝（半身）：齊胸襦裙上裝，粗布材質，無裝飾。簡單髮髻。風格樸素。'
      },
      male: {
        full: '唐代平民男裝：粗布短衣長褲（裋褐），腰繫布帶，褲腳紮緊。黑色頭巾。材質粗糙，便於活動。',
        upper: '唐代平民男裝（半身）：粗布短衣，領口寬鬆。黑色頭巾。材質粗糙。'
      }
    },
    official: {
      female: {
        full: '唐代貴婦服飾：寬袖大衫，內搭訶子裙，披印金披帛。顏色豔麗（紅、藍），精美刺繡。金絲鳳冠，珠翠步搖。風格奢華雍容。',
        upper: '唐代貴婦服飾（半身）：寬袖大衫上裝，領袖滿繡金線。金絲鳳冠，珠寶頭飾。風格奢華。'
      },
      male: {
        full: '唐代高官朝服：紫色圓領袍，金玉腰帶，手持笏板。硬腳幞頭，烏皮靴。絲綢材質，暗紋光澤。風格威嚴。',
        upper: '唐代高官朝服（半身）：紫色圓領袍，光澤絲綢。硬腳幞頭。風格威嚴。'
      }
    },
    emperor: {
      female: {
        full: '唐代皇后褘衣：深青色褘衣，繡翟鳥（山雉）紋，領袖雲龍紋。博鬢鳳冠，金翠珠寶。面貼花鈿。風格至尊華貴。',
        upper: '唐代皇后褘衣（半身）：深青色褘衣上裝，繡雲龍紋。博鬢鳳冠，金翠珠寶。面貼花鈿。風格華貴。'
      },
      male: {
        full: '唐代皇帝袞龍袍：赭黃色圓領袍，繡團龍紋。九環玉帶，翼善冠。風格威嚴至尊。',
        upper: '唐代皇帝袞龍袍（半身）：赭黃色圓領袍，繡團龍紋。翼善冠。風格威嚴。'
      }
    }
  },
  song: {
    commoner: {
      female: {
        full: '宋代平民女裝：窄袖對襟褙子，內搭抹胸，素色百褶裙。棉布材質，顏色清淡（灰白、淺藍）。風格簡潔，無珠寶。',
        upper: '宋代平民女裝（半身）：窄袖對襟褙子，內搭抹胸。棉布材質，顏色清淡。風格簡潔。'
      },
      male: {
        full: '宋代平民男裝：短褐，寬褲，草鞋。簡單方巾。粗麻材質，顏色灰暗。風格樸實。',
        upper: '宋代平民男裝（半身）：短褐上裝。簡單方巾。粗麻材質，顏色灰暗。'
      }
    },
    official: {
      female: {
        full: '宋代貴婦服飾：朱紅色大袖衫，霞帔（金墜子），繡花羅裙。高聳鳳冠，珍珠寶石。絲滑材質，精細刺繡。風格端莊富貴。',
        upper: '宋代貴婦服飾（半身）：朱紅色大袖衫，霞帔（金墜子）。高聳鳳冠，珍珠寶石。風格端莊。'
      },
      male: {
        full: '宋代高官公服：緋色寬袖圓領袍，白羅方心曲領。長翅帽（展角幞頭），金帶。風格儒雅威嚴。',
        upper: '宋代高官公服（半身）：緋色寬袖圓領袍，白羅方心曲領。長翅帽。風格儒雅。'
      }
    },
    emperor: {
      female: {
        full: '宋代皇后禮服：深青色翟衣，繡翟鳥。霞帔，龍鳳花釵冠（博鬢）。面貼珠甸。風格莊重。',
        upper: '宋代皇后禮服（半身）：深青色翟衣，霞帔。龍鳳花釵冠。面貼珠甸。風格莊重。'
      },
      male: {
        full: '宋代皇帝朝服：紅色寬袖絳紗袍，方心曲領。通天冠，玉佩。風格神聖簡潔。',
        upper: '宋代皇帝朝服（半身）：紅色寬袖絳紗袍，方心曲領。通天冠。風格神聖。'
      }
    }
  },
  ming: {
    commoner: {
      female: {
        full: '明代平民女裝：青布比甲或窄袖襖，素裙。棉布材質，無刺繡。簡單髮髻，銀簪。風格勤儉。',
        upper: '明代平民女裝（半身）：青布比甲或窄袖襖。棉布材質，無刺繡。簡單髮髻。風格勤儉。'
      },
      male: {
        full: '明代平民男裝：短衣小帽或青布直身。布帶，布鞋。樸素材質，藍灰單色。風格日常。',
        upper: '明代平民男裝（半身）：短衣小帽或青布直身。樸素材質，單色。風格日常。'
      }
    },
    official: {
      female: {
        full: '明代貴婦服飾：真紅大袖衫，深青霞帔（雲鳳紋）。翟冠，金簪。織金妝花緞。風格顯赫。',
        upper: '明代貴婦服飾（半身）：真紅大袖衫，深青霞帔。翟冠，金簪。織金面料。'
      },
      male: {
        full: '明代文官補服：緋色盤領袍，胸前仙鶴補子。烏紗帽，玉帶。華貴面料。風格威嚴。',
        upper: '明代文官補服（半身）：緋色盤領袍，仙鶴補子。烏紗帽。華貴面料。風格威嚴。'
      }
    },
    emperor: {
      female: {
        full: '明代皇后冠服：黃色大衫，霞帔。九龍四鳳冠，寶石珍珠。紅色鞠衣。風格極致華貴。',
        upper: '明代皇后冠服（半身）：黃色大衫，霞帔。九龍四鳳冠。風格華貴。'
      },
      male: {
        full: '明代皇帝袞服：黃色袞龍袍，十二團龍紋。金絲翼善冠。玉帶，皁靴。風格霸氣。',
        upper: '明代皇帝袞服（半身）：黃色袞龍袍，團龍紋。金絲翼善冠。風格霸氣。'
      }
    }
  },
  qing: {
    commoner: {
      female: {
        full: '清代平民女裝：青布大襟衫，寬腳褲。簡單滾邊。簡單髮髻，銅簪。土布材質。風格質樸。',
        upper: '清代平民女裝（半身）：青布大襟衫。簡單髮髻，銅簪。土布材質。風格質樸。'
      },
      male: {
        full: '清代平民男裝：對襟短褂，寬褲。草帽或頭巾，辮子。皮膚黝黑。風格滄桑。',
        upper: '清代平民男裝（半身）：對襟短褂。草帽或頭巾，辮子。皮膚黝黑。'
      }
    },
    official: {
      female: {
        full: '清代貴婦旗裝：明黃或寶藍旗袍，滿繡牡丹，鑲滾花邊。大拉翅（旗頭），點翠絹花。花盆底鞋。風格奢華。',
        upper: '清代貴婦旗裝（半身）：明黃或寶藍旗袍，滿繡。大拉翅（旗頭），點翠絹花。風格奢華。'
      },
      male: {
        full: '清代官員朝服：石青補褂，仙鶴補子。朝珠。紅纓頂戴花翎。內穿蟒袍。風格顯赫。',
        upper: '清代官員朝服（半身）：石青補褂，仙鶴補子。朝珠。紅纓頂戴花翎。'
      }
    },
    emperor: {
      female: {
        full: '清代皇后朝服：明黃朝袍，石青朝褂。朝珠，一耳三鉗。金累絲朝冠。風格富麗堂皇。',
        upper: '清代皇后朝服（半身）：明黃朝袍，石青朝褂。朝珠，一耳三鉗。金累絲朝冠。風格富麗。'
      },
      male: {
        full: '清代皇帝龍袍：明黃吉服袍，九龍紋。朝珠，吉服冠（紅纓）。風格統治權威。',
        upper: '清代皇帝龍袍（半身）：明黃吉服袍，龍紋。朝珠，吉服冠。風格權威。'
      }
    }
  }
}

const COMPOSITION_PROMPTS: Record<string, string> = {
  selfie: '【構圖：自拍】保留面部特寫，背景虛化。',
  upper_body: '【構圖：半身】展示上半身服飾細節（領口、袖口）。',
  full_body: '【構圖：全身】人物完整，展示整體服飾。',
  group: '【構圖：多人】所有人物風格統一。',
}

interface GenerateOptions {
  imagePath: string
  dynasty: string
  gender: string
  role?: string // Added role
  composition?: string // Added composition
  colors?: { top: string; bottom: string; accessory: string } // Added colors
  keepBackground: boolean
  apiKey: string
}

const COLOR_MAP: Record<string, string> = {
  red: '朱紅',
  blue: '靛藍',
  green: '青綠',
  white: '月白',
  black: '玄黑',
  gold: '金黃',
  purple: '紫棠',
  pink: '桃粉'
}

export const generateHistoricalImage = async ({ imagePath, dynasty, gender, role = 'commoner', composition = 'upper_body', colors, keepBackground, apiKey }: GenerateOptions) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    console.warn(`[QWEN-EDIT] Request timed out for ${imagePath}`)
    controller.abort()
  }, 60000)

  try {
    console.log(`[QWEN-EDIT] Preparing request for ${imagePath}, dynasty: ${dynasty}, gender: ${gender}, role: ${role}, composition: ${composition}, keepBackground: ${keepBackground}`)
    
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file not found at ${imagePath}`)
    }

    const imageBuffer = await fs.promises.readFile(imagePath)
    const base64Image = imageBuffer.toString('base64')

    const dynastyData = DYNASTY_PROMPTS[dynasty] || DYNASTY_PROMPTS.tang
    const roleData = dynastyData[role as keyof typeof dynastyData] || dynastyData.commoner
    const genderData = gender === 'male' ? roleData.male : roleData.female
    
    // Determine which description to use based on composition
    const isUpperBody = composition === 'selfie' || composition === 'upper_body'
    const clothingDescription = isUpperBody ? genderData.upper : genderData.full
    
    const compositionPrompt = COMPOSITION_PROMPTS[composition] || COMPOSITION_PROMPTS.upper_body

    const backgroundInstruction = keepBackground
      ? '4. 【環境】：100%保留原圖背景，不得修改。'
      : `4. 【環境】：背景改為【${dynasty}朝代風格寫實場景】（如古建築、園林）。光影自然融合。`

    // Determine target instruction based on composition
    const targetInstruction = composition === 'group'
      ? '【對象】：所有主要人物換裝。'
      : '【對象】：僅主角換裝，保留路人。'

    // Build color prompt
    let colorPrompt = ''
    if (colors) {
      const parts = []
      if (colors.top && colors.top !== 'default') parts.push(`上裝：${COLOR_MAP[colors.top] || colors.top}`)
      
      // Constraint: Pants color prompt should NOT appear in "upper_body" or "selfie" composition modes
      const showBottomColor = composition !== 'upper_body' && composition !== 'selfie'
      if (showBottomColor && colors.bottom && colors.bottom !== 'default') parts.push(`下裝：${COLOR_MAP[colors.bottom] || colors.bottom}`)
      
      if (colors.accessory && colors.accessory !== 'default') parts.push(`配飾：${COLOR_MAP[colors.accessory] || colors.accessory}`)
      
      if (parts.length > 0) {
        colorPrompt = `5. 【配色】：${parts.join('，')}。`
      }
    }

    const prompt = `請對圖片進行「寫實」古裝替換，嚴格執行：

    1. 【面部鎖定】：
       - 絕對保留原圖五官、臉型、表情、眼鏡。
       - 禁止重繪面部。

    2. 【構圖鎖定】：
       - 禁止裁剪、縮放、改變姿勢。
       - ${compositionPrompt}
       - ${targetInstruction}

    3. 【服飾替換】：
       - 朝代：【${dynasty}】 性別：【${gender === 'male' ? '男' : '女'}】 身份：【${role === 'emperor' ? '皇室' : role === 'official' ? '官員' : '平民'}】
       - 服飾：${clothingDescription}
       - 衣領貼合頸部，袖口配合手勢。

    ${backgroundInstruction}

    ${colorPrompt}

    6. 【規格】：512x512 高清。`

    // List of models to try in order
    const models = ['qwen-image-edit-max', 'qwen-image-edit-plus', 'qwen-image-edit']
    let lastError: any = null

    for (const model of models) {
      try {
        console.log(`[QWEN-EDIT] Sending request to DashScope (${model})...`)
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: model,
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

        const data: any = await response.json()
        
        if (!response.ok) {
          const errorMessage = data.message || data.error?.message || `API error ${response.status}`
          console.error(`[QWEN-EDIT] Model ${model} failed:`, errorMessage)
          
          // Check for 403 or quota/payment related errors
          if (response.status === 403 || 
              errorMessage.toLowerCase().includes('quota') || 
              errorMessage.toLowerCase().includes('payment') ||
              errorMessage.toLowerCase().includes('bill') ||
              data.code === 'AccessDenied') {
            lastError = new Error(errorMessage)
            console.warn(`[QWEN-EDIT] Quota/Auth error with ${model}, trying next model...`)
            continue // Try next model
          }
          
          throw new Error(errorMessage)
        }

        console.log(`[QWEN-EDIT] Request successful with ${model}`)
        clearTimeout(timeoutId)
        return data
      } catch (error: any) {
        // If it's a network error or other fetch error, we might also want to try next model if it's related to connection?
        // But for now, let's stick to the logic: if we caught an error above (response not ok), we handled it.
        // If fetch threw an error (e.g. abort), we probably shouldn't retry if it was aborted.
        if (error.name === 'AbortError') {
          throw error
        }
        
        // If it was thrown from the !response.ok block above, it's already handled (either continued or thrown)
        // If we are here, it means we continued (so this catch block won't be reached for that iteration) 
        // OR it was a real exception during fetch/json parsing.
        
        // Wait, the continue above jumps to the next iteration of the loop, so it skips this catch block.
        // So this catch block is only for unexpected errors during fetch/json parsing, OR if we re-throwed non-quota errors.
        
        // Let's refine:
        // If we threw inside the try, we land here.
        // If we want to retry on specific errors, we should do it here.
        
        // Actually, my logic above with `continue` inside `try` block works fine.
        // But if I threw "Error(errorMessage)" for non-quota errors, I land here.
        // I should re-throw non-quota errors.
        
        const errorMessage = error.message || ''
        if (errorMessage.includes('quota') || 
            errorMessage.includes('payment') || 
            errorMessage.includes('403') ||
            errorMessage.includes('AccessDenied')) {
           lastError = error
           console.warn(`[QWEN-EDIT] Error with ${model}: ${errorMessage}. Trying next model...`)
           continue
        }
        
        throw error
      }
    }

    clearTimeout(timeoutId)
    throw lastError || new Error('All models failed')

  } catch (error: any) {
    clearTimeout(timeoutId)
    console.error('[QWEN-EDIT] Service Error:', error.stack || error.message)
    throw error
  }
}
