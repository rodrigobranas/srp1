import { WeatherReport } from '@/types/weather'
import { getWeatherCondition } from './weather-condition'
import { WeatherDetails } from './weather-details'
import { WeatherLocation } from './weather-location'
import { WeatherOrbitalReading } from './weather-orbital-reading'

interface WeatherCardProps {
  weather: WeatherReport
}

export function WeatherCard({ weather }: WeatherCardProps) {
  const condition = getWeatherCondition(weather.current.weatherCode)
  return (
    <section aria-label="Clima atual" className="min-h-[26rem] rounded-[14px] border border-cyan-700/20 bg-white/80 p-6 shadow-[0_24px_60px_-42px_rgba(8,47,73,0.55)] motion-safe:animate-field-settle dark:bg-[#061528] dark:shadow-none sm:p-8">
      <div className="flex items-start justify-between gap-4"><WeatherLocation location={weather.location} /><p className="text-right text-xs font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-cyan-50/65">Condições atuais</p></div>
      <div className="mt-12 flex items-center justify-between gap-4">
        <div>
          <p className="text-base font-medium text-cyan-800 dark:text-cyan-200">{condition}</p>
          <p className="mt-2 text-7xl font-semibold leading-none tracking-[-0.04em] text-slate-950 dark:text-white sm:text-8xl">{Math.round(weather.current.temperature)}°</p>
        </div>
        <WeatherOrbitalReading />
      </div>
      <div className="mt-12"><WeatherDetails current={weather.current} /></div>
    </section>
  )
}
