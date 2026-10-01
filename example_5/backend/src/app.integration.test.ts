import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from './app';
import { createWeatherServiceStub } from './tests/weather-app-fixture';

describe('GET /health', () => {
  it('preserves the existing healthy status and timestamp response', async () => {
    // Given
    const app = createApp(createWeatherServiceStub());
    // When
    const response = await request(app).get('/health');
    // Then
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('healthy');
    expect(Number.isNaN(Date.parse(response.body.timestamp))).toBe(false);
  });
});
