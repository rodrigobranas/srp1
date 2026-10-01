import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { createApp } from '../app';
import { WeatherError } from '../types/weather-error';
import { createWeatherServiceStub, sampleForecast } from '../tests/weather-app-fixture';

describe('POST /weather', () => {
  it('returns the seven-day forecast without caching the coordinates result', async () => {
    // Given
    const service = createWeatherServiceStub();
    // When
    const response = await request(createApp(service)).post('/weather').send({ latitude: -23.5, longitude: -46.6 });
    // Then
    expect(response.status).toBe(200);
    expect(response.headers['cache-control']).toBe('no-store');
    expect(response.body).toEqual(sampleForecast());
    expect(response.body.daily).toHaveLength(7);
    expect(service.getForecast).toHaveBeenCalledWith({ latitude: -23.5, longitude: -46.6 });
  });
  it('rejects invalid coordinates and malformed JSON with safe messages', async () => {
    // Given
    const service = createWeatherServiceStub();
    const app = createApp(service);
    // When
    const invalidCoordinates = await request(app).post('/weather').send({ latitude: -123, longitude: -46.6 });
    const malformedBody = await request(app).post('/weather').set('Content-Type', 'application/json').send('{');
    // Then
    expect(invalidCoordinates.status).toBe(400);
    expect(invalidCoordinates.body.error.code).toBe('INVALID_COORDINATES');
    expect(malformedBody.status).toBe(400);
    expect(malformedBody.body.error.code).toBe('INVALID_COORDINATES');
    expect(malformedBody.headers['cache-control']).toBe('no-store');
    expect(service.getForecast).not.toHaveBeenCalled();
  });
  it.each([
    ['WEATHER_SOURCE_ERROR', 502],
    ['WEATHER_SOURCE_TIMEOUT', 504],
  ] as const)('maps %s to a stable response without leaking provider payload', async (code, status) => {
    // Given
    const service = createWeatherServiceStub({
      getForecast: vi.fn().mockRejectedValue(new WeatherError(code, 'The weather provider did not respond in time.', { cause: new Error('secret coordinates payload') })),
    });
    // When
    const response = await request(createApp(service)).post('/weather').send({ latitude: 0, longitude: 0 });
    // Then
    expect(response.status).toBe(status);
    expect(response.body.error.code).toBe(code);
    expect(JSON.stringify(response.body)).not.toContain('secret coordinates payload');
  });
});

describe('weather request observability', () => {
  it('logs route duration and result without query or coordinate data', async () => {
    // Given
    const logger = vi.fn();
    const app = createApp(createWeatherServiceStub(), logger);
    // When
    await request(app).get('/weather/locations?query=PrivateCity');
    await request(app).post('/weather').send({ latitude: 12.34, longitude: -56.78 });
    // Then
    const events = logger.mock.calls.map(([entry]) => JSON.parse(entry as string));
    expect(events).toHaveLength(4);
    expect(events).toContainEqual(expect.objectContaining({ event: 'request_started', route: '/weather/locations', result: 'pending' }));
    expect(events).toContainEqual(expect.objectContaining({ event: 'request_finished', route: '/weather', durationMs: expect.any(Number), result: 'success' }));
    expect(JSON.stringify(events)).not.toMatch(/PrivateCity|12\.34|-56\.78/);
  });
});
