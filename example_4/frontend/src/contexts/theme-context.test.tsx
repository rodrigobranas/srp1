import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { useTheme } from '@/hooks/use-theme'
import { ThemeProvider } from './theme-provider'

function ThemeConsumer() {
  const { setTheme, theme } = useTheme()
  return <button onClick={() => setTheme('dark')}>{theme}</button>
}

describe('ThemeProvider', () => {
  afterEach(() => {
    cleanup()
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('uses the saved theme and synchronizes a newly selected theme', () => {
    // Given
    localStorage.setItem('weather-theme', 'light')
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>)
    // When
    fireEvent.click(screen.getByRole('button', { name: 'light' }))
    // Then
    expect(screen.getByRole('button', { name: 'dark' })).toBeInTheDocument()
    expect(document.documentElement).toHaveClass('dark')
    expect(localStorage.getItem('weather-theme')).toBe('dark')
  })

  it('restores the dark theme from the browser storage', () => {
    // Given
    localStorage.setItem('weather-theme', 'dark')
    // When
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>)
    // Then
    expect(screen.getByRole('button', { name: 'dark' })).toBeInTheDocument()
    expect(document.documentElement).toHaveClass('dark')
  })

  it('starts in dark mode when no preference was saved', () => {
    // Given
    // When
    render(<ThemeProvider><ThemeConsumer /></ThemeProvider>)
    // Then
    expect(screen.getByRole('button', { name: 'dark' })).toBeInTheDocument()
    expect(document.documentElement).toHaveClass('dark')
  })
})
