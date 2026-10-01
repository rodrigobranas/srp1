import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ThemeToggle } from './ThemeToggle'

describe('ThemeToggle', () => {
  it('keeps a stable accessible name and exposes the active theme', async () => {
    // Given
    const user = userEvent.setup()
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>)
    const toggle = screen.getByRole('button', { name: 'Alternar tema' })
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
    // When
    await user.click(toggle)
    // Then
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
  })
  it('supports Enter and Space while retaining keyboard focus', async () => {
    // Given
    const user = userEvent.setup()
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>)
    await user.tab()
    const toggle = screen.getByRole('button', { name: 'Alternar tema' })
    // When
    await user.keyboard('{Enter}')
    // Then
    expect(toggle).toHaveFocus()
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
    // When
    await user.keyboard(' ')
    // Then
    expect(toggle).toHaveFocus()
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
  })
})
