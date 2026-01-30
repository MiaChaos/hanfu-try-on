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

// TODO: Replace with the actual school logo URL
// If this URL is empty or invalid, the logo will not be added
export const SCHOOL_LOGO_URL = import.meta.env.VITE_SCHOOL_LOGO_URL || ''

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = (e) => reject(e)
    img.src = src
  })
}

export const addSchoolLogoToImage = async (imageUrl: string): Promise<string> => {
  // Check if logo URL exists
  if (!SCHOOL_LOGO_URL) return imageUrl
  
  // Use proxy for external URLs to avoid CORS issues in Canvas
  const getProxiedUrl = (url: string) => {
    if (url.startsWith('http')) {
      return `/api/proxy-image?url=${encodeURIComponent(url)}`
    }
    return url
  }
  
  try {
    const [image, logo] = await Promise.all([
      loadImage(imageUrl),
      loadImage(getProxiedUrl(SCHOOL_LOGO_URL))
    ])
    
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    const ctx = canvas.getContext('2d')
    if (!ctx) return imageUrl
    
    // Draw original image
    ctx.drawImage(image, 0, 0)
    
    // Draw logo at bottom right
    // Logo width = 15% of image width
    const logoWidth = image.width * 0.15
    const logoAspectRatio = logo.width / logo.height
    const logoHeight = logoWidth / logoAspectRatio
    
    const padding = image.width * 0.05 // 5% padding
    
    const x = image.width - logoWidth - padding
    const y = image.height - logoHeight - padding
    
    ctx.drawImage(logo, x, y, logoWidth, logoHeight)
    
    return canvas.toDataURL('image/jpeg', 0.95)
  } catch (e) {
    console.error('Failed to add school logo:', e)
    // If failed (e.g. CORS or load error), return original image
    return imageUrl
  }
}
