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
    alert('下載失敗，請長按圖片保存')
  }
}

export const shareImage = async (imageUrl: string, title: string = '歷史換裝') => {
  try {
    const response = await fetch(imageUrl)
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
      const shareUrl = window.location.origin + imageUrl
      await navigator.clipboard.writeText(shareUrl)
      alert('分享功能不支持，圖片鏈接已複製！')
    }
  } catch (e) {
    console.error('Share failed', e)
    // Fallback if sharing fails (e.g. user cancelled)
    try {
        const shareUrl = window.location.origin + imageUrl
        await navigator.clipboard.writeText(shareUrl)
        alert('圖片鏈接已複製！')
    } catch (err) {
        alert('分享失敗')
    }
  }
}
