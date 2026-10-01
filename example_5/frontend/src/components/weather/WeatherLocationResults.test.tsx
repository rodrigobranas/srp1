import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { WeatherLocation } from '@/types/weather'
import { WeatherLocationResults } from './WeatherLocationResults'

const locations: WeatherLocation[] = [
  { id: 1, name: 'Paris', region: 'Île-de-France', country: 'França', countryCode: 'FR', latitude: 48.8, longitude: 2.3, timezone: 'Europe/Paris' },
  { id: 2, name: 'Paris', region: 'Texas', country: 'Estados Unidos', countryCode: 'US', latitude: 33.6, longitude: -95.5, timezone: 'America/Chicago' },
]

describe('WeatherLocationResults', () => {
  it('distinguishes homonymous cities by region and country', () => {
    // When
    render(<WeatherLocationResults locations={locations} selectedLocationId={null} onSelect={vi.fn()} />)
    // Then
    expect(screen.getByRole('button', { name: 'Consultar clima para Paris, Île-de-France, França' }).className).toContain('bg-card')
    expect(screen.getByRole('button', { name: 'Consultar clima para Paris, Texas, Estados Unidos' })).toBeInTheDocument()
  })
  it('returns the selected location when its accessible option is activated', () => {
    // Given
    const onSelect = vi.fn()
    render(<WeatherLocationResults locations={locations} selectedLocationId={null} onSelect={onSelect} />)
    // When
    fireEvent.click(screen.getByRole('button', { name: 'Consultar clima para Paris, Texas, Estados Unidos' }))
    // Then
    expect(onSelect).toHaveBeenCalledWith(locations[1])
  })
  it('does not render an empty result list', () => {
    // When
    const { container } = render(<WeatherLocationResults locations={[]} selectedLocationId={null} onSelect={vi.fn()} />)
    // Then
    expect(container).toBeEmptyDOMElement()
  })
  it('explains that a region is unavailable when the provider omitted administrative details', () => {
    // Given
    const location = { ...locations[0], region: null, country: null }
    render(<WeatherLocationResults locations={[location]} selectedLocationId={null} onSelect={vi.fn()} />)
    // Then
    expect(screen.getByRole('button', { name: 'Consultar clima para Paris, Região não informada' })).toBeInTheDocument()
  })
})
