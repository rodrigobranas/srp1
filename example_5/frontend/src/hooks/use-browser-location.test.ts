import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { BrowserLocationResult, useBrowserLocation } from './use-browser-location'

type PositionSuccess = NonNullable<Parameters<Geolocation['getCurrentPosition']>[0]>
type PositionFailure = NonNullable<Parameters<Geolocation['getCurrentPosition']>[1]>

describe('useBrowserLocation', () => {
  it('does not request permission until the location action is invoked', () => {
    // Given
    const getCurrentPosition = vi.fn()
    renderHook(() => useBrowserLocation({ getCurrentPosition }))
    // Then
    expect(getCurrentPosition).not.toHaveBeenCalled()
  })
  it('returns browser coordinates after an explicit location request', async () => {
    // Given
    const getCurrentPosition = vi.fn((success: PositionSuccess) => success({ coords: { latitude: -23.5, longitude: -46.6 } } as GeolocationPosition))
    const { result } = renderHook(() => useBrowserLocation({ getCurrentPosition }))
    // When
    let location!: Awaited<ReturnType<typeof result.current.requestLocation>>
    await act(async () => { location = await result.current.requestLocation() })
    // Then
    expect(location).toEqual({ coordinates: { latitude: -23.5, longitude: -46.6 }, error: null })
    expect(getCurrentPosition).toHaveBeenCalledOnce()
  })
  it('keeps manual search available when permission is denied or support is absent', async () => {
    // Given
    const denied = vi.fn((_success: PositionSuccess, failure: PositionFailure) => failure({ code: 1 } as GeolocationPositionError))
    const supported = renderHook(() => useBrowserLocation({ getCurrentPosition: denied }))
    const unsupported = renderHook(() => useBrowserLocation(null))
    // When
    let deniedResult!: BrowserLocationResult
    await act(async () => { deniedResult = await supported.result.current.requestLocation() })
    let unsupportedResult!: BrowserLocationResult
    await act(async () => { unsupportedResult = await unsupported.result.current.requestLocation() })
    // Then
    expect(deniedResult.error).toContain('permissão')
    expect(unsupportedResult.error).toContain('não oferece localização')
  })
  it('recovers when the browser location API throws synchronously', async () => {
    // Given
    const getCurrentPosition = vi.fn(() => { throw new Error('browser failure') })
    const { result } = renderHook(() => useBrowserLocation({ getCurrentPosition }))
    // When
    let location!: BrowserLocationResult
    await act(async () => { location = await result.current.requestLocation() })
    // Then
    expect(location.error).toContain('Não foi possível acessar')
    expect(result.current.isLocating).toBe(false)
  })
})
