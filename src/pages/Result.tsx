
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'
import { Download, Share2, Home as HomeIcon } from 'lucide-react'

const Result: React.FC = () => {
  const { result, reset } = useAppStore()
  const navigate = useNavigate()

  if (!result) {
    navigate('/')
    return null
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(result.imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `history-fashion-${result.dynasty}-${Date.now()}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (e) {
      console.error('Download failed', e)
      alert('下載失敗')
    }
  }

  const handleShare = () => {
    // Copy link
    const shareUrl = window.location.origin + result.imageUrl
    navigator.clipboard.writeText(shareUrl)
    alert('圖片鏈接已複製！')
  }

  const handleHome = () => {
    reset()
    navigate('/')
  }

  return (
    <div className="flex flex-col h-screen bg-background relative overflow-hidden">
       {/* Background Decoration */}
       <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
       <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <div className="flex-1 p-8 flex flex-col items-center justify-center relative z-10">
        <div className="relative w-full max-w-2xl aspect-[3/4] md:aspect-auto md:h-[70vh] shadow-2xl rounded-lg overflow-hidden border-8 border-white bg-white rotate-1 hover:rotate-0 transition-transform duration-500">
           <img 
            src={result.imageUrl} 
            alt="Result" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-4 backdrop-blur-sm">
             <h3 className="text-center font-serif text-xl font-bold text-ink">
               {result.dynasty === 'tang' && '大唐·長安'}
               {result.dynasty === 'song' && '大宋·汴京'}
               {result.dynasty === 'ming' && '大明·金陵'}
               {result.dynasty === 'qing' && '大清·紫禁'}
             </h3>
          </div>
        </div>
      </div>

      <div className="p-8 pb-12 flex justify-center gap-6 z-20">
        <button 
          onClick={handleHome}
          className="flex flex-col items-center gap-2 text-ink/60 hover:text-primary transition-colors"
        >
          <div className="p-4 rounded-full bg-white shadow-md hover:shadow-lg transition-all">
            <HomeIcon size={24} />
          </div>
          <span className="text-xs font-bold">返回</span>
        </button>

        <button 
          onClick={handleDownload}
          className="flex flex-col items-center gap-2 text-ink hover:text-primary transition-colors"
        >
          <div className="p-6 rounded-full bg-primary text-white shadow-lg hover:shadow-primary/50 hover:scale-105 transition-all">
            <Download size={32} />
          </div>
          <span className="text-sm font-bold">保存照片</span>
        </button>

        <button 
          onClick={handleShare}
          className="flex flex-col items-center gap-2 text-ink/60 hover:text-primary transition-colors"
        >
          <div className="p-4 rounded-full bg-white shadow-md hover:shadow-lg transition-all">
            <Share2 size={24} />
          </div>
          <span className="text-xs font-bold">分享</span>
        </button>
      </div>
    </div>
  )
}

export default Result
