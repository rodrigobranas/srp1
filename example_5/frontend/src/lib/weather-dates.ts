export function formatWeatherDate(value: string): string {
  const date = createUtcDate(value)
  if (!date) return value
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC',
  }).format(date)
}

export function formatLocalTime(value: string, timezone: string): string {
  const [datePart, timePart] = value.split('T')
  const time = timePart?.slice(0, 5)
  if (!createUtcDate(datePart) || !/^\d{2}:\d{2}$/.test(time ?? '')) return 'Horário indisponível'
  return `${formatWeatherDate(datePart)} às ${time} (${formatTimezoneName(timezone)})`
}

function createUtcDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const date = new Date(`${value}T00:00:00Z`)
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return null
  return date
}

function formatTimezoneName(timezone: string): string {
  try {
    const parts = new Intl.DateTimeFormat('pt-BR', { timeZone: timezone, timeZoneName: 'longGeneric' }).formatToParts(new Date())
    return parts.find((part) => part.type === 'timeZoneName')?.value ?? timezone
  } catch {
    return timezone.split('/').pop()?.replace(/_/g, ' ') || 'horário local'
  }
}
