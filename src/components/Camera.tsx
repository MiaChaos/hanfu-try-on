
import React, { useRef, useState, useEffect } from 'react'
import { Camera as CameraIcon, SwitchCamera } from 'lucide-react'
import { useAppStore } from '../store'

export const Camera: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { setImage, setPreviewUrl } = useAppStore()
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')
  const [stream, setStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [facingMode])

  const startCamera = async () => {
    try {
      if (stream) {
        stopCamera()
      }
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      })
      setStream(newStream)
      if (videoRef.current) {
        videoRef.current.srcObject = newStream
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
  }

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      
      // Set target size to 512x512
      const targetSize = 512
      canvas.width = targetSize
      canvas.height = targetSize
      
      const ctx = canvas.getContext('2d')
      if (ctx) {
        // Calculate crop to make it square
        const sourceWidth = video.videoWidth
        const sourceHeight = video.videoHeight
        const minSize = Math.min(sourceWidth, sourceHeight)
        const startX = (sourceWidth - minSize) / 2
        const startY = (sourceHeight - minSize) / 2

        // Mirror if user facing
        if (facingMode === 'user') {
          ctx.translate(targetSize, 0)
          ctx.scale(-1, 1)
        }
        
        // Draw cropped and resized image
        ctx.drawImage(
          video, 
          startX, startY, minSize, minSize, // Source crop
          0, 0, targetSize, targetSize     // Destination size
        )
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "capture.jpg", { type: "image/jpeg" })
            setImage(file)
            setPreviewUrl(URL.createObjectURL(blob))
          }
        }, 'image/jpeg', 0.8) // Use 0.8 quality for balance
      }
    }
  }

  return (
    <div className="relative w-full h-full bg-black overflow-hidden rounded-2xl shadow-2xl">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
      />
      
      {/* Overlay Guides - Responsive Square Crop Indicator */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        {/* The square frame: responsive logic */}
        <div className="relative flex items-center justify-center w-full h-full">
            <div className="aspect-square w-[min(100vw,100vh)] h-[min(100vw,100vh)] max-w-full max-h-full border-4 border-primary shadow-[0_0_0_2000px_rgba(0,0,0,0.6)] relative box-border">
            {/* Corner accents - larger and more visible */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-8 border-l-8 border-primary"></div>
            <div className="absolute top-0 right-0 w-12 h-12 border-t-8 border-r-8 border-primary"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-8 border-l-8 border-primary"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-8 border-r-8 border-primary"></div>
            
            {/* Rule of thirds within the square */}
            <div className="absolute top-1/3 left-0 right-0 h-px bg-white/30"></div>
            <div className="absolute top-2/3 left-0 right-0 h-px bg-white/30"></div>
            <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/30"></div>
            <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/30"></div>

            {/* Center Crosshair */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center">
                <div className="absolute w-full h-0.5 bg-primary/40"></div>
                <div className="absolute h-full w-0.5 bg-primary/40"></div>
            </div>
            </div>
        </div>
      </div>

      <div className="absolute bottom-16 left-0 right-0 flex justify-center items-center gap-12 z-50">
        <button 
          onClick={switchCamera}
          title="切換鏡頭"
          className="p-5 rounded-full bg-white/20 backdrop-blur-2xl hover:bg-white/40 transition-all text-white pointer-events-auto border border-white/20 shadow-xl active:scale-90"
        >
          <SwitchCamera size={32} />
        </button>
        
        <button 
          onClick={capture}
          title="拍照"
          className="p-2 rounded-full border-4 border-white hover:border-primary transition-all group shadow-[0_0_50px_rgba(0,0,0,0.8)] pointer-events-auto bg-white/10 backdrop-blur-md active:scale-95"
        >
          <div className="w-24 h-24 rounded-full bg-primary group-hover:scale-90 transition-transform flex items-center justify-center shadow-inner">
             <CameraIcon className="text-white" size={48} />
          </div>
        </button>
        
        <div className="w-20"></div> {/* Spacer for balance */}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
