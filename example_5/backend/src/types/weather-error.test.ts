import { describe, expect, it } from 'vitest';
import { WeatherError } from './weather-error';

describe('WeatherError', () => {
  it.each([
    ['INVALID_QUERY', 400],
    ['INVALID_COORDINATES', 400],
    ['WEATHER_SOURCE_ERROR', 502],
    ['WEATHER_SOURCE_TIMEOUT', 504],
  ] as const)('answers %s with the HTTP status %i', (code, status) => {
    // When
    const error = new WeatherError(code, 'Safe message.');
    // Then
    expect(error).toBeInstanceOf(Error);
    expect(error).toMatchObject({ name: 'WeatherError', code, status, message: 'Safe message.' });
  });
  it('keeps the original provider failure only as an internal cause', () => {
    // Given
    const providerFailure = new Error('upstream body');
    // When
    const error = new WeatherError('WEATHER_SOURCE_ERROR', 'Safe message.', { cause: providerFailure });
    // Then
    expect(error.cause).toBe(providerFailure);
    expect(error.message).toBe('Safe message.');
  });
});
