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
    <dl className="grid grid-cols-3 divide-x divide-slate-100 rounded-xl bg-slate-50 py-4">
      <WeatherMetric icon={<Thermometer size={18} />} label="Sensação" value={`${Math.round(current.apparentTemperature)}°`} />
      <WeatherMetric icon={<Droplets size={18} />} label="Umidade" value={`${current.humidity}%`} />
      <WeatherMetric icon={<Wind size={18} />} label="Vento" value={`${Math.round(current.windSpeed)} km/h`} />
    </dl>
  )
}

function WeatherMetric({ icon, label, value }: WeatherMetricProps) {
  return (
    <div className="flex flex-col items-center gap-1 text-slate-500">
      <div className="text-sky-600">{icon}</div>
      <dt className="text-xs">{label}</dt>
      <dd className="font-semibold text-slate-800">{value}</dd>
    </div>
  )
}
