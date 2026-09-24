import { render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AtmosphereCanvas } from './atmosphere-canvas'

const originalContext = HTMLCanvasElement.prototype.getContext

describe('AtmosphereCanvas', () => {
  afterEach(() => {
    HTMLCanvasElement.prototype.getContext = originalContext
    vi.restoreAllMocks()
  })

  it('renders a decorative canvas for the atmospheric field', () => {
    // Given
    HTMLCanvasElement.prototype.getContext = vi.fn(() => null)
    // When
    const { container } = render(<AtmosphereCanvas isScanning={false} theme="dark" />)
    // Then
    expect(container.querySelector('canvas')).toHaveAttribute('aria-hidden', 'true')
  })
})
