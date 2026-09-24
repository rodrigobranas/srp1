import { describe, expect, it, vi } from 'vitest'
import { drawAtmosphereField } from './draw-atmosphere-field'

function createContext() {
  const gradient = { addColorStop: vi.fn() }
  return {
    arc: vi.fn(), beginPath: vi.fn(), canvas: { height: 900, width: 1440 }, clearRect: vi.fn(), closePath: vi.fn(), createRadialGradient: vi.fn(() => gradient), ellipse: vi.fn(), fill: vi.fn(), fillRect: vi.fn(), moveTo: vi.fn(), restore: vi.fn(), rotate: vi.fn(), save: vi.fn(), stroke: vi.fn(), translate: vi.fn(),
  } as unknown as CanvasRenderingContext2D
}

describe('drawAtmosphereField', () => {
  it('draws the atmospheric bloom and contour field', () => {
    // Given
    const context = createContext()
    // When
    drawAtmosphereField({ context, isScanning: false, theme: 'dark', time: 0 })
    // Then
    expect(context.createRadialGradient).toHaveBeenCalledOnce()
    expect(context.ellipse).toHaveBeenCalledTimes(5)
    expect(context.fill).not.toHaveBeenCalled()
  })

  it('adds a scan sweep while a lookup is active', () => {
    // Given
    const context = createContext()
    // When
    drawAtmosphereField({ context, isScanning: true, theme: 'light', time: 300 })
    // Then
    expect(context.save).toHaveBeenCalledOnce()
    expect(context.arc).toHaveBeenCalledOnce()
    expect(context.fill).toHaveBeenCalledOnce()
  })
})
