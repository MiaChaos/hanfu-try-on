
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera } from '../components/Camera'
import { EventHeader } from '../components/EventHeader'
import { useAppStore, type Gender, type Dynasty } from '../store'
import { RotateCcw, Sparkles, User, UserCheck, Landmark, BookOpen, Image as ImageIcon, ImageOff } from 'lucide-react'
import { clsx } from 'clsx'

const DYNASTIES: { id: Dynasty; name: string }[] = [
  { id: 'tang', name: '大唐' },
  { id: 'song', name: '大宋' },
  { id: 'ming', name: '大明' },
  { id: 'qing', name: '大清' },
]

const Home: React.FC = () => {
  const { 
    previewUrl, setPreviewUrl, setImage, 
    selectedDynasty, setDynasty, 
    selectedGender, setGender,
    keepBackground, setKeepBackground
  } = useAppStore()
  const navigate = useNavigate()

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
      {/* Header - Right Aligned */}
      <EventHeader />

      {/* Top Left Selection Panel */}
      {!previewUrl && (
        <div className="absolute top-6 left-6 z-50 flex flex-col gap-8 pointer-events-none">
          {/* Gender Select */}
          <div className="flex flex-col gap-3 pointer-events-auto">
            <span className="text-white/50 text-[10px] font-black ml-1 flex items-center gap-2 uppercase tracking-[0.25em]">
              <User size={12} /> 性別
            </span>
            <div className="flex gap-3">
              {(['female', 'male'] as Gender[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={clsx(
                    "px-5 py-2.5 rounded-xl text-xs font-black transition-all border-2 backdrop-blur-2xl",
                    selectedGender === g 
                      ? "bg-primary text-white border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] scale-105" 
                      : "bg-black/60 text-white/40 border-white/5 hover:border-white/20"
                  )}
                >
                  {g === 'female' ? '女性服飾' : '男性服飾'}
                </button>
              ))}
            </div>
          </div>

          {/* Dynasty Select */}
          <div className="flex flex-col gap-3 pointer-events-auto">
            <span className="text-white/50 text-[10px] font-black ml-1 flex items-center gap-2 uppercase tracking-[0.25em]">
              <Landmark size={12} /> 朝代
            </span>
            <div className="grid grid-cols-2 gap-3">
              {DYNASTIES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDynasty(d.id)}
                  className={clsx(
                    "px-5 py-2.5 rounded-xl text-xs font-black transition-all border-2 backdrop-blur-2xl text-center",
                    selectedDynasty === d.id 
                      ? "bg-primary text-white border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] scale-105" 
                      : "bg-black/60 text-white/40 border-white/5 hover:border-white/20"
                  )}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>

          {/* Background Toggle */}
          <div className="flex flex-col gap-3 pointer-events-auto">
            <span className="text-white/50 text-[10px] font-black ml-1 flex items-center gap-2 uppercase tracking-[0.25em]">
              <ImageIcon size={12} /> 背景設定
            </span>
            <button
              onClick={() => setKeepBackground(!keepBackground)}
              className={clsx(
                "flex items-center gap-3 px-5 py-2.5 rounded-xl text-xs font-black transition-all border-2 backdrop-blur-2xl w-fit",
                !keepBackground 
                  ? "bg-primary/20 text-primary border-primary/40 shadow-lg" 
                  : "bg-yellow-500/20 text-yellow-500 border-yellow-500/40 shadow-lg"
              )}
            >
              {!keepBackground ? <ImageIcon size={16} /> : <ImageOff size={16} />}
              {!keepBackground ? '更換歷史背景' : '保留拍攝背景'}
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
