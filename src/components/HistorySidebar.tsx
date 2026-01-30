
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'
import { History, X, Download, Share2, ChevronRight, Clock, Trash2, Trash } from 'lucide-react'
import { clsx } from 'clsx'
import { downloadImage, shareImage } from '../lib/utils'

export const HistorySidebar: React.FC = () => {
  const { history, setResult, removeFromHistory, clearHistory } = useAppStore()
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const handleOpenItem = (item: typeof history[0]) => {
    setResult({
      imageUrl: item.imageUrl,
      id: item.id,
      dynasty: item.dynasty
    })
    setIsOpen(false)
    navigate('/result')
  }

  const handleDownload = async (url: string, id: string) => {
    await downloadImage(url, `hanfu-${id}.jpg`)
  }

  const handleShare = async (url: string) => {
    await shareImage(url, '歷史換裝回顧')
  }

  if (history.length === 0) return null

  return (
    <>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={clsx(
          "fixed right-0 top-1/2 -translate-y-1/2 z-[60] bg-primary/90 backdrop-blur-md text-white p-3 rounded-l-2xl shadow-[-5px_0_20px_rgba(0,0,0,0.3)] transition-all active:scale-95",
          isOpen ? "translate-x-full" : "translate-x-0"
        )}
      >
        <div className="flex flex-col items-center gap-1">
          <History size={20} />
          <span className="text-[10px] font-black vertical-text">歷 史</span>
          <div className="bg-white text-primary text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center mt-1">
            {history.length}
          </div>
        </div>
      </button>

      {/* Sidebar Overlay */}
      <div 
        className={clsx(
          "fixed inset-0 z-[100] transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          onClick={() => setIsOpen(false)}
        />
        
        {/* Sidebar Content */}
        <div className={clsx(
          "absolute right-0 top-0 bottom-0 w-72 bg-[#0f0f0f] border-l border-white/10 shadow-2xl transition-transform duration-300 ease-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
            <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <Clock size={20} className="text-primary" /> 本次生成記錄
            </h2>
            <div className="flex gap-2">
              {history.length > 0 && (
                <button 
                  onClick={() => {
                    if (window.confirm('確定要清空所有歷史記錄嗎？')) {
                      clearHistory()
                    }
                  }}
                  className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-red-500 transition-colors"
                  title="清空歷史記錄"
                >
                  <Trash2 size={20} />
                </button>
              )}
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-white/40 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {history.map((item) => (
              <div 
                key={item.timestamp}
                className="group relative rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-primary/50 transition-all"
              >
                <div className="aspect-square relative cursor-pointer" onClick={() => handleOpenItem(item)}>
                  <img 
                    src={item.imageUrl} 
                    alt={item.dynasty} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-white text-[10px] font-black uppercase tracking-widest">
                      查看大圖
                    </span>
                  </div>
                  <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        if (window.confirm('確定要刪除這張圖片嗎？')) {
                          removeFromHistory(item.timestamp)
                        }
                      }}
                      className="p-1.5 rounded-full bg-black/60 text-white/60 hover:text-red-500 hover:bg-black/80 transition-all"
                      title="刪除"
                    >
                      <Trash size={12} />
                    </button>
                  </div>
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-primary/80 backdrop-blur-md text-[10px] font-black text-white">
                    {item.dynasty === 'tang' && '大唐'}
                    {item.dynasty === 'song' && '大宋'}
                    {item.dynasty === 'ming' && '大明'}
                    {item.dynasty === 'qing' && '大清'}
                  </div>
                </div>
                
                <div className="p-3 flex justify-between items-center bg-black/40 border-t border-white/5">
                  <span className="text-[10px] text-white/40 font-mono">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleDownload(item.imageUrl, item.id)}
                      className="p-1.5 rounded-md hover:bg-primary/20 text-white/60 hover:text-primary transition-all"
                      title="下載"
                    >
                      <Download size={14} />
                    </button>
                    <button 
                      onClick={() => handleShare(item.imageUrl)}
                      className="p-1.5 rounded-md hover:bg-primary/20 text-white/60 hover:text-primary transition-all"
                      title="分享"
                    >
                      <Share2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-black/60 border-t border-white/5">
            <p className="text-[9px] text-white/30 text-center uppercase tracking-widest">
              記錄將保留在瀏覽器中
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
