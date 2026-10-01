import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { parisMatches, weatherForecast } from '@/tests/weather-response-fixtures'
import { useWeather } from './use-weather'

type PositionSuccess = NonNullable<Parameters<Geolocation['getCurrentPosition']>[0]>

describe('useWeather retries', () => {
  it('retries a failed forecast for the selected city', async () => {
    // Given
    const api = { searchLocations: vi.fn(), getForecast: vi.fn().mockRejectedValueOnce(new Error()).mockResolvedValue(weatherForecast()) }
    const { result } = renderHook(() => useWeather(api, null))
    // When
    await act(async () => result.current.selectLocation(parisMatches[0]))
    await act(async () => result.current.retry())
    // Then
    expect(result.current.result?.locationName).toBe('Paris')
    expect(api.getForecast).toHaveBeenCalledTimes(2)
  })
  it('retries location weather only after the visitor activates retry', async () => {
    // Given
    const getCurrentPosition = vi.fn((success: PositionSuccess) => success({ coords: { latitude: 1, longitude: 2 } } as GeolocationPosition))
    const api = { searchLocations: vi.fn(), getForecast: vi.fn().mockRejectedValueOnce(new Error()).mockResolvedValue(weatherForecast()) }
    const { result } = renderHook(() => useWeather(api, { getCurrentPosition }))
    // When
    await act(async () => result.current.locate())
    await act(async () => result.current.retry())
    // Then
    expect(result.current.result?.locationName).toBe('Sua localização')
    expect(getCurrentPosition).toHaveBeenCalledTimes(2)
  })
})
