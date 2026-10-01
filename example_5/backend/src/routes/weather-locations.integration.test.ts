import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { createApp } from '../app';
import { WeatherError } from '../types/weather-error';
import { createWeatherServiceStub, sampleLocation } from '../tests/weather-app-fixture';

describe('GET /weather/locations', () => {
  it('returns selectable locations from the injected weather service', async () => {
    // Given
    const service = createWeatherServiceStub();
    // When
    const response = await request(createApp(service)).get('/weather/locations?query=%20S%C3%A3o%20Paulo%20');
    // Then
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ locations: [sampleLocation] });
    expect(service.searchLocations).toHaveBeenCalledWith('São Paulo');
  });
  it('returns an empty list when the search has no matches', async () => {
    // Given
    const service = createWeatherServiceStub({ searchLocations: vi.fn(async () => []) });
    // When
    const response = await request(createApp(service)).get('/weather/locations?query=Zzqville');
    // Then
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ locations: [] });
  });
  it('rejects an invalid query with a stable error envelope', async () => {
    // Given
    const service = createWeatherServiceStub();
    // When
    const response = await request(createApp(service)).get('/weather/locations?query=%20');
    // Then
    expect(response.status).toBe(400);
    expect(response.body.error).toMatchObject({ code: 'INVALID_QUERY' });
    expect(service.searchLocations).not.toHaveBeenCalled();
  });
  it('hides provider details when geocoding fails', async () => {
    // Given
    const service = createWeatherServiceStub({
      searchLocations: vi.fn().mockRejectedValue(new WeatherError('WEATHER_SOURCE_ERROR', 'Location search is temporarily unavailable.', { cause: new Error('private response') })),
    });
    // When
    const response = await request(createApp(service)).get('/weather/locations?query=Paris');
    // Then
    expect(response.status).toBe(502);
    expect(JSON.stringify(response.body)).not.toContain('private response');
  });
});
