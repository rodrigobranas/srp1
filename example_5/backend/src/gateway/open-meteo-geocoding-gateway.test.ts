import { describe, expect, it } from 'vitest';
import { createGeocodingPayload } from '../tests/fixtures/open-meteo';
import { createFetchStub, createJsonResponse, getRequestedUrl } from '../tests/fake-fetch';
import { createOpenMeteoGeocodingGateway, GEOCODING_URL } from './open-meteo-geocoding-gateway';

describe('createOpenMeteoGeocodingGateway', () => {
  it('searches up to ten Portuguese matches without interpolating the city name in the URL', async () => {
    // Given
    const fetch = createFetchStub(createJsonResponse(createGeocodingPayload()));
    const gateway = createOpenMeteoGeocodingGateway({ fetch });
    // When
    await gateway.searchLocations('São Paulo&count=100');
    // Then
    const url = getRequestedUrl(fetch);
    expect(`${url.origin}${url.pathname}`).toBe(GEOCODING_URL);
    expect(Object.fromEntries(url.searchParams)).toEqual({
      name: 'São Paulo&count=100',
      count: '10',
      language: 'pt',
      format: 'json',
    });
  });
  it('identifies homonymous cities by region and country', async () => {
    // Given
    const fetch = createFetchStub(createJsonResponse(createGeocodingPayload()));
    const gateway = createOpenMeteoGeocodingGateway({ fetch });
    // When
    const locations = await gateway.searchLocations('Paris');
    // Then
    expect(locations).toEqual([
      { id: 2988507, name: 'Paris', region: 'Île-de-France', country: 'França', countryCode: 'FR', latitude: 48.85341, longitude: 2.3488, timezone: 'Europe/Paris' },
      { id: 4717560, name: 'Paris', region: 'Texas', country: 'Estados Unidos', countryCode: 'US', latitude: 33.66094, longitude: -95.55551, timezone: 'America/Chicago' },
    ]);
  });
  it('keeps a match whose region, country and timezone are unknown as null', async () => {
    // Given
    const payload = { results: [{ id: 7, name: 'Vila Nova', latitude: -10.5, longitude: -37.5, admin1: '' }] };
    const gateway = createOpenMeteoGeocodingGateway({ fetch: createFetchStub(createJsonResponse(payload)) });
    // When
    const locations = await gateway.searchLocations('Vila Nova');
    // Then
    expect(locations).toEqual([
      { id: 7, name: 'Vila Nova', region: null, country: null, countryCode: null, latitude: -10.5, longitude: -37.5, timezone: null },
    ]);
  });
  it('returns no locations when the provider finds no city', async () => {
    // Given
    const fetch = createFetchStub(createJsonResponse({ generationtime_ms: 0.12 }));
    const gateway = createOpenMeteoGeocodingGateway({ fetch });
    // When
    const locations = await gateway.searchLocations('Zzqville');
    // Then
    expect(locations).toEqual([]);
  });
  it.each([
    ['a non-object payload', ['Paris']],
    ['results that are not a list', { results: { id: 1 } }],
    ['a match without coordinates', { results: [{ id: 1, name: 'Paris' }] }],
    ['a match that is not an object', { results: ['Paris'] }],
  ])('treats %s as an unavailable location search', async (_scenario, payload) => {
    // Given
    const gateway = createOpenMeteoGeocodingGateway({ fetch: createFetchStub(createJsonResponse(payload)) });
    // When
    const search = gateway.searchLocations('Paris');
    // Then
    await expect(search).rejects.toMatchObject({
      code: 'WEATHER_SOURCE_ERROR',
      status: 502,
      message: 'Location search is temporarily unavailable.',
    });
  });
});
