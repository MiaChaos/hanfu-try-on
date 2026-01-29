
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
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      const ctx = canvas.getContext('2d')
      if (ctx) {
        // Mirror if user facing
        if (facingMode === 'user') {
          ctx.translate(canvas.width, 0)
          ctx.scale(-1, 1)
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "capture.jpg", { type: "image/jpeg" })
            setImage(file)
            setPreviewUrl(URL.createObjectURL(blob))
          }
        }, 'image/jpeg', 0.9)
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
      
      {/* Overlay Guides */}
      <div className="absolute inset-0 pointer-events-none border-[1px] border-white/20 m-4 rounded-xl">
        <div className="absolute top-1/3 left-0 right-0 h-px bg-white/20"></div>
        <div className="absolute top-2/3 left-0 right-0 h-px bg-white/20"></div>
        <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/20"></div>
        <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/20"></div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8 z-20">
        <button 
          onClick={switchCamera}
          className="p-4 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all text-white"
        >
          <SwitchCamera size={24} />
        </button>
        
        <button 
          onClick={capture}
          className="p-1 rounded-full border-4 border-white/50 hover:border-white transition-all group"
        >
          <div className="w-16 h-16 rounded-full bg-primary group-hover:scale-95 transition-transform"></div>
        </button>
        
        <div className="w-14"></div> {/* Spacer for balance */}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
