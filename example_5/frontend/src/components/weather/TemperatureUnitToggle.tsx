import { Button } from '@/components/ui/button'
import { TemperatureUnit } from '@/types/temperature'

interface TemperatureUnitToggleProps {
  unit: TemperatureUnit
  onToggle: () => void
}

export function TemperatureUnitToggle({ unit, onToggle }: TemperatureUnitToggleProps) {
  const isCelsius = unit === 'celsius'
  const activeUnit = isCelsius ? 'Celsius' : 'Fahrenheit'
  const targetUnit = isCelsius ? 'Fahrenheit' : 'Celsius'
  return (
    <Button type="button" variant="outline" size="sm" aria-pressed={!isCelsius} aria-label={`Temperatura em ${activeUnit}. Alternar para ${targetUnit}`} onClick={onToggle}>
      {isCelsius ? '°C' : '°F'}
    </Button>
  )
}
