
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
      '女性：齊胸襦裙、披帛，色彩絢爛（如石榴紅），髮髻高聳。',
      '男性：圓領袍、革帶、幞頭，風格健碩幹練。',
      '特點：用料考究，絲綢、錦緞廣泛應用，紋樣大氣。'
    ],
    promptTip: '唐代齊胸襦裙/圓領袍，石榴紅/金錦色，精美披帛/幞頭，髮髻金飾，寫實盛唐宮廷背景。'
  },
  {
    id: 'song',
    name: '風雅大宋',
    period: '公元960年－1279年',
    description: '宋代服飾趨向於清雅、自然、簡潔，體現了文人雅士的審美追求。',
    clothingFeatures: [
      '女性：褙子、百褶裙，色彩清新淡雅，剪裁合體。',
      '男性：襴衫、東坡巾，風格儒雅淡泊。',
      '特點：剪裁修長，注重細部修飾，優雅簡約。'
    ],
    promptTip: '宋代清雅褙子/寬袖襴衫，百褶裙/東坡巾，清新淡雅色調，寫實宋式簡約庭院。'
  },
  {
    id: 'ming',
    name: '大明風華',
    period: '公元1368年－1644年',
    description: '明代服飾上承周漢，下取唐宋，形成了一套嚴謹而華美的冠服制度。',
    clothingFeatures: [
      '女性：立領襖裙、織金馬面裙，莊重端莊。',
      '男性：交領道袍、網巾，領口挺括，氣宇軒昂。',
      '特點：織金工藝、補子裝飾，層次感與制度感極強。'
    ],
    promptTip: '明代立領襖裙/交領道袍，織金馬面裙/網巾，精湛刺繡紋樣，寫實明代古建築背景。'
  },
  {
    id: 'qing',
    name: '清宮舊夢',
    period: '公元1636年－1912年',
    description: '清代服飾展現了滿漢交融的獨特風格，旗服與馬褂成為時代的標誌。',
    clothingFeatures: [
      '女性：旗裝、旗頭、盤扣，剪裁筆直，刺繡繁縟。',
      '男性：長袍馬褂、立領、如意紋樣，辮髮風格。',
      '特點：盤扣、立領設計，裝飾極其華麗繁複。'
    ],
    promptTip: '清代華麗旗裝/長袍馬褂，旗頭/立領盤扣，如意刺繡紋樣，寫實清代宮廷紅牆背景。'
  }
]

const DynastyInfo: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-4 pb-32 overflow-y-auto">
      <div className="sticky top-0 z-50 bg-[#0f0f0f]/80 backdrop-blur-md py-4 px-2 mb-4 flex items-center gap-4 border-b border-white/5">
        <button 
          onClick={() => navigate('/')}
          className="p-3 rounded-full bg-white/10 hover:bg-primary hover:text-white transition-all active:scale-90"
          aria-label="返回"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-serif font-bold tracking-widest flex items-center gap-2">
          <BookOpen className="text-primary" size={20} /> 服飾百科
        </h1>
      </div>

      <div className="grid gap-6 max-w-2xl mx-auto">
        {DYNASTY_DETAILS.map((item) => (
          <div 
            key={item.id} 
            className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 shadow-2xl relative overflow-hidden"
          >
            {/* Subtle background glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />

            <div className="flex justify-between items-start mb-3 relative z-10">
              <div>
                <h2 className="text-lg font-serif font-bold text-primary mb-0.5">{item.name}</h2>
                <span className="text-[10px] text-white/30 font-mono tracking-tighter">{item.period}</span>
              </div>
              <div className="p-2 rounded-lg bg-primary/20 text-primary border border-primary/20">
                <Landmark size={18} />
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed mb-4 italic font-light border-l-2 border-primary/30 pl-3 py-1 bg-primary/[0.02]">
              「{item.description}」
            </p>

            <div className="space-y-3 mb-5 relative z-10">
              <h3 className="text-xs font-bold flex items-center gap-2 text-white/90">
                <User size={14} className="text-primary" /> 服飾特徵
              </h3>
              <ul className="grid gap-2">
                {item.clothingFeatures.map((feature, idx) => (
                  <li key={idx} className="text-[11px] text-white/50 flex items-start gap-2 leading-snug">
                    <div className="mt-1.5 w-1 h-1 rounded-full bg-primary/60 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 relative z-10">
              <h3 className="text-[10px] font-black flex items-center gap-2 text-primary mb-1.5 uppercase tracking-widest">
                <Sparkles size={12} /> AI 提示詞建議
              </h3>
              <p className="text-[11px] text-white/60 leading-normal font-mono bg-black/20 p-2 rounded border border-white/5">
                {item.promptTip}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-4 left-4 right-4 z-50">
        <div className="p-3 rounded-xl bg-primary/20 backdrop-blur-xl border border-primary/30 flex items-start gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <Info size={16} className="text-primary flex-shrink-0 mt-0.5" />
          <p className="text-[9px] text-white/70 leading-normal">
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
