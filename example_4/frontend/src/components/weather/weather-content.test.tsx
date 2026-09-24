import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WeatherContent } from './weather-content'

describe('WeatherContent', () => {
  it('shows loading, error, and empty states', () => {
    // Given
    const initialModel = { weather: null, error: null, isLoading: true }
    const { rerender } = render(<WeatherContent model={initialModel} />)
    // When
    rerender(<WeatherContent model={{ weather: null, error: 'City not found', isLoading: false }} />)
    // Then
    expect(screen.getByRole('alert')).toHaveTextContent('City not found')
    rerender(<WeatherContent model={{ weather: null, error: null, isLoading: false }} />)
    expect(screen.getByRole('status')).toHaveTextContent('Busque uma cidade')
  })
})
