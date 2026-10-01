import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useTheme } from '@/hooks/use-theme'
import { ThemeProvider } from './ThemeContext'

function ThemeReader() {
  const { theme, toggleTheme } = useTheme()
  return <button type="button" onClick={toggleTheme}>{theme}</button>
}

describe('ThemeProvider', () => {
  it('updates the page theme and stores the manual choice for this tab', () => {
    // Given
    document.head.innerHTML = '<meta name="theme-color" content="#09090b">'
    render(<ThemeProvider><ThemeReader /></ThemeProvider>)
    expect(screen.getByRole('button', { name: 'dark' })).toBeInTheDocument()
    // When
    fireEvent.click(screen.getByRole('button', { name: 'dark' }))
    // Then
    expect(screen.getByRole('button', { name: 'light' })).toBeInTheDocument()
    expect(document.documentElement).not.toHaveClass('dark')
    expect(window.sessionStorage.getItem('weather-dashboard-theme')).toBe('light')
    expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute('content', '#f8fafc')
  })
  it('requires consumers to be rendered inside the provider', () => {
    // When / Then
    expect(() => render(<ThemeReader />)).toThrow('useTheme must be used within a ThemeProvider')
  })
})
