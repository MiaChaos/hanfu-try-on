
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'
import { Download, Share2, Home as HomeIcon } from 'lucide-react'
import { downloadImage, shareImage } from '../lib/utils'

const Result: React.FC = () => {
  const { result, reset } = useAppStore()
  const navigate = useNavigate()

  if (!result) {
    navigate('/')
    return null
  }

  const handleDownload = async () => {
    await downloadImage(result.imageUrl, `history-fashion-${result.dynasty}-${Date.now()}.jpg`)
  }

  const handleShare = async () => {
    await shareImage(result.imageUrl, '我的歷史換裝照')
  }

  const handleHome = () => {
    reset()
    navigate('/')
  }

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] relative overflow-hidden">
       {/* Background Decoration */}
       <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
       <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <div className="flex-1 p-4 flex flex-col items-center justify-center relative z-10 overflow-hidden">
        <div className="relative w-full h-full max-h-[75vh] shadow-2xl rounded-2xl overflow-hidden border-4 border-white/10 bg-black flex items-center justify-center">
           <img 
            src={result.imageUrl} 
            alt="Result" 
            className="w-full h-full object-contain"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3 backdrop-blur-md border-t border-white/10 text-center">
             <h3 className="font-serif text-lg font-black tracking-widest text-primary">
               {result.dynasty === 'tang' && '大唐·長安'}
               {result.dynasty === 'song' && '大宋·汴京'}
               {result.dynasty === 'ming' && '大明·金陵'}
               {result.dynasty === 'qing' && '大清·紫禁'}
             </h3>
          </div>
        </div>
      </div>

      <div className="p-6 pb-10 flex justify-center items-center gap-8 z-20 bg-gradient-to-t from-black to-transparent">
        <button 
          onClick={handleHome}
          className="flex flex-col items-center gap-1.5 text-white/40 hover:text-white transition-all active:scale-90"
        >
          <div className="p-3.5 rounded-full bg-white/5 border border-white/10 shadow-xl backdrop-blur-md">
            <HomeIcon size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">首頁</span>
        </button>

        <button 
          onClick={handleDownload}
          className="flex flex-col items-center gap-2 text-white transition-all hover:scale-105 active:scale-95"
        >
          <div className="p-5 rounded-full bg-primary text-white shadow-[0_10px_30px_rgba(var(--primary-rgb),0.4)] border-2 border-white/20">
            <Download size={28} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">保存照片</span>
        </button>

        <button 
          onClick={handleShare}
          className="flex flex-col items-center gap-1.5 text-white/40 hover:text-white transition-all active:scale-90"
        >
          <div className="p-3.5 rounded-full bg-white/5 border border-white/10 shadow-xl backdrop-blur-md">
            <Share2 size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">分享</span>
        </button>
      </div>
    </div>
  )
}

export default Result
