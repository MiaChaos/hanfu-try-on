
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera } from '../components/Camera'
import { EventHeader } from '../components/EventHeader'
import { useAppStore, type Gender, type Dynasty, type Role, type Composition } from '../store'
import { RotateCcw, Sparkles, User, Landmark, Image as ImageIcon, ImageOff, Crown, Menu, X, ScanFace, Users, PersonStanding } from 'lucide-react'
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

const Home: React.FC = () => {
  const { 
    previewUrl, setPreviewUrl, setImage, 
    selectedDynasty, setDynasty, 
    selectedGender, setGender,
    selectedRole, setRole,
    selectedComposition, setComposition,
    keepBackground, setKeepBackground
  } = useAppStore()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(true)

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
            "absolute top-20 left-6 z-50 flex flex-col gap-6 transition-all duration-300 origin-top-left",
            isMenuOpen ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-90 -translate-y-4 pointer-events-none"
          )}
        >
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
