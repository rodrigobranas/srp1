import { CloudSun } from 'lucide-react'

interface WeatherOrbitalReadingProps {
  isScanning?: boolean
}

export function WeatherOrbitalReading({ isScanning = false }: WeatherOrbitalReadingProps) {
  return (
    <div aria-hidden="true" className="relative flex h-32 w-32 shrink-0 items-center justify-center sm:h-40 sm:w-40">
      <div className={`absolute inset-2 rounded-full border border-cyan-700/20 dark:border-cyan-200/20 ${isScanning ? 'motion-safe:animate-spin' : ''}`} />
      <div className="absolute inset-7 rounded-full border border-dashed border-violet-300/60" />
      <CloudSun size={72} strokeWidth={1.1} className="relative text-cyan-700 dark:text-cyan-300 sm:h-20 sm:w-20" />
    </div>
  )
}
