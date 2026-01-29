
import { create } from 'zustand'

export type Dynasty = 'tang' | 'song' | 'ming' | 'qing'

interface AppState {
  imageFile: File | null
  previewUrl: string | null
  selectedDynasty: Dynasty
  result: {
    imageUrl: string
    id: string
    dynasty: string
  } | null
  isProcessing: boolean
  error: string | null

  setImage: (file: File | null) => void
  setPreviewUrl: (url: string | null) => void
  setDynasty: (dynasty: Dynasty) => void
  setResult: (result: AppState['result']) => void
  setIsProcessing: (isProcessing: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useAppStore = create<AppState>((set) => ({
  imageFile: null,
  previewUrl: null,
  selectedDynasty: 'tang',
  result: null,
  isProcessing: false,
  error: null,

  setImage: (file) => set({ imageFile: file }),
  setPreviewUrl: (url) => set({ previewUrl: url }),
  setDynasty: (dynasty) => set({ selectedDynasty: dynasty }),
  setResult: (result) => set({ result }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setError: (error) => set({ error }),
  reset: () => set({
    imageFile: null,
    previewUrl: null,
    result: null,
    isProcessing: false,
    error: null
  })
}))
