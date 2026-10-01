import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { parisMatches, weatherForecast } from '@/tests/weather-response-fixtures'
import { WeatherView } from './WeatherView'

describe('WeatherView city search', () => {
  it('searches the backend, distinguishes homonyms and renders the selected city forecast', async () => {
    // Given
    const fetchMock = vi.fn().mockResolvedValueOnce(Response.json({ locations: parisMatches })).mockResolvedValueOnce(Response.json(weatherForecast()))
    vi.stubGlobal('fetch', fetchMock)
    const user = userEvent.setup()
    render(<WeatherView geolocation={null} />)
    const search = screen.getByRole('textbox', { name: 'Cidade' })
    // When
    await user.type(search, 'Paris')
    await user.keyboard('{Enter}')
    await user.click(await screen.findByRole('button', { name: 'Consultar clima para Paris, Texas, Estados Unidos' }))
    // Then
    expect(await screen.findByRole('heading', { name: 'Paris, Estados Unidos' })).toBeInTheDocument()
    const announcement = screen.getByText('Clima e previsão carregados para Paris, Estados Unidos.', { selector: '[role="status"]' })
    expect(announcement).toHaveAttribute('aria-live', 'polite')
    expect(screen.getByText('Parcialmente nublado')).toBeInTheDocument()
    expect(screen.getByText('17,2°C')).toBeInTheDocument()
    const forecastDays = screen.getByRole('list', { name: 'Previsão para sete dias' })
    expect(within(forecastDays).getAllByRole('listitem')).toHaveLength(7)
    expect(forecastDays.className).toContain('lg:grid-cols-7')
    expect(screen.getByRole('link', { name: 'Open-Meteo' })).toBeInTheDocument()
    expect(fetchMock.mock.calls.map(([url]) => String(url))).toEqual([
      'http://localhost:3000/weather/locations?query=Paris', 'http://localhost:3000/weather',
    ])
    expect(fetchMock.mock.calls[1][1].body).toBe('{"latitude":33.6,"longitude":-95.5}')
  })
  it('announces a recoverable provider error and retries the same search', async () => {
    // Given
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(Response.json({ error: { code: 'WEATHER_SOURCE_TIMEOUT', message: 'private provider detail' } }, { status: 504 }))
      .mockResolvedValueOnce(Response.json({ locations: [parisMatches[0]] }))
      .mockResolvedValueOnce(Response.json(weatherForecast()))
    vi.stubGlobal('fetch', fetchMock)
    const user = userEvent.setup()
    render(<WeatherView geolocation={null} />)
    // When
    await user.type(screen.getByRole('textbox', { name: 'Cidade' }), 'Paris')
    await user.keyboard('{Enter}')
    const error = await screen.findByRole('alert')
    expect(error).toHaveTextContent('A consulta demorou demais. Tente novamente.')
    expect(error).not.toHaveTextContent('private provider detail')
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    // Then
    expect(await screen.findByRole('heading', { name: 'Paris, França' })).toBeInTheDocument()
  })
  it('explains an empty search result and leaves the city field available', async () => {
    // Given
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ locations: [] }))
    vi.stubGlobal('fetch', fetchMock)
    const user = userEvent.setup()
    render(<WeatherView geolocation={null} />)
    // When
    const search = screen.getByRole('textbox', { name: 'Cidade' })
    await user.type(search, 'Zzqville')
    await user.keyboard('{Enter}')
    // Then
    expect(await screen.findByRole('status')).toHaveTextContent('Nenhuma localidade encontrada')
    expect(search).toBeEnabled()
    expect(fetchMock).toHaveBeenCalledOnce()
  })
})
