import { ReactNode } from 'react'
import { Droplets, Thermometer, Wind } from 'lucide-react'
import { CurrentWeather } from '@/types/weather'

interface WeatherDetailsProps {
  current: CurrentWeather
}

interface WeatherMetricProps {
  icon: ReactNode
  label: string
  value: string
}

export function WeatherDetails({ current }: WeatherDetailsProps) {
  return (
    <dl className="grid grid-cols-3 divide-x divide-slate-900/10 border-y border-slate-900/10 py-4 dark:divide-cyan-100/10 dark:border-cyan-100/10">
      <WeatherMetric icon={<Thermometer size={18} />} label="Sensação" value={`${Math.round(current.apparentTemperature)}°`} />
      <WeatherMetric icon={<Droplets size={18} />} label="Umidade" value={`${current.humidity}%`} />
      <WeatherMetric icon={<Wind size={18} />} label="Vento" value={`${Math.round(current.windSpeed)} km/h`} />
    </dl>
  )
}

function WeatherMetric({ icon, label, value }: WeatherMetricProps) {
  return (
    <div className="flex flex-col items-center gap-1 px-2 text-slate-500 dark:text-cyan-50/55">
      <div className="text-cyan-700 dark:text-cyan-300">{icon}</div>
      <dt className="text-xs uppercase tracking-[0.08em]">{label}</dt>
      <dd className="font-mono text-sm font-semibold text-slate-900 dark:text-white">{value}</dd>
    </div>
  )
}
