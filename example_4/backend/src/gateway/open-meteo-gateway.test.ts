import { afterEach, describe, expect, it, vi } from 'vitest'
import { getCurrentWeather, searchCity } from './open-meteo-gateway'

const location = {
  city: 'Lisbon',
  country: 'Portugal',
  latitude: 38.72,
  longitude: -9.14,
  timezone: 'Europe/Lisbon',
}

const geocodingLocation = { ...location, name: location.city }

function response(body: unknown): Response {
  return { ok: true, json: vi.fn().mockResolvedValue(body) } as unknown as Response
}

describe('Open-Meteo gateway', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('builds requests and translates provider data', async () => {
    // Given
    const fetchMock = vi.fn().mockResolvedValueOnce(response({ results: [geocodingLocation] })).mockResolvedValueOnce(response({
      current: { temperature_2m: 18, apparent_temperature: 17, relative_humidity_2m: 60, wind_speed_10m: 4, weather_code: 0, time: '2026-09-24T12:00' },
    }))
    vi.stubGlobal('fetch', fetchMock)
    // When
    const foundLocation = await searchCity('Lisbon')
    const weather = await getCurrentWeather(location)
    // Then
    expect(fetchMock.mock.calls[0][0].toString()).toContain('name=Lisbon')
    expect(fetchMock.mock.calls[1][0].toString()).toContain('latitude=38.72')
    expect(foundLocation).toEqual(location)
    expect(weather).toMatchObject({ temperature: 18, apparentTemperature: 17, observedAt: '2026-09-24T12:00' })
  })

  it('reports missing current data from the provider', async () => {
    // Given
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({ timezone: location.timezone })))
    // When
    const weather = getCurrentWeather(location)
    // Then
    await expect(weather).rejects.toMatchObject({ statusCode: 502 })
  })
})
