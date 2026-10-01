import { describe, expect, it } from 'vitest'
import { getWeatherDescription } from './weather-codes'

describe('getWeatherDescription', () => {
  it('translates recognized WMO weather codes to Brazilian Portuguese', () => {
    // Given
    const codes = [0, 2, 61, 95]
    // When
    const descriptions = codes.map(getWeatherDescription)
    // Then
    expect(descriptions).toEqual(['Céu limpo', 'Parcialmente nublado', 'Chuva leve', 'Trovoada'])
  })
  it('provides readable fallbacks for missing and unknown codes', () => {
    // When
    const descriptions = [getWeatherDescription(null), getWeatherDescription(42)]
    // Then
    expect(descriptions).toEqual(['Condição indisponível', 'Condição do tempo desconhecida'])
  })
})
