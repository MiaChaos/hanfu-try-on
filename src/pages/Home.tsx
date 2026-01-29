
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera } from '../components/Camera'
import { useAppStore, type Gender, type Dynasty } from '../store'
import { RotateCcw, Sparkles, User, UserCheck, Landmark, BookOpen } from 'lucide-react'
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
    selectedGender, setGender 
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
      <div className="absolute top-0 right-0 z-30 p-4 text-right bg-gradient-to-l from-black/80 to-transparent">
        <h1 className="text-white text-xl font-serif font-bold tracking-widest drop-shadow-lg">
          中華穿越鏡
        </h1>
        <button 
          onClick={() => navigate('/info')}
          className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/30 backdrop-blur-xl text-primary text-[10px] font-black border border-primary/50 ml-auto hover:bg-primary hover:text-white transition-all active:scale-95 shadow-lg"
        >
          <BookOpen size={12} /> 服飾百科
        </button>
      </div>

      {/* Top Left Selection Panel */}
      {!previewUrl && (
        <div className="absolute top-4 left-4 z-50 flex flex-col gap-4 pointer-events-none">
          {/* Gender Select */}
          <div className="flex flex-col gap-1.5 pointer-events-auto">
            <span className="text-white/50 text-[9px] font-black ml-1 flex items-center gap-1 uppercase tracking-[0.2em]">
              <User size={10} /> 性別
            </span>
            <div className="flex gap-1.5">
              {(['female', 'male'] as Gender[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={clsx(
                    "px-3 py-1 rounded-lg text-[10px] font-black transition-all border backdrop-blur-xl",
                    selectedGender === g 
                      ? "bg-primary text-white border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)]" 
                      : "bg-black/60 text-white/50 border-white/5 hover:border-white/20"
                  )}
                >
                  {g === 'female' ? '女性' : '男性'}
                </button>
              ))}
            </div>
          </div>

          {/* Dynasty Select */}
          <div className="flex flex-col gap-1.5 pointer-events-auto">
            <span className="text-white/50 text-[9px] font-black ml-1 flex items-center gap-1 uppercase tracking-[0.2em]">
              <Landmark size={10} /> 朝代
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {DYNASTIES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDynasty(d.id)}
                  className={clsx(
                    "px-3 py-1 rounded-lg text-[10px] font-black transition-all border backdrop-blur-xl text-center",
                    selectedDynasty === d.id 
                      ? "bg-primary text-white border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)]" 
                      : "bg-black/60 text-white/50 border-white/5 hover:border-white/20"
                  )}
                >
                  {d.name}
                </button>
              ))}
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
            <div className="w-full h-full max-h-[85vh] relative overflow-hidden flex items-center justify-center">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Overlay Actions - Centered at the bottom */}
            <div className="absolute bottom-12 left-0 right-0 z-50 flex justify-center items-center gap-6 px-4">
              <button 
                onClick={handleRetake}
                className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-black/80 backdrop-blur-2xl text-white hover:bg-black transition-all font-black border border-white/10 shadow-2xl active:scale-90"
              >
                <RotateCcw size={18} />
                重拍
              </button>
              
              <button 
                onClick={handleGenerate}
                className="flex items-center gap-3 px-10 py-3.5 rounded-full bg-primary text-white shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:scale-105 active:scale-95 transition-all font-black text-lg border-2 border-white/20"
              >
                <Sparkles size={22} />
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
