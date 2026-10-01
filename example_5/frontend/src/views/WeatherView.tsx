import { CurrentWeatherCard } from '@/components/weather/CurrentWeatherCard'
import { DailyForecast } from '@/components/weather/DailyForecast'
import { WeatherAttribution } from '@/components/weather/WeatherAttribution'
import { WeatherFeedback } from '@/components/weather/WeatherFeedback'
import { WeatherLocationButton } from '@/components/weather/WeatherLocationButton'
import { WeatherLocationResults } from '@/components/weather/WeatherLocationResults'
import { WeatherSearchForm } from '@/components/weather/WeatherSearchForm'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { useWeather } from '@/hooks/use-weather'
import { BrowserGeolocation } from '@/hooks/use-browser-location'

interface WeatherViewProps {
  geolocation?: BrowserGeolocation | null
}

export function WeatherView({ geolocation }: WeatherViewProps) {
  const weather = useWeather(undefined, geolocation)
  return (
    <main id="weather-main" className="min-h-screen bg-background text-foreground">
      <a className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-background focus:px-4 focus:py-3 focus:text-foreground focus:shadow-lg" href="#city-search">Pular para busca</a>
      <div className="mx-auto flex max-w-6xl flex-col gap-7 px-4 py-8 sm:px-8 sm:py-12">
        <header className="flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Painel de clima</p><h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">O clima para os seus planos</h1><p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">Pesquise uma cidade para ver as condições atuais e a previsão local para os próximos sete dias.</p></div><ThemeToggle /></header>
        <section aria-label="Buscar clima" className="rounded-3xl border border-border bg-card p-5 text-card-foreground shadow-sm sm:p-7">
          <div className="space-y-5">
            <WeatherSearchForm value={weather.query} isLoading={weather.isLoading} feedbackId="weather-feedback" onChange={weather.setQuery} onSearch={weather.search} />
            <div className="flex flex-col items-start gap-2 border-t border-border pt-4 sm:flex-row sm:items-center"><WeatherLocationButton isLoading={weather.isLocating} isDisabled={weather.isLoading} onLocate={weather.locate} /><p className="text-sm text-muted-foreground">Sua localização só será usada se você escolher esta opção.</p></div>
            <WeatherFeedback state={weather.feedbackState} message={weather.feedbackMessage ?? undefined} onRetry={weather.retry} />
            <WeatherLocationResults locations={weather.locations} selectedLocationId={weather.selectedLocation?.id ?? null} onSelect={weather.selectLocation} />
          </div>
        </section>
        {weather.result ? <section aria-label="Resultado do clima" className="space-y-7">
          <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">Clima e previsão carregados para {weather.result.locationName}{weather.result.country ? `, ${weather.result.country}` : ''}.</p>
          <CurrentWeatherCard locationName={weather.result.locationName} country={weather.result.country} forecast={weather.result.forecast} />
          <DailyForecast days={weather.result.forecast.daily} />
        </section> : null}
        <WeatherAttribution />
      </div>
    </main>
  )
}
