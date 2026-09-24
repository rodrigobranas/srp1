const COMPASS = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO']

/**
 * Open-Meteo returns wall-clock times for the location, with no offset
 * (`2026-09-22T09:15`). Parsing them by hand keeps them in the location's
 * timezone instead of shifting them into the browser's.
 */
export function parseLocalDate(value: string): Date {
  const [datePart, timePart] = value.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  const [hour = 0, minute = 0] = (timePart ?? '').split(':').map(Number)
  return new Date(year, month - 1, day, hour, minute)
}

export function formatTemperature(value: number): string {
  return `${Math.round(value)}°`
}

export function formatTime(value: string): string {
  return parseLocalDate(value).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function formatWeekday(value: string, index: number): string {
  if (index === 0) return 'Hoje'
  const label = parseLocalDate(value).toLocaleDateString('pt-BR', { weekday: 'short' })
  return label.replace('.', '').replace(/^\w/, (c) => c.toUpperCase())
}

export function formatDayMonth(value: string): string {
  return parseLocalDate(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export function formatWindDirection(degrees: number): string {
  return COMPASS[Math.round(degrees / 45) % 8]
}
