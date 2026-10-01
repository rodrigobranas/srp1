import { MapPin } from 'lucide-react'

interface WeatherLocationButtonProps {
  isLoading: boolean
  isDisabled?: boolean
  onLocate(): void
}

export function WeatherLocationButton({ isLoading, isDisabled = false, onLocate }: WeatherLocationButtonProps) {
  return (
    <button type="button" onClick={onLocate} disabled={isLoading || isDisabled} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 font-semibold text-sky-900 transition hover:bg-sky-100 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-sky-300 disabled:opacity-60">
      <MapPin aria-hidden="true" size={18} />
      {isLoading ? 'Localizando…' : 'Usar minha localização'}
    </button>
  )
}
