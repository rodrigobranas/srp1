import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { parisMatches, weatherForecast } from '@/tests/weather-response-fixtures'
import { WeatherView } from './WeatherView'

describe('WeatherView theme toggle', () => {
  it('changes the accessible state by keyboard without restarting the weather search', async () => {
    // Given
    const fetchMock = vi.fn().mockResolvedValueOnce(Response.json({ locations: parisMatches })).mockResolvedValueOnce(Response.json(weatherForecast()))
    vi.stubGlobal('fetch', fetchMock)
    const user = userEvent.setup()
    render(<ThemeProvider><WeatherView geolocation={null} /></ThemeProvider>)
    await user.type(screen.getByRole('textbox', { name: 'Cidade' }), 'Paris')
    await user.keyboard('{Enter}')
    await user.click(await screen.findByRole('button', { name: 'Consultar clima para Paris, Texas, Estados Unidos' }))
    const toggle = screen.getByRole('button', { name: 'Alternar tema' })
    expect(await screen.findByRole('heading', { name: 'Paris, Estados Unidos' })).toBeInTheDocument()
    // When
    toggle.focus()
    expect(toggle).toHaveFocus()
    await user.keyboard('{Enter}')
    // Then
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('heading', { name: 'Paris, Estados Unidos' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Cidade' })).toHaveValue('Paris')
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
  it('keeps the feedback and form distinguishable in either theme', async () => {
    // Given
    const user = userEvent.setup()
    render(<ThemeProvider><WeatherView geolocation={null} /></ThemeProvider>)
    await user.click(screen.getByRole('button', { name: 'Buscar clima' }))
    const feedback = screen.getByRole('alert')
    const search = screen.getByRole('textbox', { name: 'Cidade' })
    expect(feedback).toHaveTextContent('Informe o nome de uma cidade')
    expect(feedback.className).toContain('bg-destructive/10')
    expect(search.className).toContain('bg-background')
    // When
    await user.click(screen.getByRole('button', { name: 'Alternar tema' }))
    // Then
    expect(document.documentElement).not.toHaveClass('dark')
    expect(feedback).toHaveTextContent('Informe o nome de uma cidade')
    expect(search).toHaveValue('')
  })
})
