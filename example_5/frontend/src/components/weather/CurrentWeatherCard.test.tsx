import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WeatherForecast } from '@/types/weather'
import { CurrentWeatherCard } from './CurrentWeatherCard'

const forecast: WeatherForecast = {
  timezone: 'America/Sao_Paulo',
  current: { time: '2026-10-01T09:15', temperatureC: 23.4, apparentTemperatureC: null, relativeHumidityPercent: 54, windSpeedKmh: 13.2, weatherCode: 2 },
  daily: [],
}

describe('CurrentWeatherCard', () => {
  it('shows current conditions, units, local time and an unavailable value label', () => {
    // When
    render(<CurrentWeatherCard locationName="São Paulo" country="Brasil" forecast={forecast} />)
    // Then
    expect(screen.getByRole('heading', { name: 'São Paulo, Brasil' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'São Paulo, Brasil' }).className).toContain('text-white')
    expect(screen.getByText('Parcialmente nublado')).toBeInTheDocument()
    expect(screen.getByText('23,4°C')).toBeInTheDocument()
    expect(screen.getByText('Indisponível')).toBeInTheDocument()
    expect(screen.getByText(/09:15/)).toBeInTheDocument()
    expect(screen.getByText('13,2 km/h')).toBeInTheDocument()
  })
})
