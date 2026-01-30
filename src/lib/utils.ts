import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const downloadImage = async (imageUrl: string, filename: string) => {
  try {
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (e) {
    console.error('Download failed', e)
    // Fallback: try to open in new tab for manual save
    window.open(imageUrl, '_blank')
  }
}

export const shareImage = async (imageUrl: string, title: string = '歷史換裝') => {
  const fullUrl = imageUrl.startsWith('http') ? imageUrl : window.location.origin + imageUrl
  
  try {
    const response = await fetch(fullUrl)
    const blob = await response.blob()
    const file = new File([blob], 'share.jpg', { type: 'image/jpeg' })

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: title,
        text: '看看我的歷史換裝照片！',
        files: [file]
      })
    } else {
      // Fallback to clipboard copy
      await navigator.clipboard.writeText(fullUrl)
      alert('分享功能不支持，圖片鏈接已複製！')
    }
  } catch (e) {
    console.error('Share failed', e)
    // Fallback if sharing fails (e.g. user cancelled or CORS error)
    try {
        await navigator.clipboard.writeText(fullUrl)
        alert('圖片鏈接已複製！')
    } catch (err) {
        alert('分享失敗')
    }
  }
}
