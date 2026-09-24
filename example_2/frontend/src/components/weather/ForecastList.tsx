import { Droplets } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { WeatherIcon } from './WeatherIcon'
import { formatDayMonth, formatTemperature, formatWeekday } from '@/lib/weather-format'
import type { DailyForecast } from '@/types/weather'

export function ForecastList({ daily }: { daily: DailyForecast[] }) {
  return (
    <section>
      <h3 className="mb-3 text-sm font-medium text-muted-foreground">Próximos 7 dias</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {daily.map((day, index) => (
          <Card key={day.date} className="flex flex-col items-center gap-2 p-4 text-center">
            <p className="text-sm font-medium">{formatWeekday(day.date, index)}</p>
            <p className="text-xs text-muted-foreground">{formatDayMonth(day.date)}</p>

            <WeatherIcon name={day.condition.icon} className="my-1 h-8 w-8 text-foreground/70" />

            <p className="text-sm tabular-nums">
              <span className="font-semibold">{formatTemperature(day.temperatureMax)}</span>
              <span className="text-muted-foreground"> / {formatTemperature(day.temperatureMin)}</span>
            </p>

            {day.precipitationProbability !== null && (
              <p className="flex items-center gap-1 text-xs text-muted-foreground tabular-nums">
                <Droplets className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                {day.precipitationProbability}%
              </p>
            )}

            <p className="sr-only">{day.condition.label}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}
