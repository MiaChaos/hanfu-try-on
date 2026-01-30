import React from 'react'
import { BookOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const EventHeader: React.FC = () => {
  const navigate = useNavigate()
  
  const eventName = import.meta.env.VITE_EVENT_NAME || '中華穿越鏡'
  const schoolName = import.meta.env.VITE_SCHOOL_NAME
  const schoolLogo = import.meta.env.VITE_SCHOOL_LOGO_URL
  const eventDate = import.meta.env.VITE_EVENT_DATE

  return (
    <div className="absolute top-0 right-0 z-30 p-6 text-right bg-gradient-to-l from-black/90 via-black/50 to-transparent pointer-events-none max-w-[70%] sm:max-w-full">
      <div className="pointer-events-auto flex flex-col items-end gap-2">
        {/* School Info */}
        {(schoolName || schoolLogo) && (
          <div className="flex items-center gap-3 mb-1 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 animate-fade-in-down">
            {schoolLogo && (
              <img src={schoolLogo} alt="School Logo" className="h-6 sm:h-8 w-auto object-contain" />
            )}
            {schoolName && (
              <span className="text-white/90 text-xs sm:text-sm font-bold tracking-wider whitespace-nowrap">
                {schoolName}
              </span>
            )}
          </div>
        )}

        {/* Event Name */}
        <h1 className="text-white text-xl sm:text-3xl font-serif font-bold tracking-[0.2em] drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
          {eventName}
        </h1>

        {/* Date */}
        {eventDate && (
          <div className="text-primary font-mono text-[10px] sm:text-xs font-bold tracking-widest bg-black/40 px-2 py-0.5 rounded border border-white/5">
            {eventDate}
          </div>
        )}

        {/* Info Button */}
        <button 
          onClick={() => navigate('/info')}
          className="mt-2 flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/30 backdrop-blur-2xl text-primary text-[10px] sm:text-xs font-black border border-primary/50 hover:bg-primary hover:text-white transition-all active:scale-95 shadow-xl"
        >
          <BookOpen size={14} /> <span className="hidden sm:inline">服飾百科</span><span className="sm:hidden">百科</span>
        </button>
      </div>
    </div>
  )
}
