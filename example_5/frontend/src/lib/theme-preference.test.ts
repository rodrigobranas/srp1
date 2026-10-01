import { beforeEach, describe, expect, it, vi } from 'vitest'
import { applyTheme, getInitialTheme, saveTheme } from './theme-preference'

describe('theme preference for the current tab', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    vi.spyOn(performance, 'getEntriesByType').mockReturnValue([])
    document.head.innerHTML = '<meta name="theme-color" content="#f8fafc">'
    document.documentElement.classList.remove('dark')
  })
  it('starts dark when a new navigation contains a copied preference', () => {
    // Given
    window.sessionStorage.setItem('weather-dashboard-theme', 'light')
    vi.mocked(performance.getEntriesByType).mockReturnValue([{ type: 'navigate' } as PerformanceNavigationTiming])
    // When
    const theme = getInitialTheme()
    // Then
    expect(theme).toBe('dark')
  })
  it('restores a valid choice after reloading the same tab', () => {
    // Given
    window.sessionStorage.setItem('weather-dashboard-theme', 'light')
    vi.mocked(performance.getEntriesByType).mockReturnValue([{ type: 'reload' } as PerformanceNavigationTiming])
    // When
    const theme = getInitialTheme()
    // Then
    expect(theme).toBe('light')
  })
  it('uses dark when the saved choice is invalid or storage is unavailable', () => {
    // Given
    vi.mocked(performance.getEntriesByType).mockReturnValue([{ type: 'reload' } as PerformanceNavigationTiming])
    window.sessionStorage.setItem('weather-dashboard-theme', 'sepia')
    // When / Then
    expect(getInitialTheme()).toBe('dark')
    vi.spyOn(window, 'sessionStorage', 'get').mockImplementation(() => { throw new Error('Storage is blocked') })
    expect(getInitialTheme()).toBe('dark')
    expect(() => saveTheme('light')).not.toThrow()
  })
  it('applies the root class and browser theme color for either choice', () => {
    // When
    applyTheme('dark')
    // Then
    expect(document.documentElement).toHaveClass('dark')
    expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute('content', '#09090b')
    // When
    applyTheme('light')
    // Then
    expect(document.documentElement).not.toHaveClass('dark')
    expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute('content', '#f8fafc')
  })
})
