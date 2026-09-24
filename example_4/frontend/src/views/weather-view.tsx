import { CloudSun } from 'lucide-react'
import { WeatherContent } from '@/components/weather/weather-content'
import { WeatherSearch } from '@/components/weather/weather-search'
import { useWeather } from '@/hooks/use-weather'

export function WeatherView() {
  const weather = useWeather()
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-12 text-slate-900 sm:py-20">
      <div className="mx-auto max-w-xl">
        <header className="mb-8 text-center text-white">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500 shadow-lg shadow-sky-500/30"><CloudSun aria-hidden="true" size={30} /></div>
          <h1 className="text-3xl font-bold tracking-tight">Clima agora</h1>
          <p className="mt-2 text-slate-300">Consulte as condições atuais de qualquer cidade.</p>
        </header>
        <div className="rounded-3xl bg-slate-100 p-4 shadow-2xl shadow-black/30 sm:p-6">
          <WeatherSearch model={weather} />
          <div className="mt-5"><WeatherContent model={weather} /></div>
        </div>
        <p className="mt-5 text-center text-sm text-slate-400">Dados meteorológicos fornecidos pela Open-Meteo.</p>
      </div>
    </main>
  )
}
