import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getWeather } from '@/services/weather/get-weather'
import { useWeather } from './use-weather'

vi.mock('@/services/weather/get-weather', () => ({ getWeather: vi.fn() }))

const weather = { location: { city: 'Recife', country: 'Brazil', latitude: 0, longitude: 0, timezone: 'America/Recife' }, current: { temperature: 29, apparentTemperature: 31, humidity: 70, windSpeed: 11, weatherCode: 1, observedAt: '2026-09-24T10:00' } }

describe('useWeather', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('loads weather after a city is submitted', async () => {
    // Given
    vi.mocked(getWeather).mockResolvedValue(weather)
    const { result } = renderHook(() => useWeather())
    // When
    act(() => result.current.onCityChange('Recife'))
    await act(async () => result.current.onSubmit())
    // Then
    expect(getWeather).toHaveBeenCalledWith('Recife')
    expect(result.current.weather).toEqual(weather)
  })

  it('shows a validation error for an empty city', async () => {
    // Given
    const { result } = renderHook(() => useWeather())
    // When
    act(() => result.current.onCityChange('  '))
    await act(async () => result.current.onSubmit())
    // Then
    expect(result.current.error).toBe('Digite uma cidade para consultar o clima.')
  })

  it('shows the backend failure message after a failed request', async () => {
    // Given
    vi.mocked(getWeather).mockRejectedValue(new Error('City not found'))
    const { result } = renderHook(() => useWeather())
    // When
    await act(async () => result.current.onSubmit())
    // Then
    expect(result.current).toMatchObject({ error: 'City not found', isLoading: false, weather: null })
  })

  it('uses a generic message for an unknown request failure', async () => {
    // Given
    vi.mocked(getWeather).mockRejectedValue('network failure')
    const { result } = renderHook(() => useWeather())
    // When
    await act(async () => result.current.onSubmit())
    // Then
    expect(result.current.error).toBe('Não foi possível carregar o clima agora.')
  })
})
