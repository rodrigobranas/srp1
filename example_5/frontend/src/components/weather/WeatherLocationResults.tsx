import { WeatherLocation } from '@/types/weather'

interface WeatherLocationResultsProps {
  locations: WeatherLocation[]
  selectedLocationId: number | null
  onSelect(location: WeatherLocation): void
}

export function WeatherLocationResults({ locations, selectedLocationId, onSelect }: WeatherLocationResultsProps) {
  if (locations.length === 0) return null
  return (
    <section aria-labelledby="location-results-heading" className="space-y-3">
      <h2 id="location-results-heading" className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Escolha a localidade</h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {locations.map((location) => <li key={`${location.id}-${location.latitude}-${location.longitude}`}><button type="button" aria-pressed={location.id === selectedLocationId} onClick={() => onSelect(location)} className="w-full rounded-xl border border-border bg-card p-4 text-left text-card-foreground transition hover:bg-accent hover:text-accent-foreground focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-ring aria-pressed:border-primary aria-pressed:bg-accent aria-pressed:ring-2 aria-pressed:ring-ring" aria-label={`Consultar clima para ${location.name}, ${formatLocationDetails(location)}`}><span className="block font-semibold text-card-foreground">{location.name}</span><span className="mt-1 block text-sm text-muted-foreground">{formatLocationDetails(location)}</span></button></li>)}
      </ul>
    </section>
  )
}

function formatLocationDetails(location: WeatherLocation): string {
  return [location.region, location.country].filter(Boolean).join(', ') || 'Região não informada'
}
