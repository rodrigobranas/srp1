import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { WeatherView } from './WeatherView'

describe('WeatherView keyboard access', () => {
  it('offers skip navigation, labeled controls and visible keyboard focus', async () => {
    // Given
    const user = userEvent.setup()
    render(<WeatherView geolocation={null} />)
    // When
    await user.tab()
    // Then
    const skipLink = screen.getByRole('link', { name: 'Pular para busca' })
    expect(skipLink).toHaveFocus()
    // When
    await user.tab()
    // Then
    const search = screen.getByRole('textbox', { name: 'Cidade' })
    expect(search).toHaveFocus()
    expect(search.className).toContain('focus-visible:ring-4')
    expect(screen.getByRole('button', { name: 'Usar minha localização' })).toBeInTheDocument()
  })
})
