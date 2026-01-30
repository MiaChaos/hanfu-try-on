
import fs from 'fs'

const API_URL = 'https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation'

const DYNASTY_PROMPTS: Record<string, Record<string, { male: { upper: string; full: string }; female: { upper: string; full: string } }>> = {
  tang: {
    commoner: {
      female: {
        full: '唐代女性平民服飾：身穿經典齊胸襦裙，短上衣紮進長裙內，色彩以石榴紅或間色為主，肩披輕薄披帛。髮髻簡約，點綴少量花朵。整體展現盛唐女性的自信與豐腴之美。',
        upper: '唐代女性平民服飾（半身）：重點展示齊胸襦裙的上裝細節，短上衣領口精緻，肩披輕薄披帛。髮髻簡約，點綴少量花朵。展現盛唐女性的自信面容與豐腴體態。'
      },
      male: {
        full: '唐代男性平民服飾：身穿圓領窄袖袍或裋褐（短衣長褲），腰繫布帶，頭戴黑色軟腳幞頭或裹巾。面料為棉麻質感，色彩樸素，便於日常勞作。',
        upper: '唐代男性平民服飾（半身）：身穿圓領窄袖袍或裋褐上衣，頭戴黑色軟腳幞頭或裹巾。面料為棉麻質感，色彩樸素，展現日常勞作的質樸感。'
      }
    },
    official: {
      female: {
        full: '唐代誥命夫人服飾：身穿寬大華麗的圓領袍或大袖衫，色彩為紫色或緋色，裝飾精美團花紋樣。髮髻高聳，佩戴金銀釵鈿步搖，手持團扇，盡顯貴婦雍容華貴。',
        upper: '唐代誥命夫人服飾（半身）：身穿華麗圓領袍或大袖衫上裝，色彩為紫色或緋色，領口裝飾精美團花。髮髻高聳，佩戴金銀釵鈿步搖，盡顯貴婦雍容華貴。'
      },
      male: {
        full: '唐代官員朝服：身穿紫色或緋色圓領袍（根據品級），腰繫玉帶或金帶，頭戴硬腳幞頭，腳穿烏皮靴。布料為上等絲綢，暗紋精緻，展現大唐官員的威儀。',
        upper: '唐代官員朝服（半身）：身穿紫色或緋色圓領袍上裝，領口圓潤，頭戴硬腳幞頭。布料為上等絲綢，暗紋精緻，展現大唐官員的威儀。'
      }
    },
    emperor: {
      female: {
        full: '唐代皇后褘衣：身穿深青色褘衣，繡有翟鳥（長尾山雉）紋樣，領口袖口裝飾雲龍紋。頭戴極其華麗的博鬢鳳冠，飾滿金翠珠寶。面貼花鈿，展現母儀天下的至尊氣場。',
        upper: '唐代皇后褘衣（半身）：身穿深青色褘衣上裝，領口繡有雲龍紋。頭戴極其華麗的博鬢鳳冠，飾滿金翠珠寶。面貼花鈿，展現母儀天下的至尊氣場。'
      },
      male: {
        full: '唐代皇帝袞龍袍：身穿赭黃色圓領窄袖袍，胸前及肩部繡有團龍紋樣。腰繫九環玉帶，頭戴翼善冠或折上巾。神態威嚴，展現大唐天子的至高無上。',
        upper: '唐代皇帝袞龍袍（半身）：身穿赭黃色圓領袍上裝，胸前及肩部繡有團龍紋樣。頭戴翼善冠或折上巾。神態威嚴，展現大唐天子的至高無上。'
      }
    }
  },
  song: {
    commoner: {
      female: {
        full: '宋代女性平民服飾：身穿直領對襟褙子，內搭抹胸，下著百褶裙。色彩清雅，如淡綠、藕荷、鵝黃。剪裁修長合體，展現宋代女性的纖細與文雅。',
        upper: '宋代女性平民服飾（半身）：身穿直領對襟褙子，內搭抹胸，領口層次分明。色彩清雅，如淡綠、藕荷、鵝黃。展現宋代女性的纖細與文雅。'
      },
      male: {
        full: '宋代男性平民服飾：身穿交領短衫，下著長褲，外罩素色布袍。頭戴東坡巾或簡單方巾。面料質樸，色彩低調，體現市井生活的簡約。',
        upper: '宋代男性平民服飾（半身）：身穿交領短衫或素色布袍上裝。頭戴東坡巾或簡單方巾。面料質樸，色彩低調，體現市井生活的簡約。'
      }
    },
    official: {
      female: {
        full: '宋代命婦禮服：身穿朱紅色大袖衫，肩披霞帔（長條形裝飾帶），掛有金銀墜子。頭戴鳳冠或花冠，插滿珠翠。妝容精緻，點綴珍珠面花，端莊典雅。',
        upper: '宋代命婦禮服（半身）：身穿朱紅色大袖衫上裝，肩披霞帔（長條形裝飾帶），掛有金銀墜子。頭戴鳳冠或花冠，插滿珠翠。妝容精緻，端莊典雅。'
      },
      male: {
        full: '宋代官員公服：身穿紅色寬袖圓領袍，領口佩戴白羅方心曲領（上圓下方）。頭戴展角幞頭（長翅帽），腰繫革帶。氣質儒雅，體現宋代士大夫的文人風骨。',
        upper: '宋代官員公服（半身）：身穿紅色寬袖圓領袍上裝，領口佩戴白羅方心曲領（上圓下方）。頭戴展角幞頭（長翅帽）。氣質儒雅，體現宋代士大夫的文人風骨。'
      }
    },
    emperor: {
      female: {
        full: '宋代皇后禮服：身穿深青色翟衣，繡有成對翟鳥。肩披霞帔，頭戴龍鳳花釵冠，兩側博鬢展開。面貼珠甸，神態莊重，展現大宋皇室的禮制之美。',
        upper: '宋代皇后禮服（半身）：身穿深青色翟衣上裝，肩披霞帔。頭戴龍鳳花釵冠，兩側博鬢展開。面貼珠甸，神態莊重，展現大宋皇室的禮制之美。'
      },
      male: {
        full: '宋代皇帝朝服：身穿絳紗袍，紅色寬袖，領口佩戴方心曲領。頭戴通天冠，佩玉佩。整體風格簡潔而神聖，體現宋代皇權的儒家禮教色彩。',
        upper: '宋代皇帝朝服（半身）：身穿絳紗袍上裝，紅色寬袖，領口佩戴方心曲領。頭戴通天冠。整體風格簡潔而神聖，體現宋代皇權的儒家禮教色彩。'
      }
    }
  },
  ming: {
    commoner: {
      female: {
        full: '明代女性平民服飾：身穿立領或交領襖裙，上衣為琵琶袖，下著馬面裙。馬面裙有規整的褶皺和織金裙瀾。色彩端莊，如月白、藍灰。展現明代市井女性的持重。',
        upper: '明代女性平民服飾（半身）：身穿立領或交領襖裙上裝，琵琶袖特徵明顯。色彩端莊，如月白、藍灰。展現明代市井女性的持重。'
      },
      male: {
        full: '明代男性文人服飾：身穿直裰或道袍，交領右衽，袖子寬大，腰繫絲絛。頭戴網巾或方巾。手持摺扇，氣質瀟灑，展現明代讀書人的儒雅。',
        upper: '明代男性文人服飾（半身）：身穿直裰或道袍上裝，交領右衽，袖子寬大。頭戴網巾或方巾。手持摺扇，氣質瀟灑，展現明代讀書人的儒雅。'
      }
    },
    official: {
      female: {
        full: '明代命婦大衫霞帔：身穿真紅色大袖衫，深青色霞帔，飾有雲鳳紋。頭戴翟冠，插金簪。面料厚重華麗，展現誥命夫人的尊貴身份。',
        upper: '明代命婦大衫霞帔（半身）：身穿真紅色大袖衫上裝，深青色霞帔，飾有雲鳳紋。頭戴翟冠，插金簪。面料厚重華麗，展現誥命夫人的尊貴身份。'
      },
      male: {
        full: '明代官員補服：身穿紅色或藍色盤領袍，胸前和背後縫有方形補子（文禽武獸）。頭戴烏紗帽（圓翅），腰繫玉帶。神態嚴肅，體現大明官場的威嚴。',
        upper: '明代官員補服（半身）：身穿紅色或藍色盤領袍上裝，胸前縫有方形補子（文禽武獸）。頭戴烏紗帽（圓翅）。神態嚴肅，體現大明官場的威嚴。'
      }
    },
    emperor: {
      female: {
        full: '明代皇后燕居冠服：身穿黃色大衫，雙肩霞帔。頭戴九龍四鳳冠，鑲嵌無數寶石珍珠。內穿紅色鞠衣。整體金碧輝煌，展現大明皇后的極致華貴。',
        upper: '明代皇后燕居冠服（半身）：身穿黃色大衫上裝，雙肩霞帔。頭戴九龍四鳳冠，鑲嵌無數寶石珍珠。整體金碧輝煌，展現大明皇后的極致華貴。'
      },
      male: {
        full: '明代皇帝袞服：身穿黃色袞龍袍，繡有十二團龍紋。頭戴金絲翼善冠。腰繫玉帶，腳穿皁靴。氣宇軒昂，展現大明君主的威嚴與霸氣。',
        upper: '明代皇帝袞服（半身）：身穿黃色袞龍袍上裝，肩部與胸前繡有團龍紋。頭戴金絲翼善冠。氣宇軒昂，展現大明君主的威嚴與霸氣。'
      }
    }
  },
  qing: {
    commoner: {
      female: {
        full: '清代漢族女性服飾：身穿大襟襖，袖口寬大並鑲有多層花邊（鑲滾），下著百褶裙。髮髻低垂，插銀簪。色彩素雅，展現晚清女性的溫婉。',
        upper: '清代漢族女性服飾（半身）：身穿大襟襖上裝，袖口寬大並鑲有多層花邊（鑲滾）。髮髻低垂，插銀簪。色彩素雅，展現晚清女性的溫婉。'
      },
      male: {
        full: '清代男性平民服飾：身穿長袍馬褂，內長衫外馬褂。頭戴瓜皮帽，腦後留辮。馬褂多為暗色，長袍色彩較淺。展現清末民初的市井風貌。',
        upper: '清代男性平民服飾（半身）：身穿長袍馬褂上裝，內長衫外馬褂。頭戴瓜皮帽，腦後留辮。馬褂多為暗色。展現清末民初的市井風貌。'
      }
    },
    official: {
      female: {
        full: '清代滿族貴婦旗裝：身穿寬身直筒旗袍，裝飾繁複的繡花與鑲滾。腳穿花盆底鞋。頭戴大拉翅（旗頭），飾有大朵絹花與流蘇。氣質高貴慵懶。',
        upper: '清代滿族貴婦旗裝（半身）：身穿寬身直筒旗袍上裝，領口與襟邊裝飾繁複的繡花與鑲滾。頭戴大拉翅（旗頭），飾有大朵絹花與流蘇。氣質高貴慵懶。'
      },
      male: {
        full: '清代官員朝服：身穿藍色或石青色補褂，胸前掛朝珠。頭戴頂戴花翎（紅纓暖帽），後垂孔雀翎。內穿蟒袍。展現清代官員的獨特規制。',
        upper: '清代官員朝服（半身）：身穿藍色或石青色補褂上裝，胸前掛朝珠。頭戴頂戴花翎（紅纓暖帽），後垂孔雀翎。展現清代官員的獨特規制。'
      }
    },
    emperor: {
      female: {
        full: '清代皇后朝服：身穿明黃色朝袍，外罩石青色朝褂。佩戴三盤朝珠，耳飾一耳三鉗。頭戴金累絲嵌珠寶朝冠。整體裝飾繁縟，展現清代宮廷的富麗堂皇。',
        upper: '清代皇后朝服（半身）：身穿明黃色朝袍上裝，外罩石青色朝褂。佩戴三盤朝珠，耳飾一耳三鉗。頭戴金累絲嵌珠寶朝冠。整體裝飾繁縟，展現清代宮廷的富麗堂皇。'
      },
      male: {
        full: '清代皇帝龍袍：身穿明黃色吉服袍，繡有九龍及十二章紋，下幅為海水江崖紋。頸戴朝珠，頭戴吉服冠（紅纓）。氣勢磅礴，展現大清天子的統治權威。',
        upper: '清代皇帝龍袍（半身）：身穿明黃色吉服袍上裝，胸前繡有龍紋。頸戴朝珠，頭戴吉服冠（紅纓）。氣勢磅礴，展現大清天子的統治權威。'
      }
    }
  }
}

const COMPOSITION_PROMPTS: Record<string, string> = {
  selfie: '【構圖模式：自拍/大頭照】重點刻畫人物面部特徵與神態，背景適當虛化。保留面部特寫的親密感。',
  upper_body: '【構圖模式：半身照】重點展示人物上半身的服飾細節（領口、袖口、配飾）。構圖穩定，展現人物氣質。',
  full_body: '【構圖模式：全身照】人物完整出現在畫面中（頭頂到腳底），重點展示整體服飾搭配與身體姿態。',
  group: '【構圖模式：多人合照】畫面中包含多個人物，需確保所有人物的服飾風格統一，且與朝代背景相符。',
}

interface GenerateOptions {
  imagePath: string
  dynasty: string
  gender: string
  role?: string // Added role
  composition?: string // Added composition
  keepBackground: boolean
  apiKey: string
}

export const generateHistoricalImage = async ({ imagePath, dynasty, gender, role = 'commoner', composition = 'upper_body', keepBackground, apiKey }: GenerateOptions) => {
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
      ? '4. 【環境保留】：必須完整保留原圖中的背景環境、光影氛圍和所有背景細節，不得進行任何修改。'
      : `4. 【環境融合】：將背景調整為適配該朝代風格的【寫實古風場景】（如古建築、中式園林、宮廷內部等）。人物與背景的光影、色調必須融合自然，如同在實景中拍攝。`

    // Determine target instruction based on composition
    const targetInstruction = composition === 'group'
      ? '【多人物處理】：請對圖片中出現的所有主要人物進行換裝，確保風格統一。'
      : '【單人物聚焦】：僅將畫面中央的主要人物進行換裝，背景中的路人、其他人物或無關元素必須保持原樣，嚴禁修改。'

    const prompt = `請對這張圖片進行「大師級」人像換裝編輯，嚴格遵守以下指令：

    1. 【最高優先級 - 面部像素級鎖定】：
       - 嚴禁修改人物面部！這是絕對紅線。
       - 必須100%完美保留原圖五官（眉眼鼻嘴耳）、臉型輪廓、皮膚特徵（痣、皺紋、酒窩）、表情神態及視線方向。
       - 就像是把原圖的頭部直接「剪切粘貼」過來一樣，面部不得有任何重繪或變形。
       - 若原圖戴有眼鏡、口罩或特殊面部裝飾，必須原樣保留。

    2. 【構圖與骨架凍結】：
       - 嚴格鎖定原圖構圖，禁止裁剪、縮放、旋轉或改變視角。
       - 人物在畫面中的位置、大小、比例、肢體動作（手勢、站姿/坐姿）必須與原圖完全重疊。
       - ${compositionPrompt}
       - ${targetInstruction}

    3. 【精準服飾替換】：
       - 僅將人物穿著的現代服裝替換為【${dynasty}朝代】的【${gender === 'male' ? '男裝' : '女裝'}】。
       - 身份設定：【${role === 'emperor' ? '皇室成員' : role === 'official' ? '官員/貴族' : '平民'}】。
       - 服飾細節：${clothingDescription}
       - 衣領結構需自然貼合原圖人物頸部線條，袖口需配合原圖手部動作。

    4. 【材質與光影】：
       - 服飾材質需具備真實物理質感（絲綢的光澤、棉麻的紋理、刺繡的立體感）。
       - 光影渲染必須與原圖環境光線保持一致，確保換裝後的真實感，避免「貼圖感」。

    ${backgroundInstruction}

    6. 【輸出規格】：輸出 512x512 的超高清正方形圖像。`

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
