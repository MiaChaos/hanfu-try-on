
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, BookOpen, Sparkles, User, Info } from 'lucide-react'

interface DynastyDetail {
  id: string
  name: string
  period: string
  description: string
  clothingFeatures: string[]
  promptTip: string
}

const DYNASTY_DETAILS: DynastyDetail[] = [
  {
    id: 'tang',
    name: '大唐盛世',
    period: '公元618年－907年',
    description: '唐代服飾以其博大、華貴、豐滿而著稱，展現了開明開放的時代精神。',
    clothingFeatures: [
      '女性：襦裙、披帛，高腰或齊胸設計，色彩絢爛（如石榴紅）。',
      '男性：圓領袍、幞頭，風格健碩幹練。',
      '特點：用料考究，絲綢、錦緞廣泛應用，紋樣大氣。'
    ],
    promptTip: '強調「華麗圓領袍」、「高腰齊胸襦裙」、「披帛」及「盛唐宮廷背景」。'
  },
  {
    id: 'song',
    name: '風雅大宋',
    period: '公元960年－1279年',
    description: '宋代服飾趨向於清雅、自然、簡潔，體現了文人雅士的審美追求。',
    clothingFeatures: [
      '女性：褙子、百褶裙，色彩清新淡雅。',
      '男性：襴衫、東坡巾，展現儒雅之氣。',
      '特點：剪裁合體，注重細部修飾，給人以修長輕便之感。'
    ],
    promptTip: '強調「清雅褙子」、「百褶裙」、「襴衫」及「宋式簡約庭院背景」。'
  },
  {
    id: 'ming',
    name: '大明風華',
    period: '公元1368年－1644年',
    description: '明代服飾上承周漢，下取唐宋，形成了一套嚴謹而華美的冠服制度。',
    clothingFeatures: [
      '女性：襖裙、馬面裙，上襖下裙，莊重端莊。',
      '男性：道袍、直身，搭配網巾，氣宇軒昂。',
      '特點：織金工藝、補子裝飾，層次感強。'
    ],
    promptTip: '強調「織金馬面裙」、「立領襖裙」、「道袍」及「明代古建築背景」。'
  },
  {
    id: 'qing',
    name: '清宮舊夢',
    period: '公元1636年－1912年',
    description: '清代服飾展現了滿漢交融的獨特風格，旗服與馬褂成為時代的標誌。',
    clothingFeatures: [
      '女性：旗裝、花盆底鞋、旗頭，剪裁筆直。',
      '男性：長袍馬褂、瓜皮帽，辮髮風格。',
      '特點：刺繡繁縟，立領、盤扣設計，裝飾極其華麗。'
    ],
    promptTip: '強調「華麗旗裝」、「盤扣」、「馬褂」及「清代宮廷紅牆背景」。'
  }
]

const DynastyInfo: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background text-white p-6 pb-20">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-serif font-bold tracking-widest flex items-center gap-2">
          <BookOpen className="text-primary" /> 朝代服飾百科
        </h1>
      </div>

      <div className="grid gap-8">
        {DYNASTY_DETAILS.map((item) => (
          <div 
            key={item.id} 
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-primary mb-1">{item.name}</h2>
                <span className="text-xs text-white/40 font-mono">{item.period}</span>
              </div>
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Landmark size={20} />
              </div>
            </div>

            <p className="text-sm text-white/80 leading-relaxed mb-6 italic">
              「{item.description}」
            </p>

            <div className="space-y-4 mb-6">
              <h3 className="text-sm font-bold flex items-center gap-2 text-white/90">
                <User size={16} className="text-primary" /> 服飾特徵
              </h3>
              <ul className="grid gap-2">
                {item.clothingFeatures.map((feature, idx) => (
                  <li key={idx} className="text-xs text-white/60 flex items-start gap-2">
                    <div className="mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <h3 className="text-xs font-bold flex items-center gap-2 text-primary mb-2 uppercase tracking-wider">
                <Sparkles size={14} /> AI 提示詞建議
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                {item.promptTip}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-6 left-6 right-6">
        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-start gap-3">
          <Info size={18} className="text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-yellow-500/80 leading-normal">
            <strong>核心提示：</strong>系統在生成時已強制加入「面部保護」算法，確保穿越後的您五官特徵保持原樣，僅更換服飾。
          </p>
        </div>
      </div>
    </div>
  )
}

const Landmark = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="2" y1="22" x2="22" y2="22"></line>
    <line x1="12" y1="2" x2="12" y2="18"></line>
    <path d="M12 2l-7 7h14l-7-7z"></path>
    <path d="M7 22V9h10v13"></path>
  </svg>
)

export default DynastyInfo
