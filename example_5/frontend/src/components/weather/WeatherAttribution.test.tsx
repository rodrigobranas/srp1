import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WeatherAttribution } from './WeatherAttribution'

describe('WeatherAttribution', () => {
  it('credits Open-Meteo and GeoNames with links to their sites', () => {
    // When
    render(<WeatherAttribution />)
    // Then
    expect(screen.getByRole('link', { name: 'Open-Meteo' })).toHaveAttribute('href', 'https://open-meteo.com/')
    expect(screen.getByRole('link', { name: 'GeoNames' })).toHaveAttribute('href', 'https://www.geonames.org/')
  })
})
