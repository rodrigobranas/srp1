import { afterEach, describe, expect, it, vi } from 'vitest'
import { getWeather } from './get-weather'

function response(body: unknown, ok = true): Response {
  return { ok, json: vi.fn().mockResolvedValue(body) } as unknown as Response
}

describe('getWeather', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('requests weather data from the local backend', async () => {
    // Given
    const fetchMock = vi.fn().mockResolvedValue(response({ location: {}, current: {} }))
    vi.stubGlobal('fetch', fetchMock)
    // When
    await getWeather('Rio de Janeiro')
    // Then
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/weather?city=Rio%20de%20Janeiro')
  })

  it('exposes the error returned by the backend', async () => {
    // Given
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({ error: 'City not found' }, false)))
    // When
    const result = getWeather('Unknown')
    // Then
    await expect(result).rejects.toThrow('City not found')
  })

  it('uses a fallback error when the backend body is invalid', async () => {
    // Given
    const invalidResponse = { ok: false, json: vi.fn().mockRejectedValue(new Error('Invalid JSON')) } as unknown as Response
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(invalidResponse))
    // When
    const result = getWeather('Unknown')
    // Then
    await expect(result).rejects.toThrow('Unable to load the weather right now')
  })
})
