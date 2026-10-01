import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { weatherForecast } from '@/tests/weather-response-fixtures'
import { WeatherLocation } from '@/types/weather'
import { WeatherView } from './WeatherView'

describe('WeatherView temperature unit', () => {
  it('converts all temperatures without requesting weather again', async () => {
    // Given
    const forecast = knownTemperatureForecast()
    const fetchMock = vi.fn().mockResolvedValueOnce(Response.json({ locations: [createLocation('Lisboa', 1)] })).mockResolvedValueOnce(Response.json(forecast))
    vi.stubGlobal('fetch', fetchMock)
    const user = userEvent.setup()
    render(<WeatherView geolocation={null} />)
    // When
    await searchForCity(user, 'Lisboa', 'Lisboa, Portugal')
    const daily = screen.getByRole('list', { name: 'Previsão para sete dias' })
    expect(screen.getByText('23,4°C')).toBeInTheDocument()
    expect(screen.getByText('21,1°C')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Temperatura em Celsius. Alternar para Fahrenheit' }))
    // Then
    expect(screen.getByText('74,1°F')).toBeInTheDocument()
    expect(screen.getByText('70°F')).toBeInTheDocument()
    expect(within(daily).getAllByText('32°F')).toHaveLength(7)
    expect(within(daily).getAllByText('77°F')).toHaveLength(7)
    expect(screen.getByText('52%')).toBeInTheDocument()
    expect(screen.getByText('8,4 km/h')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)
    // When
    await user.click(screen.getByRole('button', { name: 'Temperatura em Fahrenheit. Alternar para Celsius' }))
    // Then
    expect(screen.getByText('23,4°C')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
  it('keeps Fahrenheit for another search and resets to Celsius after remounting', async () => {
    // Given
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(Response.json({ locations: [createLocation('Lisboa', 1)] })).mockResolvedValueOnce(Response.json(knownTemperatureForecast()))
      .mockResolvedValueOnce(Response.json({ locations: [createLocation('Porto', 2)] })).mockResolvedValueOnce(Response.json(knownTemperatureForecast()))
    vi.stubGlobal('fetch', fetchMock)
    const user = userEvent.setup()
    const page = render(<WeatherView geolocation={null} />)
    // When
    await searchForCity(user, 'Lisboa', 'Lisboa, Portugal')
    await user.click(screen.getByRole('button', { name: 'Temperatura em Celsius. Alternar para Fahrenheit' }))
    await searchForCity(user, 'Porto', 'Porto, Portugal')
    // Then
    expect(screen.getByText('74,1°F')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(4)
    // When
    page.unmount()
    render(<WeatherView geolocation={null} />)
    // Then
    expect(screen.getByRole('button', { name: 'Temperatura em Celsius. Alternar para Fahrenheit' })).toHaveTextContent('°C')
  })
})

async function searchForCity(user: ReturnType<typeof userEvent.setup>, city: string, resultName: string) {
  const search = screen.getByRole('textbox', { name: 'Cidade' })
  await user.clear(search)
  await user.type(search, city)
  await user.keyboard('{Enter}')
  await screen.findByRole('heading', { name: resultName })
}

function createLocation(name: string, id: number): WeatherLocation {
  return { id, name, region: name, country: 'Portugal', countryCode: 'PT', latitude: 38.7, longitude: -9.1, timezone: 'Europe/Lisbon' }
}

function knownTemperatureForecast() {
  const forecast = weatherForecast()
  forecast.current.temperatureC = 23.4
  forecast.current.apparentTemperatureC = 21.1
  forecast.daily = forecast.daily.map((day) => ({ ...day, minimumTemperatureC: 0, maximumTemperatureC: 25 }))
  return forecast
}
