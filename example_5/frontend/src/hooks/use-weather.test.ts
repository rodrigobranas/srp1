import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { WeatherForecast, WeatherLocation } from '@/types/weather'
import { useWeather } from './use-weather'

type PositionSuccess = NonNullable<Parameters<Geolocation['getCurrentPosition']>[0]>
type PositionFailure = NonNullable<Parameters<Geolocation['getCurrentPosition']>[1]>

const paris: WeatherLocation = { id: 1, name: 'Paris', region: 'Île-de-France', country: 'França', countryCode: 'FR', latitude: 48.8, longitude: 2.3, timezone: 'Europe/Paris' }
const forecast: WeatherForecast = { timezone: 'Europe/Paris', current: { time: '2026-10-01T09:00', temperatureC: 17, apparentTemperatureC: 17, relativeHumidityPercent: 50, windSpeedKmh: 5, weatherCode: 1 }, daily: [] }

describe('useWeather', () => {
  it('clears old results and reports blank input without calling the API', async () => {
    // Given
    const api = { searchLocations: vi.fn().mockResolvedValue([paris]), getForecast: vi.fn().mockResolvedValue(forecast) }
    const { result } = renderHook(() => useWeather(api, null))
    // When
    act(() => result.current.setQuery('Paris'))
    await act(async () => result.current.search())
    await waitFor(() => expect(result.current.result?.locationName).toBe('Paris'))
    act(() => result.current.setQuery('   '))
    await act(async () => result.current.search())
    // Then
    expect(result.current.result).toBeNull()
    expect(result.current.feedbackState).toBe('invalid')
    expect(api.searchLocations).toHaveBeenCalledOnce()
  })
  it('keeps the newest search when an older response arrives later', async () => {
    // Given
    let finishOld!: (locations: WeatherLocation[]) => void
    const oldSearch = new Promise<WeatherLocation[]>((resolve) => { finishOld = resolve })
    const api = { searchLocations: vi.fn().mockReturnValueOnce(oldSearch).mockResolvedValueOnce([{ ...paris, id: 2, name: 'Lisboa' }]), getForecast: vi.fn().mockResolvedValue(forecast) }
    const { result } = renderHook(() => useWeather(api, null))
    // When
    act(() => result.current.setQuery('Paris'))
    let pendingOld!: Promise<void>
    act(() => { pendingOld = result.current.search() })
    act(() => result.current.setQuery('Lisboa'))
    await act(async () => result.current.search())
    await waitFor(() => expect(result.current.result?.locationName).toBe('Lisboa'))
    await act(async () => { finishOld([paris]); await pendingOld })
    // Then
    expect(result.current.result?.locationName).toBe('Lisboa')
    expect(result.current.selectedLocation?.name).toBe('Lisboa')
  })
  it('reports denied location permission and keeps the typed search available', async () => {
    // Given
    const getCurrentPosition = vi.fn((_success: PositionSuccess, failure: PositionFailure) => failure({ code: 1 } as GeolocationPositionError))
    const api = { searchLocations: vi.fn().mockResolvedValue([paris]), getForecast: vi.fn().mockResolvedValue(forecast) }
    const { result } = renderHook(() => useWeather(api, { getCurrentPosition }))
    // When
    await act(async () => result.current.locate())
    // Then
    expect(result.current.feedbackState).toBe('location-error')
    expect(result.current.feedbackMessage).toContain('permissão')
    // When
    act(() => result.current.setQuery('Paris'))
    await act(async () => result.current.search())
    // Then
    expect(result.current.feedbackState).toBe('idle')
    expect(result.current.result?.locationName).toBe('Paris')
    expect(getCurrentPosition).toHaveBeenCalledOnce()
  })
})
