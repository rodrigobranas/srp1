import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudHail,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudSun,
  Moon,
  Sun,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { WeatherIcon as WeatherIconName } from '@/types/weather'

const DAY_ICONS: Record<WeatherIconName, LucideIcon> = {
  clear: Sun,
  'partly-cloudy': CloudSun,
  cloudy: Cloud,
  fog: CloudFog,
  drizzle: CloudDrizzle,
  rain: CloudRain,
  'freezing-rain': CloudHail,
  snow: CloudSnow,
  showers: CloudRainWind,
  thunderstorm: CloudLightning,
  'thunderstorm-hail': CloudLightning,
}

const NIGHT_OVERRIDES: Partial<Record<WeatherIconName, LucideIcon>> = {
  clear: Moon,
  'partly-cloudy': CloudMoon,
}

interface WeatherIconProps {
  name: WeatherIconName
  isDay?: boolean
  className?: string
}

export function WeatherIcon({ name, isDay = true, className }: WeatherIconProps) {
  const Icon = (!isDay && NIGHT_OVERRIDES[name]) || DAY_ICONS[name]
  return <Icon className={cn('h-6 w-6', className)} strokeWidth={1.5} aria-hidden="true" />
}
