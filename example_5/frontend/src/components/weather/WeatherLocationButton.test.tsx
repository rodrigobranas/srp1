import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { WeatherLocationButton } from './WeatherLocationButton'

describe('WeatherLocationButton', () => {
  it('requests location only when the visitor activates the button', () => {
    // Given
    const onLocate = vi.fn()
    render(<WeatherLocationButton isLoading={false} onLocate={onLocate} />)
    // When
    fireEvent.click(screen.getByRole('button', { name: 'Usar minha localização' }))
    // Then
    expect(onLocate).toHaveBeenCalledOnce()
  })
  it('disables the location action while another weather request is active', () => {
    // When
    render(<WeatherLocationButton isLoading={false} isDisabled onLocate={vi.fn()} />)
    // Then
    expect(screen.getByRole('button', { name: 'Usar minha localização' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Usar minha localização' }).className).toContain('bg-secondary')
  })
})
