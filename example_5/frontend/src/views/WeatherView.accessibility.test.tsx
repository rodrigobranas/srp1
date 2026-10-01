import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { WeatherView } from './WeatherView'
import { ThemeProvider } from '@/contexts/ThemeContext'

describe('WeatherView keyboard access', () => {
  it('offers skip navigation, labeled controls and visible keyboard focus', async () => {
    // Given
    const user = userEvent.setup()
    render(<ThemeProvider><WeatherView geolocation={null} /></ThemeProvider>)
    // When
    await user.tab()
    // Then
    const skipLink = screen.getByRole('link', { name: 'Pular para busca' })
    expect(skipLink).toHaveFocus()
    // When
    await user.tab()
    // Then
    const themeToggle = screen.getByRole('button', { name: 'Alternar tema' })
    expect(themeToggle).toHaveFocus()
    expect(themeToggle.className).toContain('focus-visible:outline-4')
    // When
    await user.tab()
    // Then
    const search = screen.getByRole('textbox', { name: 'Cidade' })
    expect(search).toHaveFocus()
    expect(search.className).toContain('focus-visible:ring-4')
    expect(screen.getByRole('button', { name: 'Usar minha localização' })).toBeInTheDocument()
  })
})
