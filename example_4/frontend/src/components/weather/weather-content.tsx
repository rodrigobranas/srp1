import { CloudSun } from 'lucide-react'
import { WeatherViewModel } from '@/hooks/use-weather'
import { WeatherCard } from './weather-card'

interface WeatherContentProps {
  model: Pick<WeatherViewModel, 'error' | 'isLoading' | 'weather'>
}

export function WeatherContent({ model }: WeatherContentProps) {
  if (model.isLoading) return <WeatherMessage message="Consultando as condições atuais..." />
  if (model.error) return <WeatherMessage message={model.error} isError />
  if (model.weather) return <WeatherCard weather={model.weather} />
  return <WeatherMessage message="Busque uma cidade para ver o clima atual." />
}

interface WeatherMessageProps {
  isError?: boolean
  message: string
}

function WeatherMessage({ isError = false, message }: WeatherMessageProps) {
  const color = isError ? 'text-rose-600' : 'text-slate-500'
  return <div role={isError ? 'alert' : 'status'} className={`flex min-h-72 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white/60 p-8 text-center ${color}`}><CloudSun aria-hidden="true" size={42} /><p>{message}</p></div>
}
