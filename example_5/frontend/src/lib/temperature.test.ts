import { describe, expect, it } from 'vitest'
import { formatTemperature } from './temperature'

describe('formatTemperature', () => {
  it('converts Celsius to Fahrenheit using the exact scale relationship', () => {
    // Given
    const values = [0, 100, 23.4]
    // When
    const formattedValues = values.map((value) => formatTemperature(value, 'fahrenheit'))
    // Then
    expect(formattedValues).toEqual(['32°F', '212°F', '74,1°F'])
  })
  it('formats Celsius and Fahrenheit in Brazilian Portuguese without trailing zeros', () => {
    // Given
    const values = [23.4, 25]
    // When
    const formattedValues = values.map((value) => formatTemperature(value, 'celsius'))
    // Then
    expect(formattedValues).toEqual(['23,4°C', '25°C'])
  })
  it('preserves unavailable and non-finite source values', () => {
    // Given
    const values = [null, Number.NaN, Number.POSITIVE_INFINITY]
    // When
    const formattedValues = values.map((value) => formatTemperature(value, 'fahrenheit'))
    // Then
    expect(formattedValues).toEqual(['Indisponível', 'Indisponível', 'Indisponível'])
  })
})
