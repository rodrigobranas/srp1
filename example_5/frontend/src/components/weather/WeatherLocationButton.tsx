import { MapPin } from 'lucide-react'

interface WeatherLocationButtonProps {
  isLoading: boolean
  isDisabled?: boolean
  onLocate(): void
}

export function WeatherLocationButton({ isLoading, isDisabled = false, onLocate }: WeatherLocationButtonProps) {
  return (
    <button type="button" onClick={onLocate} disabled={isLoading || isDisabled} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-4 font-semibold text-secondary-foreground transition hover:bg-accent hover:text-accent-foreground focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60">
      <MapPin aria-hidden="true" size={18} />
      {isLoading ? 'Localizando…' : 'Usar minha localização'}
    </button>
  )
}
