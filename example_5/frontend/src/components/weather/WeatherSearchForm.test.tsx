import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { WeatherSearchForm } from './WeatherSearchForm'

describe('WeatherSearchForm', () => {
  it('submits an accessible city search with the Enter key', async () => {
    // Given
    const onSearch = vi.fn()
    render(<WeatherSearchForm value="Lisboa" isLoading={false} feedbackId="weather-feedback" onChange={vi.fn()} onSearch={onSearch} />)
    // When
    await userEvent.type(screen.getByRole('textbox', { name: 'Cidade' }), '{Enter}')
    // Then
    expect(onSearch).toHaveBeenCalledOnce()
  })
  it('updates the query and disables the submit action while loading', () => {
    // Given
    const onChange = vi.fn()
    render(<WeatherSearchForm value="" isLoading onChange={onChange} feedbackId="weather-feedback" onSearch={vi.fn()} />)
    // When
    fireEvent.change(screen.getByRole('textbox', { name: 'Cidade' }), { target: { value: 'Recife' } })
    // Then
    expect(onChange).toHaveBeenCalledWith('Recife')
    expect(screen.getByRole('button', { name: 'Buscando…' })).toBeDisabled()
  })
  it('submits the query when the search button is activated', async () => {
    // Given
    const onSearch = vi.fn()
    const user = userEvent.setup()
    render(<WeatherSearchForm value="Brasília" isLoading={false} feedbackId="weather-feedback" onChange={vi.fn()} onSearch={onSearch} />)
    // When
    await user.click(screen.getByRole('button', { name: 'Buscar clima' }))
    // Then
    expect(onSearch).toHaveBeenCalledOnce()
  })
})
