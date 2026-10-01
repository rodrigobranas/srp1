import { describe, expect, it } from 'vitest';
import { parseCoordinates, parseLocationQuery } from './weather-validation';

describe('parseLocationQuery', () => {
  it.each(['', '   ', 'S', '  S  ', 'x'.repeat(101), undefined, ['Paris']])(
    'rejects the search %j because a city name between 2 and 100 characters is required',
    (query) => {
      // Given
      const search = () => parseLocationQuery(query);
      // When / Then
      expect(search).toThrow(expect.objectContaining({ code: 'INVALID_QUERY', status: 400 }));
    },
  );
  it('accepts a city name with accents after removing surrounding spaces', () => {
    // Given
    const query = '  São Paulo  ';
    // When
    const parsedQuery = parseLocationQuery(query);
    // Then
    expect(parsedQuery).toBe('São Paulo');
  });
  it.each(['Rio', 'SP', 'x'.repeat(100)])('accepts the search %j within the length limits', (query) => {
    // When
    const parsedQuery = parseLocationQuery(query);
    // Then
    expect(parsedQuery).toBe(query);
  });
});

describe('parseCoordinates', () => {
  it.each([
    { latitude: -90, longitude: -180 },
    { latitude: 90, longitude: 180 },
    { latitude: -23.5475, longitude: -46.6361 },
  ])('accepts coordinates within the globe limits: %j', (input) => {
    // When
    const coordinates = parseCoordinates(input);
    // Then
    expect(coordinates).toEqual(input);
  });
  it.each([
    [{ latitude: -123, longitude: -46.6 }, 'Latitude must be a finite number between -90 and 90.'],
    [{ latitude: 90.0001, longitude: 0 }, 'Latitude must be a finite number between -90 and 90.'],
    [{ latitude: '-23.5', longitude: -46.6 }, 'Latitude must be a finite number between -90 and 90.'],
    [{ latitude: Number.NaN, longitude: 0 }, 'Latitude must be a finite number between -90 and 90.'],
    [{ longitude: 0 }, 'Latitude must be a finite number between -90 and 90.'],
    [{ latitude: 0, longitude: 180.5 }, 'Longitude must be a finite number between -180 and 180.'],
    [{ latitude: 0, longitude: Number.POSITIVE_INFINITY }, 'Longitude must be a finite number between -180 and 180.'],
    [null, 'Latitude must be a finite number between -90 and 90.'],
  ])('rejects the location %j because it is outside the globe or not numeric', (input, message) => {
    // Given
    const parse = () => parseCoordinates(input);
    // When / Then
    expect(parse).toThrow(expect.objectContaining({ code: 'INVALID_COORDINATES', status: 400, message }));
  });
});
