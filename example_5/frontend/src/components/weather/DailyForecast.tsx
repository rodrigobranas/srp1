import { getWeatherDescription } from '@/lib/weather-codes'
import { formatWeatherDate } from '@/lib/weather-dates'
import { formatTemperature } from '@/lib/temperature'
import { TemperatureUnit } from '@/types/temperature'
import { WeatherDay } from '@/types/weather'

interface DailyForecastProps {
  days: WeatherDay[]
  temperatureUnit: TemperatureUnit
}

export function DailyForecast({ days, temperatureUnit }: DailyForecastProps) {
  return (
    <section aria-labelledby="daily-forecast-heading" className="space-y-4">
      <div><p className="text-sm font-semibold uppercase tracking-wide text-primary">Próximos dias</p><h2 id="daily-forecast-heading" className="mt-1 text-2xl font-bold text-foreground">Previsão para sete dias</h2></div>
      <ol aria-label="Previsão para sete dias" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        {days.map((day) => <li key={day.date} className="rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-sm"><p className="text-sm font-semibold capitalize text-muted-foreground">{formatWeatherDate(day.date)}</p><p className="mt-4 min-h-10 text-sm font-medium text-card-foreground">{getWeatherDescription(day.weatherCode)}</p><p className="mt-3 text-sm text-muted-foreground">Mín. <strong className="text-card-foreground">{formatTemperature(day.minimumTemperatureC, temperatureUnit)}</strong></p><p className="mt-1 text-sm text-muted-foreground">Máx. <strong className="text-card-foreground">{formatTemperature(day.maximumTemperatureC, temperatureUnit)}</strong></p></li>)}
      </ol>
    </section>
  )
}
