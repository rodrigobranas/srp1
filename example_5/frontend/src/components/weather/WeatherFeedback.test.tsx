import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { WeatherFeedback } from './WeatherFeedback'

describe('WeatherFeedback', () => {
  it('keeps a live feedback target available before a message exists', () => {
    // When
    render(<WeatherFeedback state="idle" />)
    // Then
    expect(document.getElementById('weather-feedback')).toHaveAttribute('aria-live', 'polite')
  })
  it('announces loading politely and validation errors urgently', () => {
    // When
    const { rerender } = render(<WeatherFeedback state="loading" />)
    // Then
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true')
    // When
    rerender(<WeatherFeedback state="invalid" />)
    // Then
    expect(screen.getByRole('alert')).toHaveTextContent('Informe o nome de uma cidade')
    expect(screen.getByRole('alert').className).toContain('bg-destructive/10')
  })
  it('offers an explicit retry for recoverable service errors', () => {
    // Given
    const onRetry = vi.fn()
    render(<WeatherFeedback state="error" onRetry={onRetry} />)
    // When
    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    // Then
    expect(onRetry).toHaveBeenCalledOnce()
  })
})
