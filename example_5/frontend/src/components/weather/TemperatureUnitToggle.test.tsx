import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TemperatureUnitToggle } from './TemperatureUnitToggle'

describe('TemperatureUnitToggle', () => {
  it('announces the active and destination units with the pressed state', () => {
    // Given
    render(<TemperatureUnitToggle unit="fahrenheit" onToggle={vi.fn()} />)
    // When
    const button = screen.getByRole('button', { name: 'Temperatura em Fahrenheit. Alternar para Celsius' })
    // Then
    expect(button).toHaveTextContent('°F')
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(button.className).toContain('focus-visible:ring-2')
  })
  it('alternates from the keyboard with Enter and Space', async () => {
    // Given
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(<TemperatureUnitToggle unit="celsius" onToggle={onToggle} />)
    // When
    await user.tab()
    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    // Then
    expect(screen.getByRole('button', { name: 'Temperatura em Celsius. Alternar para Fahrenheit' })).toHaveFocus()
    expect(onToggle).toHaveBeenCalledTimes(2)
  })
})
