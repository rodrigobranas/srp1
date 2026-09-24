import { MapPin } from 'lucide-react'
import { WeatherLocation as Location } from '@/types/weather'

interface WeatherLocationProps {
  location: Location
}

export function WeatherLocation({ location }: WeatherLocationProps) {
  return (
    <div className="flex items-center gap-2 text-slate-700 dark:text-cyan-50/75">
      <MapPin aria-hidden="true" size={18} className="text-cyan-700 dark:text-cyan-300" />
      <span className="font-medium tracking-[-0.01em]">{location.city}, {location.country}</span>
    </div>
  )
}
