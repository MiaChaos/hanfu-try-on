
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

    const prompt = `請對這張圖片進行「大師級」人像換裝編輯：
    1. 【核心禁令 - 絕對保護面部】：嚴禁以任何形式修改照片中人物的面部特徵！必須完整保留原圖中的眼睛形狀、瞳孔、鼻子輪廓、嘴部特徵、臉型曲線、五官比例、表情神態、是否帶口罩以及所有身份特徵。人物的面部必須與原圖100%完全一致，如同照片本身。
    2. 【構圖與範圍】：
       - ${compositionPrompt}
       - 嚴格保持原圖的構圖比例和人物姿勢，不得裁剪或縮放。
    3. 【服飾更換】：僅將人物穿著的現代服裝更換為【${dynasty}朝代】的【${gender === 'male' ? '男裝' : '女裝'}】。身份設定為【${role === 'emperor' ? '皇室成員' : role === 'official' ? '官員/貴族' : '平民'}】。具體要求：${clothingDescription}
    4. 【藝術細節】：服飾面料應具有真實的絲綢或棉麻質感，刺繡紋樣需清晰細膩，符合歷史實物特徵。
    ${backgroundInstruction}
    6. 【規格要求】：輸出 512x512 的超高清正方形圖像，構圖比例保持人像居中。`

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
