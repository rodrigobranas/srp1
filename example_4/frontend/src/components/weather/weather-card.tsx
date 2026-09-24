import { CloudSun } from 'lucide-react'
import { WeatherReport } from '@/types/weather'
import { getWeatherCondition } from './weather-condition'
import { WeatherDetails } from './weather-details'
import { WeatherLocation } from './weather-location'

interface WeatherCardProps {
  weather: WeatherReport
}

export function WeatherCard({ weather }: WeatherCardProps) {
  const condition = getWeatherCondition(weather.current.weatherCode)
  return (
    <section aria-label="Clima atual" className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xl shadow-sky-950/10 dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/20">
      <WeatherLocation location={weather.location} />
      <div className="my-7 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{condition}</p>
          <p className="mt-1 text-6xl font-bold tracking-tight text-slate-900 dark:text-white">{Math.round(weather.current.temperature)}°</p>
        </div>
        <CloudSun aria-hidden="true" size={96} strokeWidth={1.25} className="text-amber-400" />
      </div>
      <WeatherDetails current={weather.current} />
    </section>
  )
}
