import { AtmosphereCanvas } from '@/components/weather/atmosphere-canvas'
import { WeatherContent } from '@/components/weather/weather-content'
import { WeatherHeader } from '@/components/weather/weather-header'
import { WeatherIntroduction } from '@/components/weather/weather-introduction'
import { WeatherSearch } from '@/components/weather/weather-search'
import { useTheme } from '@/hooks/use-theme'
import { useWeather } from '@/hooks/use-weather'

export function WeatherView() {
  const weather = useWeather()
  const { setTheme, theme } = useTheme()
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#e8f0fa] px-5 text-slate-900 transition-colors dark:bg-[#020b17] dark:text-slate-50 sm:px-8">
      <AtmosphereCanvas isScanning={weather.isLoading} theme={theme} />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col">
        <WeatherHeader theme={theme} onThemeChange={setTheme} />
        <section className="grid flex-1 items-center gap-12 py-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(24rem,0.8fr)] lg:gap-20 lg:py-20">
          <div><WeatherIntroduction /><div className="mt-12 border-t border-slate-900/15 pt-6 dark:border-cyan-100/15"><WeatherSearch model={weather} /></div></div>
          <WeatherContent model={weather} />
        </section>
        <footer className="flex flex-wrap justify-between gap-3 border-t border-slate-900/10 py-5 text-xs font-medium uppercase tracking-[0.14em] text-slate-500 dark:border-cyan-100/10 dark:text-cyan-50/65"><span>Leitura de condições atuais</span><span>Open-Meteo</span></footer>
      </div>
    </main>
  )
}
