
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
    <div className="flex flex-col h-screen bg-background relative">
      {/* Header - Right Aligned */}
      <div className="absolute top-0 right-0 z-30 p-4 text-right bg-gradient-to-l from-black/50 to-transparent">
        <h1 className="text-white text-xl font-serif font-bold tracking-widest drop-shadow-lg">
          中華穿越鏡
        </h1>
        <button 
          onClick={() => navigate('/info')}
          className="mt-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md text-primary text-[10px] font-bold border border-primary/30 ml-auto"
        >
          <BookOpen size={12} /> 服飾百科
        </button>
      </div>

      {/* Top Left Selection Panel */}
      {!previewUrl && (
        <div className="absolute top-4 left-4 z-50 flex flex-col gap-6 pointer-events-none">
          {/* Gender Select */}
          <div className="flex flex-col gap-2 pointer-events-auto">
            <span className="text-white/60 text-[10px] font-bold ml-1 flex items-center gap-1 uppercase tracking-wider">
              <User size={10} /> 性別
            </span>
            <div className="flex gap-2">
              {(['female', 'male'] as Gender[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={clsx(
                    "px-4 py-1.5 rounded-md text-xs font-bold transition-all border backdrop-blur-md",
                    selectedGender === g 
                      ? "bg-primary text-white border-primary shadow-lg" 
                      : "bg-black/40 text-white/70 border-white/10 hover:bg-black/60"
                  )}
                >
                  {g === 'female' ? '女性' : '男性'}
                </button>
              ))}
            </div>
          </div>

          {/* Dynasty Select */}
          <div className="flex flex-col gap-2 pointer-events-auto">
            <span className="text-white/60 text-[10px] font-bold ml-1 flex items-center gap-1 uppercase tracking-wider">
              <Landmark size={10} /> 朝代
            </span>
            <div className="grid grid-cols-2 gap-2">
              {DYNASTIES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDynasty(d.id)}
                  className={clsx(
                    "px-4 py-1.5 rounded-md text-xs font-bold transition-all border backdrop-blur-md text-center",
                    selectedDynasty === d.id 
                      ? "bg-primary text-white border-primary shadow-lg" 
                      : "bg-black/40 text-white/70 border-white/10 hover:bg-black/60"
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
      <div className="flex-1 relative">
        {!previewUrl ? (
          <Camera />
        ) : (
          <div className="relative w-full h-full flex flex-col">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            
            {/* Overlay Actions - Centered at the bottom */}
            <div className="absolute bottom-20 left-0 right-0 z-50 flex justify-center items-center gap-6 px-4">
              <button 
                onClick={handleRetake}
                className="flex items-center gap-2 px-6 py-4 rounded-full bg-black/60 backdrop-blur-xl text-white hover:bg-black/80 transition-all font-bold border border-white/20 shadow-2xl"
              >
                <RotateCcw size={20} />
                重拍
              </button>
              
              <button 
                onClick={handleGenerate}
                className="flex items-center gap-3 px-10 py-4 rounded-full bg-primary text-white shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)] hover:scale-105 active:scale-95 transition-all font-black text-xl border-2 border-white/20"
              >
                <Sparkles size={24} />
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
