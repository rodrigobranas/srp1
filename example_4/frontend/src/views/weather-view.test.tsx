import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { getWeather } from '@/services/weather/get-weather'
import { ThemeProvider } from '@/contexts/theme-provider'
import { WeatherView } from './weather-view'

vi.mock('@/services/weather/get-weather', () => ({ getWeather: vi.fn() }))

const weather = { location: { city: 'Manaus', country: 'Brazil', latitude: 0, longitude: 0, timezone: 'America/Manaus' }, current: { temperature: 31, apparentTemperature: 34, humidity: 67, windSpeed: 6, weatherCode: 3, observedAt: '2026-09-24T10:00' } }

describe('WeatherView', () => {
  it('renders weather returned for the searched city', async () => {
    // Given
    vi.mocked(getWeather).mockResolvedValue(weather)
    render(<ThemeProvider><WeatherView /></ThemeProvider>)
    // When
    fireEvent.change(screen.getByLabelText('Cidade'), { target: { value: 'Manaus' } })
    fireEvent.click(screen.getByRole('button', { name: 'Buscar clima' }))
    // Then
    expect(await screen.findByText('Manaus, Brazil')).toBeInTheDocument()
    expect(screen.getByText('O céu tem um sinal.')).toBeInTheDocument()
    expect(screen.getByText('CLIMA AGORA')).toBeInTheDocument()
  })
})
