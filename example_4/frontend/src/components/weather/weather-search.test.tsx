import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { WeatherSearch } from './weather-search'

describe('WeatherSearch', () => {
  it('submits the selected city', () => {
    // Given
    const onCityChange = vi.fn()
    const onSubmit = vi.fn()
    render(<WeatherSearch model={{ city: 'Salvador', isLoading: false, onCityChange, onSubmit }} />)
    // When
    fireEvent.change(screen.getByLabelText('Cidade'), { target: { value: 'Curitiba' } })
    fireEvent.submit(screen.getByRole('button', { name: 'Buscar clima' }))
    // Then
    expect(onCityChange).toHaveBeenCalledWith('Curitiba')
    expect(onSubmit).toHaveBeenCalledOnce()
  })
})
