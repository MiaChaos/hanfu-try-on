
import React from 'react'
import { useAppStore, type Dynasty } from '../store'
import { clsx } from 'clsx'

const DYNASTIES: { id: Dynasty; name: string; image: string }[] = [
  { 
    id: 'tang', 
    name: '大唐盛世', 
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Chinese%20Tang%20dynasty%20female%20traditional%20clothing%20elegant%20portrait%20illustration%20style%20red%20and%20gold&image_size=portrait_4_3'
  },
  { 
    id: 'song', 
    name: '風雅大宋', 
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Chinese%20Song%20dynasty%20female%20traditional%20clothing%20elegant%20portrait%20illustration%20style%20pastel%20colors&image_size=portrait_4_3'
  },
  { 
    id: 'ming', 
    name: '大明風華', 
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Chinese%20Ming%20dynasty%20female%20traditional%20clothing%20elegant%20portrait%20illustration%20style%20blue%20and%20white&image_size=portrait_4_3'
  },
  { 
    id: 'qing', 
    name: '清宮舊夢', 
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Chinese%20Qing%20dynasty%20female%20traditional%20clothing%20elegant%20portrait%20illustration%20style%20ornate%20headdress&image_size=portrait_4_3'
  },
]

export const DynastySelector: React.FC = () => {
  const { selectedDynasty, setDynasty } = useAppStore()

  return (
    <div className="w-full overflow-x-auto scrollbar-hide py-4">
      <div className="flex space-x-4 px-4 min-w-max">
        {DYNASTIES.map((dynasty) => (
          <button
            key={dynasty.id}
            onClick={() => setDynasty(dynasty.id)}
            className={clsx(
              'relative w-32 h-48 rounded-xl overflow-hidden transition-all duration-300 transform',
              selectedDynasty === dynasty.id 
                ? 'ring-4 ring-primary scale-105 shadow-xl' 
                : 'opacity-80 hover:opacity-100 hover:scale-105'
            )}
          >
            <img 
              src={dynasty.image} 
              alt={dynasty.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
              <span className="text-white font-serif text-sm font-bold tracking-widest">
                {dynasty.name}
              </span>
            </div>
            {selectedDynasty === dynasty.id && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
