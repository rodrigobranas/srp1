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
      <h2 id="location-results-heading" className="text-sm font-semibold uppercase tracking-wide text-slate-500">Escolha a localidade</h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {locations.map((location) => <li key={`${location.id}-${location.latitude}-${location.longitude}`}><button type="button" aria-pressed={location.id === selectedLocationId} onClick={() => onSelect(location)} className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-sky-400 hover:bg-sky-50 focus-visible:outline focus-visible:outline-4 focus-visible:outline-sky-200" aria-label={`Consultar clima para ${location.name}, ${formatLocationDetails(location)}`}><span className="block font-semibold text-slate-900">{location.name}</span><span className="mt-1 block text-sm text-slate-600">{formatLocationDetails(location)}</span></button></li>)}
      </ul>
    </section>
  )
}

function formatLocationDetails(location: WeatherLocation): string {
  return [location.region, location.country].filter(Boolean).join(', ') || 'Região não informada'
}
