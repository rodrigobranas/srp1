import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('opens the weather panel as the application view', () => {
    // When
    render(<App />)
    // Then
    expect(screen.getByRole('heading', { name: 'O clima para os seus planos' })).toBeInTheDocument()
  })
})
