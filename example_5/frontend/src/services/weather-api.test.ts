import { describe, expect, it, vi } from 'vitest'
import { getForecast, searchLocations } from './weather-api'

describe('weather API client', () => {
  it('uses the configured backend route for location search', async () => {
    // Given
    vi.stubEnv('VITE_API_BASE_URL', 'https://backend.example/')
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ locations: [] }))
    vi.stubGlobal('fetch', fetchMock)
    // When
    await searchLocations('New York')
    // Then
    expect(fetchMock).toHaveBeenCalledOnce()
    expect(fetchMock.mock.calls[0][0]).toBe('https://backend.example/weather/locations?query=New+York')
    expect(String(fetchMock.mock.calls[0][0])).not.toContain('open-meteo')
  })
  it('posts selected coordinates to the backend and forwards cancellation', async () => {
    // Given
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ timezone: 'UTC' }))
    vi.stubGlobal('fetch', fetchMock)
    const controller = new AbortController()
    // When
    await getForecast({ latitude: 1, longitude: 2 }, controller.signal)
    // Then
    expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:3000/weather')
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ method: 'POST', signal: controller.signal, body: '{"latitude":1,"longitude":2}' })
  })
  it('translates stable backend error codes into user-facing messages', async () => {
    // Given
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ error: { code: 'WEATHER_SOURCE_TIMEOUT', message: 'raw server text' } }, { status: 504 }))
    vi.stubGlobal('fetch', fetchMock)
    // When
    const result = searchLocations('Paris')
    // Then
    await expect(result).rejects.toMatchObject({ name: 'WeatherApiException', code: 'WEATHER_SOURCE_TIMEOUT', message: 'A consulta demorou demais. Tente novamente.' })
  })
  it('uses a generic safe message for an unknown error envelope code', async () => {
    // Given
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ error: { code: 'toString' } }, { status: 500 }))
    vi.stubGlobal('fetch', fetchMock)
    // When
    const result = searchLocations('Paris')
    // Then
    await expect(result).rejects.toMatchObject({ code: 'INTERNAL_ERROR', message: 'O serviço está indisponível. Tente novamente em instantes.' })
  })
})
