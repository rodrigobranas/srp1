import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ThemeToggle } from './theme-toggle'

describe('ThemeToggle', () => {
  it('selects the dark theme and identifies the current selection', () => {
    // Given
    const onThemeChange = vi.fn()
    render(<ThemeToggle theme="light" onThemeChange={onThemeChange} />)
    // When
    fireEvent.click(screen.getByRole('button', { name: 'Tema escuro' }))
    // Then
    expect(onThemeChange).toHaveBeenCalledWith('dark')
    expect(screen.getByRole('button', { name: 'Tema claro' })).toHaveAttribute('aria-pressed', 'true')
  })
})
