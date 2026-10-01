import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('renders the selected variant and size and respects its disabled state', () => {
    // Given
    const onClick = vi.fn()
    render(<Button variant="destructive" size="sm" disabled onClick={onClick}>Remover</Button>)
    // When
    fireEvent.click(screen.getByRole('button', { name: 'Remover' }))
    // Then
    expect(screen.getByRole('button', { name: 'Remover' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Remover' }).className).toContain('bg-destructive')
    expect(onClick).not.toHaveBeenCalled()
  })
})
