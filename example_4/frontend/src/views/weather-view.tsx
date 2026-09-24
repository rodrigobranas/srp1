import { CloudSun } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { WeatherContent } from '@/components/weather/weather-content'
import { WeatherSearch } from '@/components/weather/weather-search'
import { useTheme } from '@/hooks/use-theme'
import { useWeather } from '@/hooks/use-weather'

export function WeatherView() {
  const weather = useWeather()
  const { setTheme, theme } = useTheme()
  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:py-12">
      <div className="mx-auto max-w-xl">
        <header className="mb-8 text-center">
          <div className="flex justify-end"><ThemeToggle theme={theme} onThemeChange={setTheme} /></div>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500 shadow-lg shadow-sky-500/30"><CloudSun aria-hidden="true" size={30} /></div>
          <h1 className="text-3xl font-bold tracking-tight">Clima agora</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Consulte as condições atuais de qualquer cidade.</p>
        </header>
        <div className="rounded-3xl bg-white p-4 shadow-2xl shadow-slate-900/10 dark:bg-slate-900 dark:shadow-black/30 sm:p-6">
          <WeatherSearch model={weather} />
          <div className="mt-5"><WeatherContent model={weather} /></div>
        </div>
        <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">Dados meteorológicos fornecidos pela Open-Meteo.</p>
      </div>
    </main>
  )
}
