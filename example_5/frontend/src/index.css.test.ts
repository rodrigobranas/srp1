import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const stylesheet = readFileSync('src/index.css', 'utf8')

describe('theme text colors', () => {
  it('keeps muted text at WCAG AA contrast in both themes', () => {
    // Given
    const lightRatio = readThemeContrast(':root')
    const darkRatio = readThemeContrast('.dark')
    // Then
    expect(lightRatio).toBeGreaterThanOrEqual(4.5)
    expect(darkRatio).toBeGreaterThanOrEqual(4.5)
  })
})

function readThemeContrast(selector: string): number {
  const block = stylesheet.match(new RegExp(`${selector}\\s*\\{([^}]+)\\}`))?.[1] ?? ''
  const foreground = block.match(/--muted-foreground:\s*([^;]+)/)?.[1] ?? ''
  const background = block.match(/--background:\s*([^;]+)/)?.[1] ?? ''
  return contrastRatio(hslToRgb(foreground), hslToRgb(background))
}

function hslToRgb(value: string): number[] {
  const [hue, saturation, lightness] = value.match(/[\d.]+/g)?.map(Number) ?? []
  const chroma = (1 - Math.abs(2 * lightness / 100 - 1)) * saturation / 100
  const x = chroma * (1 - Math.abs((hue / 60) % 2 - 1))
  const components = hueComponents(hue / 60, chroma, x)
  const offset = lightness / 100 - chroma / 2
  return components.map((channel) => (channel + offset) * 255)
}

function hueComponents(sector: number, chroma: number, x: number): number[] {
  if (sector < 1) return [chroma, x, 0]
  if (sector < 2) return [x, chroma, 0]
  if (sector < 3) return [0, chroma, x]
  if (sector < 4) return [0, x, chroma]
  if (sector < 5) return [x, 0, chroma]
  return [chroma, 0, x]
}

function linearize(channel: number): number {
  const value = channel / 255
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
}

function contrastRatio(foreground: number[], background: number[]): number {
  const luminance = (channels: number[]) => 0.2126 * linearize(channels[0]) + 0.7152 * linearize(channels[1]) + 0.0722 * linearize(channels[2])
  const first = luminance(foreground)
  const second = luminance(background)
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05)
}
