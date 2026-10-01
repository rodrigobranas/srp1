import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WeatherDay } from '@/types/weather'
import { DailyForecast } from './DailyForecast'

const days: WeatherDay[] = Array.from({ length: 7 }, (_, index) => ({
  date: `2026-10-0${index + 1}`, weatherCode: 61, minimumTemperatureC: index === 0 ? null : 18, maximumTemperatureC: 25,
}))

describe('DailyForecast', () => {
  it('shows seven local dates with conditions and minimum and maximum temperatures', () => {
    // When
    render(<DailyForecast days={days} />)
    // Then
    const forecast = screen.getByRole('list', { name: 'Previsão para sete dias' })
    expect(within(forecast).getAllByRole('listitem')).toHaveLength(7)
    expect(within(forecast).getAllByText('Chuva leve')).toHaveLength(7)
    expect(within(forecast).getByText('Indisponível')).toBeInTheDocument()
    expect(within(forecast).getAllByText('25°C')).toHaveLength(7)
  })
})
