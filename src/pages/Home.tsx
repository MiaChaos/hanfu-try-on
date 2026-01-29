
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera } from '../components/Camera'
import { DynastySelector } from '../components/DynastySelector'
import { useAppStore, type Gender } from '../store'
import { RotateCcw, Sparkles, User, UserCheck } from 'lucide-react'
import { clsx } from 'clsx'

const Home: React.FC = () => {
  const { previewUrl, setPreviewUrl, setImage, selectedDynasty, selectedGender, setGender } = useAppStore()
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
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4 text-center bg-gradient-to-b from-black/50 to-transparent">
        <h1 className="text-white text-2xl font-serif font-bold tracking-widest drop-shadow-lg">
          中華穿越鏡
        </h1>
        <p className="text-white/80 text-xs mt-1 font-sans">
          選擇朝代 · 拍攝照片 · 穿越歷史
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative">
        {!previewUrl ? (
          <Camera />
        ) : (
          <div className="relative w-full h-full">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            
            {/* Overlay Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-center gap-8 bg-gradient-to-t from-black/80 to-transparent pt-20">
              <button 
                onClick={handleRetake}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-all font-medium"
              >
                <RotateCcw size={20} />
                重拍
              </button>
              
              <button 
                onClick={handleGenerate}
                className="flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-white shadow-lg shadow-primary/30 hover:scale-105 transition-all font-bold text-lg"
              >
                <Sparkles size={20} />
                開始穿越
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Gender & Dynasty Selector - Only show in Camera mode */}
      {!previewUrl && (
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-20 pb-4 pointer-events-none">
          <div className="pointer-events-auto flex flex-col gap-4">
            {/* Gender Selection */}
            <div className="flex justify-center gap-4 px-4">
              {(['female', 'male'] as Gender[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={clsx(
                    "flex items-center gap-2 px-6 py-2 rounded-full transition-all border",
                    selectedGender === g 
                      ? "bg-primary text-white border-primary shadow-lg scale-105" 
                      : "bg-black/40 text-white/70 border-white/20 backdrop-blur-md"
                  )}
                >
                  {g === 'female' ? <User size={18} /> : <UserCheck size={18} />}
                  <span className="font-medium">{g === 'female' ? '女性服飾' : '男性服飾'}</span>
                </button>
              ))}
            </div>

            <DynastySelector />
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
