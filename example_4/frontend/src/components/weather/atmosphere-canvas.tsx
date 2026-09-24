import { useAtmosphereCanvas } from '@/hooks/use-atmosphere-canvas'
import { Theme } from '@/types/theme'

interface AtmosphereCanvasProps {
  isScanning: boolean
  theme: Theme
}

export function AtmosphereCanvas({ isScanning, theme }: AtmosphereCanvasProps) {
  const canvasRef = useAtmosphereCanvas({ isScanning, theme })
  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full opacity-80 dark:opacity-100" />
}
