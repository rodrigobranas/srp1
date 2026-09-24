import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WeatherCard } from './weather-card'
import { getWeatherCondition } from './weather-condition'

const weather = { location: { city: 'Brasília', country: 'Brazil', latitude: 0, longitude: 0, timezone: 'America/Sao_Paulo' }, current: { temperature: 25.4, apparentTemperature: 27.2, humidity: 45, windSpeed: 12.4, weatherCode: 0, observedAt: '2026-09-24T10:00' } }

describe('WeatherCard', () => {
  it('displays current measurements and the translated condition', () => {
    // Given
    render(<WeatherCard weather={weather} />)
    // When
    const card = screen.getByLabelText('Clima atual')
    // Then
    expect(card).toHaveTextContent('Brasília, Brazil')
    expect(card).toHaveTextContent('Céu limpo')
    expect(card).toHaveTextContent('25°')
    expect(card).toHaveTextContent('45%')
  })

  it.each([
    [1, 'Parcialmente nublado'], [3, 'Nublado'], [45, 'Neblina'], [51, 'Garoa'],
    [61, 'Chuva'], [71, 'Neve'], [95, 'Trovoadas'], [999, 'Condições variáveis'],
  ])('translates weather code %s as %s', (code, expectedCondition) => {
    // Given
    // When
    const condition = getWeatherCondition(code)
    // Then
    expect(condition).toBe(expectedCondition)
  })
})
