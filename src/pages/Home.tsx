
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera } from '../components/Camera'
import { EventHeader } from '../components/EventHeader'
import { useAppStore, type Gender, type Dynasty, type Role, type Composition } from '../store'
import { RotateCcw, Sparkles, User, Landmark, Image as ImageIcon, ImageOff, Crown, Menu, X, ScanFace, Users, PersonStanding, Palette, ChevronRight } from 'lucide-react'
import { clsx } from 'clsx'

const COMPOSITIONS: { id: Composition; name: string; icon: React.FC<any> }[] = [
  { id: 'selfie', name: '自拍', icon: ScanFace },
  { id: 'upper_body', name: '半身', icon: User },
  { id: 'full_body', name: '全身', icon: PersonStanding },
  { id: 'group', name: '多人', icon: Users },
]

const DYNASTIES: { id: Dynasty; name: string }[] = [
  { id: 'tang', name: '大唐' },
  { id: 'song', name: '大宋' },
  { id: 'ming', name: '大明' },
  { id: 'qing', name: '大清' },
]

const ROLES: { id: Role; name: string }[] = [
  { id: 'commoner', name: '平民' },
  { id: 'official', name: '官員' },
  { id: 'emperor', name: '皇室' },
]

const COLORS = [
  { id: 'default', name: '默認', hex: 'transparent', border: 'border-white/20' },
  { id: 'red', name: '朱紅', hex: '#E53E3E', border: 'border-red-500/50' },
  { id: 'blue', name: '靛藍', hex: '#3182CE', border: 'border-blue-500/50' },
  { id: 'green', name: '青綠', hex: '#38A169', border: 'border-green-500/50' },
  { id: 'white', name: '月白', hex: '#F7FAFC', border: 'border-white/50' },
  { id: 'black', name: '玄黑', hex: '#1A202C', border: 'border-gray-500/50' },
  { id: 'gold', name: '金黃', hex: '#D69E2E', border: 'border-yellow-500/50' },
  { id: 'purple', name: '紫棠', hex: '#805AD5', border: 'border-purple-500/50' },
  { id: 'pink', name: '桃粉', hex: '#D53F8C', border: 'border-pink-500/50' },
]

const Home: React.FC = () => {
  const { 
    previewUrl, setPreviewUrl, setImage, 
    selectedDynasty, setDynasty, 
    selectedGender, setGender,
    selectedRole, setRole,
    selectedComposition, setComposition,
    selectedColors, setColors,
    keepBackground, setKeepBackground
  } = useAppStore()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(true)
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false)

  useEffect(() => {
    // Connection test
    fetch('/api/health')
      .then(res => res.json())
      .then(data => console.log('[DEBUG] API Connection successful:', data))
      .catch(err => console.error('[DEBUG] API Connection failed:', err))
  }, [])

  const handleRetake = () => {
    setPreviewUrl(null)
    setImage(null)
  }

  const handleGenerate = () => {
    navigate('/generate')
  }

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Header - Right Aligned (Event Info) */}
      <EventHeader />

      {/* Mobile Menu Toggle Button (Visible when menu is closed or on mobile) */}
      {!previewUrl && (
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="absolute top-6 left-6 z-[60] p-3 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10 shadow-xl hover:bg-primary transition-all active:scale-95"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* Top Left Selection Panel (Collapsible) */}
      {!previewUrl && (
        <div 
          className={clsx(
            "absolute top-20 left-6 z-50 origin-top-left max-h-[calc(100dvh-120px)] w-64 overflow-y-auto overscroll-y-none scrollbar-left",
            isMenuOpen ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-90 -translate-y-4 pointer-events-none"
          )}
          style={{ 
            transition: 'opacity 300ms ease, transform 300ms ease'
          }}
        >
          <div className="flex flex-col gap-6 pl-3 pr-1 pb-24 touch-none">
            {/* Gender Select */}
            <div className="flex flex-col gap-2">
              <span className="text-white/50 text-[10px] font-black ml-1 flex items-center gap-2 uppercase tracking-[0.25em]">
                <User size={12} /> 性別
              </span>
              <div className="flex gap-2">
                {(['female', 'male'] as Gender[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={clsx(
                      "px-4 py-2 rounded-lg text-xs font-bold transition-all border backdrop-blur-xl",
                      selectedGender === g 
                        ? "bg-primary/90 text-white border-primary shadow-lg scale-105" 
                        : "bg-black/40 text-white/60 border-white/10 hover:bg-white/10"
                    )}
                  >
                    {g === 'female' ? '女性' : '男性'}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynasty Select */}
            <div className="flex flex-col gap-2">
              <span className="text-white/50 text-[10px] font-black ml-1 flex items-center gap-2 uppercase tracking-[0.25em]">
                <Landmark size={12} /> 朝代
              </span>
              <div className="grid grid-cols-2 gap-2">
                {DYNASTIES.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDynasty(d.id)}
                    className={clsx(
                      "px-4 py-2 rounded-lg text-xs font-bold transition-all border backdrop-blur-xl text-center",
                      selectedDynasty === d.id 
                        ? "bg-primary/90 text-white border-primary shadow-lg scale-105" 
                        : "bg-black/40 text-white/60 border-white/10 hover:bg-white/10"
                    )}
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Role Select */}
            <div className="flex flex-col gap-2">
              <span className="text-white/50 text-[10px] font-black ml-1 flex items-center gap-2 uppercase tracking-[0.25em]">
                <Crown size={12} /> 身份
              </span>
              <div className="flex gap-2 flex-wrap max-w-[200px]">
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={clsx(
                      "px-3 py-2 rounded-lg text-xs font-bold transition-all border backdrop-blur-xl",
                      selectedRole === r.id 
                        ? "bg-primary/90 text-white border-primary shadow-lg scale-105" 
                        : "bg-black/40 text-white/60 border-white/10 hover:bg-white/10"
                    )}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Composition Select */}
            <div className="flex flex-col gap-2">
              <span className="text-white/50 text-[10px] font-black ml-1 flex items-center gap-2 uppercase tracking-[0.25em]">
                <ScanFace size={12} /> 構圖
              </span>
              <div className="grid grid-cols-2 gap-2">
                {COMPOSITIONS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setComposition(c.id)}
                    className={clsx(
                      "flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all border backdrop-blur-xl",
                      selectedComposition === c.id 
                        ? "bg-primary/90 text-white border-primary shadow-lg scale-105" 
                        : "bg-black/40 text-white/60 border-white/10 hover:bg-white/10"
                    )}
                  >
                    <c.icon size={14} />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Scheme Select (Collapsible) */}
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setIsColorMenuOpen(!isColorMenuOpen)}
                className={clsx(
                  "flex items-center gap-2 text-white/50 text-[10px] font-black ml-1 uppercase tracking-[0.25em] w-fit hover:text-white transition-colors",
                  isColorMenuOpen && "text-white"
                )}
              >
                <Palette size={12} /> 配色
                <ChevronRight size={12} className={clsx("transition-transform duration-300", isColorMenuOpen && "rotate-90")} />
              </button>
              
              <div className={clsx(
                "flex flex-col gap-3 transition-all duration-300 overflow-hidden pl-2 border-l border-white/5 ml-1",
                isColorMenuOpen ? "max-h-[500px] opacity-100 mt-1 pb-1" : "max-h-0 opacity-0"
              )}>
                {/* Top Color */}
                <div className="space-y-1">
                  <span className="text-[10px] text-white/40 ml-1">上裝</span>
                  <div className="flex gap-1.5 flex-wrap max-w-[200px]">
                    {COLORS.map((c) => (
                      <button
                        key={`top-${c.id}`}
                        onClick={() => setColors({ top: c.id })}
                        className={clsx(
                          "w-6 h-6 rounded-full border transition-all relative group",
                          c.border,
                          selectedColors.top === c.id ? "scale-125 ring-2 ring-white/50" : "hover:scale-110 opacity-70 hover:opacity-100"
                        )}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      >
                         {c.id === 'default' && <div className="absolute inset-0 m-auto w-3 h-0.5 bg-white/30 rotate-45" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bottom Color - Hide for upper_body/selfie */}
                {selectedComposition !== 'upper_body' && selectedComposition !== 'selfie' && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-white/40 ml-1">下裝</span>
                    <div className="flex gap-1.5 flex-wrap max-w-[200px]">
                      {COLORS.map((c) => (
                        <button
                          key={`bottom-${c.id}`}
                          onClick={() => setColors({ bottom: c.id })}
                          className={clsx(
                            "w-6 h-6 rounded-full border transition-all relative group",
                            c.border,
                            selectedColors.bottom === c.id ? "scale-125 ring-2 ring-white/50" : "hover:scale-110 opacity-70 hover:opacity-100"
                          )}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        >
                          {c.id === 'default' && <div className="absolute inset-0 m-auto w-3 h-0.5 bg-white/30 rotate-45" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Accessory Color */}
                <div className="space-y-1">
                  <span className="text-[10px] text-white/40 ml-1">配飾</span>
                  <div className="flex gap-1.5 flex-wrap max-w-[200px]">
                    {COLORS.map((c) => (
                      <button
                        key={`acc-${c.id}`}
                        onClick={() => setColors({ accessory: c.id })}
                        className={clsx(
                          "w-6 h-6 rounded-full border transition-all relative group",
                          c.border,
                          selectedColors.accessory === c.id ? "scale-125 ring-2 ring-white/50" : "hover:scale-110 opacity-70 hover:opacity-100"
                        )}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      >
                        {c.id === 'default' && <div className="absolute inset-0 m-auto w-3 h-0.5 bg-white/30 rotate-45" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Background Toggle */}
            <div className="flex flex-col gap-2">
              <span className="text-white/50 text-[10px] font-black ml-1 flex items-center gap-2 uppercase tracking-[0.25em]">
                <ImageIcon size={12} /> 背景
              </span>
              <button
                onClick={() => setKeepBackground(!keepBackground)}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all border backdrop-blur-xl w-fit",
                  !keepBackground 
                    ? "bg-primary/20 text-primary border-primary/40" 
                    : "bg-yellow-500/20 text-yellow-500 border-yellow-500/40"
                )}
              >
                {!keepBackground ? <ImageIcon size={14} /> : <ImageOff size={14} />}
                {!keepBackground ? '更換背景' : '保留背景'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-center">
        {!previewUrl ? (
          <div className="w-full h-full">
            <Camera />
          </div>
        ) : (
          <div className="w-full h-full relative flex flex-col items-center justify-center bg-black">
            <div className="w-full h-full max-h-[80vh] relative overflow-hidden flex items-center justify-center p-4">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-full object-contain rounded-2xl border-4 border-white/10 shadow-2xl"
              />
            </div>
            
            {/* Overlay Actions - Centered at the bottom */}
            <div className="absolute bottom-12 left-0 right-0 z-50 flex justify-center items-center gap-8 px-6">
              <button 
                onClick={handleRetake}
                className="flex items-center gap-3 px-8 py-5 rounded-full bg-black/80 backdrop-blur-3xl text-white hover:bg-black transition-all font-black border-2 border-white/10 shadow-2xl active:scale-90"
              >
                <RotateCcw size={22} />
                重拍
              </button>
              
              <button 
                onClick={handleGenerate}
                className="flex items-center gap-4 px-12 py-5 rounded-full bg-primary text-white shadow-[0_15px_40px_rgba(0,0,0,0.6)] hover:scale-105 active:scale-95 transition-all font-black text-xl border-2 border-white/20"
              >
                <Sparkles size={26} />
                開始穿越
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
