import request from 'supertest'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp } from '../app'

const location = {
  city: 'São Paulo',
  country: 'Brazil',
  latitude: -23.55,
  longitude: -46.63,
  timezone: 'America/Sao_Paulo',
}

const geocodingLocation = { ...location, name: location.city }

function response(body: unknown, ok = true): Response {
  return { ok, json: vi.fn().mockResolvedValue(body) } as unknown as Response
}

describe('GET /weather', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns the current weather for a matching city', async () => {
    // Given
    const fetchMock = vi.fn().mockResolvedValueOnce(response({ results: [geocodingLocation] })).mockResolvedValueOnce(response({
      timezone: location.timezone,
      current: { temperature_2m: 22, apparent_temperature: 21, relative_humidity_2m: 75, wind_speed_10m: 9, weather_code: 2, time: '2026-09-24T10:00' },
    }))
    vi.stubGlobal('fetch', fetchMock)
    // When
    const result = await request(createApp()).get('/weather').query({ city: 'São Paulo' })
    // Then
    expect(result.status).toBe(200)
    expect(result.body).toMatchObject({ location, current: { temperature: 22, humidity: 75, windSpeed: 9 } })
  })

  it('rejects a request without a city', async () => {
    // Given
    const app = createApp()
    // When
    const result = await request(app).get('/weather')
    // Then
    expect(result).toMatchObject({ status: 400, body: { error: 'A city query parameter is required' } })
  })

  it('rejects a city made only of spaces', async () => {
    // Given
    const app = createApp()
    // When
    const result = await request(app).get('/weather').query({ city: '   ' })
    // Then
    expect(result.status).toBe(400)
  })

  it('reports a missing city and an unavailable provider', async () => {
    // Given
    const fetchMock = vi.fn().mockResolvedValueOnce(response({ results: [] })).mockResolvedValueOnce(response({}, false))
    vi.stubGlobal('fetch', fetchMock)
    // When
    const missingCity = await request(createApp()).get('/weather').query({ city: 'Unknown' })
    const unavailable = await request(createApp()).get('/weather').query({ city: 'São Paulo' })
    // Then
    expect(missingCity.status).toBe(404)
    expect(unavailable.status).toBe(502)
  })
})
