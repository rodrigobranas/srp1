import { useEffect, useRef } from 'react'
import { drawAtmosphereField } from '@/lib/draw-atmosphere-field'
import { Theme } from '@/types/theme'

interface AtmosphereCanvasOptions {
  isScanning: boolean
  theme: Theme
}

export function useAtmosphereCanvas({ isScanning, theme }: AtmosphereCanvasOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    let frameId = 0
    const paint = (time = 0) => {
      resizeCanvas(canvas)
      drawAtmosphereField({ context, isScanning, theme, time })
      if (isScanning) frameId = requestAnimationFrame(paint)
    }
    const handleResize = () => paint()
    paint()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(frameId)
    }
  }, [isScanning, theme])
  return canvasRef
}

function resizeCanvas(canvas: HTMLCanvasElement) {
  const ratio = window.devicePixelRatio || 1
  const width = Math.floor(canvas.clientWidth * ratio)
  const height = Math.floor(canvas.clientHeight * ratio)
  if (canvas.width === width && canvas.height === height) return
  canvas.width = width
  canvas.height = height
}
