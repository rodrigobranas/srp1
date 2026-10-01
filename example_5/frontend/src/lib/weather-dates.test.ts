import { describe, expect, it } from 'vitest'
import { formatLocalTime, formatWeatherDate } from './weather-dates'

describe('weather date formatting', () => {
  it('formats date-only values without shifting the city local calendar day', () => {
    // Given
    const localDate = '2026-10-01'
    // When
    const formatted = formatWeatherDate(localDate)
    // Then
    expect(formatted).toContain('1 de out.')
  })
  it('keeps the provider local clock and identifies its timezone city', () => {
    // When
    const formatted = formatLocalTime('2026-10-01T09:15', 'America/Sao_Paulo')
    // Then
    expect(formatted).toContain('09:15')
    expect(formatted).toContain('Brasília')
  })
  it('returns a fallback when the provider time is malformed', () => {
    // Then
    expect(formatLocalTime('not-a-date', 'UTC')).toBe('Horário indisponível')
    expect(formatWeatherDate('invalid')).toBe('invalid')
  })
  it('does not normalize an impossible calendar date into another day', () => {
    // Then
    expect(formatWeatherDate('2026-02-31')).toBe('2026-02-31')
    expect(formatLocalTime('2026-02-31T09:15', 'UTC')).toBe('Horário indisponível')
  })
  it('falls back to the timezone identifier when the browser does not recognize it', () => {
    // Then
    expect(formatLocalTime('2026-10-01T09:15', 'Invalid/Zone')).toContain('(Zone)')
  })
})
