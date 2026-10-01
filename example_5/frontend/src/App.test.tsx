import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'
import { ThemeProvider } from './contexts/ThemeContext'

describe('App', () => {
  it('opens the weather panel as the application view', () => {
    // When
    render(<ThemeProvider><App /></ThemeProvider>)
    // Then
    expect(screen.getByRole('heading', { name: 'O clima para os seus planos' })).toBeInTheDocument()
  })
})
