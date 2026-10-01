import { getWeatherDescription } from '@/lib/weather-codes'
import { formatLocalTime } from '@/lib/weather-dates'
import { WeatherForecast } from '@/types/weather'

interface CurrentWeatherCardProps {
  locationName: string
  country: string | null
  forecast: WeatherForecast
}

export function CurrentWeatherCard({ locationName, country, forecast }: CurrentWeatherCardProps) {
  const current = forecast.current
  return (
    <section aria-labelledby="current-weather-heading" className="overflow-hidden rounded-3xl bg-gradient-to-br from-sky-800 via-sky-700 to-indigo-800 p-6 text-white shadow-xl shadow-sky-950/10 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-medium text-sky-100">Condições atuais</p><h2 id="current-weather-heading" className="mt-1 text-2xl font-bold">{locationName}{country ? `, ${country}` : ''}</h2></div><p className="rounded-full bg-white/15 px-3 py-1 text-sm text-sky-50">Agora</p></div>
      <div className="mt-7 flex flex-wrap items-end gap-x-5 gap-y-2"><p className="text-6xl font-light tracking-tight">{formatMeasure(current.temperatureC, '°C')}</p><p className="pb-2 text-lg text-sky-50">{getWeatherDescription(current.weatherCode)}</p></div>
      <div className="mt-7 grid gap-4 border-t border-white/20 pt-5 sm:grid-cols-3"><p><span className="block text-sm text-sky-100">Sensação térmica</span><strong className="mt-1 block text-lg">{formatMeasure(current.apparentTemperatureC, '°C')}</strong></p><p><span className="block text-sm text-sky-100">Umidade</span><strong className="mt-1 block text-lg">{formatMeasure(current.relativeHumidityPercent, '%')}</strong></p><p><span className="block text-sm text-sky-100">Vento</span><strong className="mt-1 block text-lg">{formatMeasure(current.windSpeedKmh, ' km/h')}</strong></p></div>
      <p className="mt-5 text-sm text-sky-100">Horário local: {formatLocalTime(current.time, forecast.timezone)}</p>
    </section>
  )
}

function formatMeasure(value: number | null, unit: string): string {
  return value === null ? 'Indisponível' : `${value.toLocaleString('pt-BR')}${unit}`
}
