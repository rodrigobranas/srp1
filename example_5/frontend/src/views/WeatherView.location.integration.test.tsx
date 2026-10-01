import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { weatherForecast } from '@/tests/weather-response-fixtures'
import { WeatherView } from './WeatherView'

describe('WeatherView browser location', () => {
  it('uses granted coordinates with the local label and no reverse geocoding', async () => {
    // Given
    const getCurrentPosition = vi.fn((success: PositionSuccess) => success({ coords: { latitude: 1, longitude: 2 } } as GeolocationPosition))
    const fetchMock = vi.fn().mockResolvedValue(Response.json(weatherForecast()))
    vi.stubGlobal('fetch', fetchMock)
    render(<WeatherView geolocation={{ getCurrentPosition }} />)
    // When
    fireEvent.click(screen.getByRole('button', { name: 'Usar minha localização' }))
    // Then
    expect(await screen.findByRole('heading', { name: 'Sua localização' })).toBeInTheDocument()
    expect(getCurrentPosition).toHaveBeenCalledOnce()
    expect(fetchMock.mock.calls).toHaveLength(1)
    expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:3000/weather')
    expect(fetchMock.mock.calls[0][1].body).toBe('{"latitude":1,"longitude":2}')
  })
  it('keeps city search usable after permission is refused', async () => {
    // Given
    const getCurrentPosition = vi.fn((_success: PositionSuccess, failure: PositionFailure) => failure({ code: 1 } as GeolocationPositionError))
    const fetchMock = vi.fn().mockResolvedValueOnce(Response.json({ locations: [{ ...location, country: 'Portugal' }] })).mockResolvedValueOnce(Response.json(weatherForecast()))
    vi.stubGlobal('fetch', fetchMock)
    const user = userEvent.setup()
    render(<WeatherView geolocation={{ getCurrentPosition }} />)
    // When
    await user.click(screen.getByRole('button', { name: 'Usar minha localização' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('A permissão de localização foi negada')
    const search = screen.getByRole('textbox', { name: 'Cidade' })
    expect(search).toBeEnabled()
    await user.type(search, 'Porto')
    await user.keyboard('{Enter}')
    // Then
    expect(await screen.findByRole('heading', { name: 'Porto, Portugal' })).toBeInTheDocument()
    expect(fetchMock.mock.calls.map(([url]) => String(url))).toEqual([
      'http://localhost:3000/weather/locations?query=Porto', 'http://localhost:3000/weather',
    ])
  })
})

const location = { id: 44, name: 'Porto', region: 'Porto', country: null, countryCode: 'PT', latitude: 41.1, longitude: -8.6, timezone: 'Europe/Lisbon' }
type PositionSuccess = NonNullable<Parameters<Geolocation['getCurrentPosition']>[0]>
type PositionFailure = NonNullable<Parameters<Geolocation['getCurrentPosition']>[1]>
