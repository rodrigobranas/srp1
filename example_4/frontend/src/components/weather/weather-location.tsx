import { MapPin } from 'lucide-react'
import { WeatherLocation as Location } from '@/types/weather'

interface WeatherLocationProps {
  location: Location
}

export function WeatherLocation({ location }: WeatherLocationProps) {
  return (
    <div className="flex items-center gap-2 text-slate-600">
      <MapPin aria-hidden="true" size={18} className="text-sky-600" />
      <span className="font-medium">{location.city}, {location.country}</span>
    </div>
  )
}
