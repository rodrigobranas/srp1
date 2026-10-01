import { TemperatureUnit } from '@/types/temperature'

export function formatTemperature(valueCelsius: number | null, unit: TemperatureUnit): string {
  if (valueCelsius === null || !Number.isFinite(valueCelsius)) return 'Indisponível'
  const value = unit === 'fahrenheit' ? valueCelsius * 1.8 + 32 : valueCelsius
  const symbol = unit === 'fahrenheit' ? '°F' : '°C'
  const formattedValue = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 1 }).format(value)
  return `${formattedValue}${symbol}`
}
