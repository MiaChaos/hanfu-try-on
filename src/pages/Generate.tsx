
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'
import { generateOneShot } from '../api'
import { Loader2, AlertCircle } from 'lucide-react'

const Generate: React.FC = () => {
  const { imageFile, selectedDynasty, setResult, setError, error } = useAppStore()
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!imageFile) {
      navigate('/')
      return
    }

    const process = async () => {
      try {
        setError(null)
        setProgress(10)
        
        // Use One-Shot API for Vercel Serverless stability
        // This combines upload and generation in a single request
        const interval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 95) {
              clearInterval(interval)
              return 95
            }
            return prev + 2
          })
        }, 800)

        const genRes = await generateOneShot(imageFile, selectedDynasty)
        
        clearInterval(interval)
        setProgress(100)
        
        setResult({
          imageUrl: genRes.imageUrl,
          id: genRes.resultId,
          dynasty: selectedDynasty
        })
        
        setTimeout(() => {
          navigate('/result')
        }, 500)
        
      } catch (err: any) {
        console.error('Processing error:', err)
        setError(err.message || '穿越超時或失敗，請重試')
      }
    }

    process()
  }, [])

  const handleBack = () => {
    navigate('/')
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background p-8">
      {error ? (
        <div className="text-center">
          <div className="text-primary mb-4 flex justify-center">
            <AlertCircle size={64} />
          </div>
          <h2 className="text-2xl font-bold text-ink mb-2">穿越失敗</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button 
            onClick={handleBack}
            className="px-8 py-3 rounded-full bg-primary text-white font-bold hover:bg-red-700 transition-all"
          >
            返回重試
          </button>
        </div>
      ) : (
        <div className="text-center w-full max-w-md">
          <div className="mb-8 relative">
            <div className="w-32 h-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
              <Loader2 className="w-16 h-16 text-primary animate-spin-slow" />
            </div>
          </div>
          
          <h2 className="text-3xl font-serif font-bold text-primary mb-4">
            正在穿越時空...
          </h2>
          <p className="text-gray-500 mb-8">
            正在為您定製{selectedDynasty === 'tang' ? '大唐' : selectedDynasty === 'song' ? '大宋' : selectedDynasty === 'ming' ? '大明' : '大清'}服飾
          </p>

          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
            <div 
              className="bg-primary h-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-right text-xs text-gray-400 mt-2">{progress}%</p>
        </div>
      )}
    </div>
  )
}

export default Generate
