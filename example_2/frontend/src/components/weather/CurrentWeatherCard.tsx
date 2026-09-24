import { Droplets, MapPin, Sunrise, Sunset, Thermometer, Umbrella, Wind } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { WeatherIcon } from './WeatherIcon'
import { formatTemperature, formatTime, formatWindDirection } from '@/lib/weather-format'
import type { WeatherReport } from '@/types/weather'

function Metric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-secondary/60 px-3 py-2.5">
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.75} aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium tabular-nums">{value}</p>
      </div>
    </div>
  )
}

export function CurrentWeatherCard({ report }: { report: WeatherReport }) {
  const { location, current, daily, units } = report
  const today = daily[0]

  const place = [location.region, location.country].filter(Boolean).join(', ')

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-6 border-b bg-gradient-to-br from-secondary/80 to-secondary/20 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
            <span className="truncate">{place || 'Localização aproximada'}</span>
          </div>
          <h2 className="mt-1 truncate text-3xl font-semibold tracking-tight">{location.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {current.condition.label} · atualizado às {formatTime(current.time)}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <WeatherIcon
            name={current.condition.icon}
            isDay={current.isDay}
            className="h-16 w-16 text-foreground/70"
          />
          <div>
            <p className="text-6xl font-light leading-none tabular-nums">
              {formatTemperature(current.temperature)}
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Sensação {formatTemperature(current.apparentTemperature)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3 lg:grid-cols-6">
        <Metric icon={Droplets} label="Umidade" value={`${current.humidity}${units.humidity}`} />
        <Metric
          icon={Wind}
          label="Vento"
          value={`${Math.round(current.windSpeed)} ${units.windSpeed} ${formatWindDirection(current.windDirection)}`}
        />
        <Metric
          icon={Umbrella}
          label="Precipitação"
          value={`${current.precipitation} ${units.precipitation}`}
        />
        <Metric
          icon={Thermometer}
          label="Máx / Mín"
          value={`${formatTemperature(today.temperatureMax)} / ${formatTemperature(today.temperatureMin)}`}
        />
        <Metric icon={Sunrise} label="Nascer do sol" value={formatTime(today.sunrise)} />
        <Metric icon={Sunset} label="Pôr do sol" value={formatTime(today.sunset)} />
      </div>
    </Card>
  )
}
