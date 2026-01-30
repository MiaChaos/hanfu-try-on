
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type Dynasty = 'tang' | 'song' | 'ming' | 'qing'
export type Gender = 'male' | 'female'
export type Role = 'commoner' | 'official' | 'emperor'
export type Composition = 'selfie' | 'upper_body' | 'full_body' | 'group'

interface AppState {
  imageFile: File | null
  previewUrl: string | null
  selectedDynasty: Dynasty
  selectedGender: Gender
  selectedRole: Role
  selectedComposition: Composition
  keepBackground: boolean
  result: {
    imageUrl: string
    id: string
    dynasty: string
  } | null
  history: Array<{
    imageUrl: string
    id: string
    dynasty: string
    timestamp: number
  }>
  isProcessing: boolean
  error: string | null

  setImage: (file: File | null) => void
  setPreviewUrl: (url: string | null) => void
  setDynasty: (dynasty: Dynasty) => void
  setGender: (gender: Gender) => void
  setRole: (role: Role) => void
  setComposition: (composition: Composition) => void
  setKeepBackground: (keep: boolean) => void
  setResult: (result: AppState['result']) => void
  addToHistory: (item: AppState['history'][0]) => void
  removeFromHistory: (timestamp: number) => void
  clearHistory: () => void
  setIsProcessing: (isProcessing: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      imageFile: null,
      previewUrl: null,
      selectedDynasty: 'tang',
      selectedGender: 'female',
      selectedRole: 'commoner',
      selectedComposition: 'upper_body',
      keepBackground: false,
      result: null,
      history: [],
      isProcessing: false,
      error: null,

      setImage: (file) => set({ imageFile: file }),
      setPreviewUrl: (url) => set({ previewUrl: url }),
      setDynasty: (dynasty) => set({ selectedDynasty: dynasty }),
      setGender: (gender) => set({ selectedGender: gender }),
      setRole: (role) => set({ selectedRole: role }),
      setComposition: (composition) => set({ selectedComposition: composition }),
      setKeepBackground: (keep) => set({ keepBackground: keep }),
      setResult: (result) => set({ result }),
      addToHistory: (item) => set((state) => ({ 
        history: [item, ...state.history].slice(0, 10) // Keep last 10 items
      })),
      removeFromHistory: (timestamp) => set((state) => ({
        history: state.history.filter((item) => item.timestamp !== timestamp)
      })),
      clearHistory: () => set({ history: [] }),
      setIsProcessing: (isProcessing) => set({ isProcessing }),
      setError: (error) => set({ error }),
      reset: () => set({
        imageFile: null,
        previewUrl: null,
        result: null,
        isProcessing: false,
        error: null,
        keepBackground: false
      })
    }),
    {
      name: 'history-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        history: state.history,
        selectedDynasty: state.selectedDynasty,
        selectedGender: state.selectedGender,
        selectedRole: state.selectedRole,
        selectedComposition: state.selectedComposition,
        keepBackground: state.keepBackground
      })
    }
  )
)
