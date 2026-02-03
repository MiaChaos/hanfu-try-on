
import fs from 'fs'

const API_URL = 'https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation'

const DYNASTY_PROMPTS: Record<string, Record<string, { male: { upper: string; full: string }; female: { upper: string; full: string } }>> = {
  tang: {
    commoner: {
      female: {
        full: '唐代女性平民服飾：身穿樸素的齊胸襦裙，面料為棉麻質感，色彩低調（如淡青、淺褐），無華麗刺繡。髮髻簡單，僅用木釵或布帶裝飾。展現市井勞作女性的樸實自然。',
        upper: '唐代女性平民服飾（半身）：重點展示樸素的襦裙上裝，面料粗糙，無多餘裝飾。髮髻簡單，僅用木釵或布帶。展現市井勞作女性的樸實自然。'
      },
      male: {
        full: '唐代男性平民服飾：身穿粗布裋褐（短衣長褲），腰繫草繩或布帶，褲腳紮緊。頭裹黑色頭巾。面料粗糙，便於勞作。展現底層勞動者的艱辛與樸實。',
        upper: '唐代男性平民服飾（半身）：身穿粗布裋褐上裝，領口寬鬆。頭裹黑色頭巾。面料粗糙，展現底層勞動者的艱辛與樸實。'
      }
    },
    official: {
      female: {
        full: '唐代誥命夫人華服：身穿極其華麗的寬袖大衫，內搭繡花訶子裙，肩披印金披帛。色彩豔麗（牡丹紅、寶藍），遍佈精美刺繡。頭戴金絲鳳冠，滿頭珠翠步搖。盡顯權貴階層的奢靡與雍容。',
        upper: '唐代誥命夫人華服（半身）：身穿極其華麗的寬袖大衫上裝，領口袖口滿繡金線。頭戴金絲鳳冠，滿頭珠翠步搖。盡顯權貴階層的奢靡與雍容。'
      },
      male: {
        full: '唐代高官朝服：身穿紫色圓領袍（三品以上），腰繫金玉帶，手持笏板。頭戴硬腳幞頭，腳穿烏皮靴。布料為頂級綾羅，暗紋流光溢彩。氣場威嚴，展現大唐宰相級別的權勢。',
        upper: '唐代高官朝服（半身）：身穿紫色圓領袍上裝，面料光澤感極強。頭戴硬腳幞頭。氣場威嚴，展現大唐宰相級別的權勢。'
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
        full: '宋代女性平民服飾：身穿窄袖對襟褙子，內搭抹胸，下著素色百褶裙。面料為普通棉布，色彩清淡（灰白、淺藍）。整體風格簡潔收斂，無珠寶裝飾，體現市井生活的清貧。',
        upper: '宋代女性平民服飾（半身）：身穿窄袖對襟褙子，內搭抹胸。面料為普通棉布，色彩清淡。整體風格簡潔收斂，無珠寶裝飾，體現市井生活的清貧。'
      },
      male: {
        full: '宋代男性平民服飾：身穿短褐，下著寬褲，腳穿草鞋或布鞋。頭戴簡單方巾。面料為粗麻，色彩灰暗。展現宋代普通百姓的勞作形象。',
        upper: '宋代男性平民服飾（半身）：身穿短褐上裝，領口簡單。頭戴簡單方巾。面料為粗麻，色彩灰暗。展現宋代普通百姓的勞作形象。'
      }
    },
    official: {
      female: {
        full: '宋代命婦盛裝：身穿朱紅色大袖衫，肩披霞帔（飾有金墜子），下著繡花羅裙。頭戴高聳的鳳冠，插滿珍珠寶石。面料絲滑，刺繡精細，盡顯宋代貴婦的端莊與富貴。',
        upper: '宋代命婦盛裝（半身）：身穿朱紅色大袖衫上裝，肩披霞帔（飾有金墜子）。頭戴高聳的鳳冠，插滿珍珠寶石。盡顯宋代貴婦的端莊與富貴。'
      },
      male: {
        full: '宋代高官公服：身穿緋色寬袖圓領袍，領口佩戴白羅方心曲領（上圓下方）。頭戴極長的展角幞頭，腰繫金帶。氣質儒雅而威嚴，體現宋代士大夫的崇高地位。',
        upper: '宋代高官公服（半身）：身穿緋色寬袖圓領袍上裝，領口佩戴白羅方心曲領。頭戴極長的展角幞頭。氣質儒雅而威嚴，體現宋代士大夫的崇高地位。'
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
        full: '明代女性平民服飾：身穿青布比甲或窄袖襖，下著素裙。面料為棉布，無織金或繡花。髮髻低挽，僅插銀簪或木梳。展現明代市井婦女的勤儉持家。',
        upper: '明代女性平民服飾（半身）：身穿青布比甲或窄袖襖上裝。面料為棉布，無織金或繡花。髮髻低挽，僅插銀簪或木梳。展現明代市井婦女的勤儉持家。'
      },
      male: {
        full: '明代男性平民服飾：身穿短衣小帽，或青布直身。腰繫布帶。腳穿布鞋。面料樸素，色彩單一（藍、灰）。展現明代普通市民的生活常態。',
        upper: '明代男性平民服飾（半身）：身穿短衣小帽，或青布直身上裝。面料樸素，色彩單一。展現明代普通市民的生活常態。'
      }
    },
    official: {
      female: {
        full: '明代一品誥命大衫霞帔：身穿真紅色大袖衫，深青色霞帔（飾有金繡雲鳳）。頭戴翠冠，飾有金翟。面料為織金妝花緞，光彩奪目，盡顯大明貴婦的顯赫地位。',
        upper: '明代一品誥命大衫霞帔（半身）：身穿真紅色大袖衫上裝，深青色霞帔（飾有金繡雲鳳）。頭戴翠冠，飾有金翟。面料為織金妝花緞，光彩奪目。'
      },
      male: {
        full: '明代一品文官補服：身穿緋色盤領袍，胸前繡有「仙鶴」補子（象徵一品）。頭戴烏紗帽，腰繫玉帶。面料華貴，氣度不凡，展現大明重臣的威儀。',
        upper: '明代一品文官補服（半身）：身穿緋色盤領袍上裝，胸前繡有「仙鶴」補子。頭戴烏紗帽。面料華貴，氣度不凡，展現大明重臣的威儀。'
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
        full: '清代漢族平民女性：身穿青布大襟衫，下著寬腳褲或布裙。袖口無花邊或僅有簡單滾邊。髮髻簡單，插銅簪。面料為土布，展現晚清農村婦女的質樸。',
        upper: '清代漢族平民女性（半身）：身穿青布大襟衫上裝，領口簡單。髮髻簡單，插銅簪。面料為土布，展現晚清農村婦女的質樸。'
      },
      male: {
        full: '清代男性苦力服飾：身穿對襟短褂，下著寬鬆褲子，腰繫汗巾。頭戴草帽或裹頭巾，腦後留辮。赤腳或穿草鞋。皮膚黝黑，展現底層勞動者的滄桑。',
        upper: '清代男性苦力服飾（半身）：身穿對襟短褂上裝，敞開領口。頭戴草帽或裹頭巾，腦後留辮。皮膚黝黑，展現底層勞動者的滄桑。'
      }
    },
    official: {
      female: {
        full: '清代滿族貴婦盛裝：身穿明黃或寶藍色旗裝，全身滿繡牡丹蝴蝶，鑲滾多層花邊。頭戴巨大的大拉翅，飾滿點翠與絹花。腳穿花盆底鞋。手持手絹，盡顯八旗貴族的奢華與傲慢。',
        upper: '清代滿族貴婦盛裝（半身）：身穿明黃或寶藍色旗裝上裝，全身滿繡。頭戴巨大的大拉翅，飾滿點翠與絹花。手持手絹，盡顯八旗貴族的奢華與傲慢。'
      },
      male: {
        full: '清代一品大員朝服：身穿石青色補褂，胸前繡有「仙鶴」補子。掛有一串朝珠。頭戴紅纓頂戴花翎（雙眼花翎）。內穿蟒袍，下擺海水江崖紋清晰。展現大清疆臣的顯赫權勢。',
        upper: '清代一品大員朝服（半身）：身穿石青色補褂上裝，胸前繡有「仙鶴」補子。掛有一串朝珠。頭戴紅纓頂戴花翎。展現大清疆臣的顯赫權勢。'
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
      ? '4. 【環境保留】：必須完整保留原圖中的背景環境、光影氛圍和所有背景細節，不得進行任何修改。'
      : `4. 【環境融合】：將背景調整為適配該朝代風格的【寫實古風場景】（如古建築、中式園林、宮廷內部等）。人物與背景的光影、色調必須融合自然，如同在實景中拍攝。`

    // Determine target instruction based on composition
    const targetInstruction = composition === 'group'
      ? '【多人物處理】：請對圖片中出現的所有主要人物進行換裝，確保風格統一。'
      : '【單人物聚焦】：僅將畫面中央的主要人物進行換裝，背景中的路人、其他人物或無關元素必須保持原樣，嚴禁修改。'

    // Build color prompt
    let colorPrompt = ''
    if (colors) {
      const parts = []
      if (colors.top && colors.top !== 'default') parts.push(`上裝主色調必須為【${COLOR_MAP[colors.top] || colors.top}】`)
      
      // Constraint: Pants color prompt should NOT appear in "upper_body" or "selfie" composition modes
      const showBottomColor = composition !== 'upper_body' && composition !== 'selfie'
      if (showBottomColor && colors.bottom && colors.bottom !== 'default') parts.push(`下裝主色調必須為【${COLOR_MAP[colors.bottom] || colors.bottom}】`)
      
      if (colors.accessory && colors.accessory !== 'default') parts.push(`配飾（如腰帶、披帛、首飾）點綴【${COLOR_MAP[colors.accessory] || colors.accessory}】`)
      
      if (parts.length > 0) {
        colorPrompt = `5. 【強制配色指令】：
       - 嚴格執行以下色彩要求，權重高於朝代默認配色：
       - ${parts.join('。\n       - ')}。
       - 確保服飾的主色調（佔比超過70%）符合上述指定顏色，嚴禁使用其他衝突色系。`
      }
    }

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

    ${colorPrompt}

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
