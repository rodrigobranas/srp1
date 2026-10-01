import { describe, expect, it } from 'vitest';
import { createFetchStub, createUnansweredFetch } from '../tests/fake-fetch';
import { createOpenMeteoWeatherGateway } from './open-meteo-weather-gateway';

const failureMessage = 'The weather provider is temporarily unavailable.';

describe('createOpenMeteoWeatherGateway failures', () => {
  it('reports an unavailable forecast without exposing the provider body', async () => {
    // Given
    const reason = 'Daily data is not available for this model';
    const fetch = createFetchStub(new Response(JSON.stringify({ error: true, reason }), { status: 500 }));
    const gateway = createOpenMeteoWeatherGateway({ fetch });
    // When
    const failure = await gateway.getForecast({ latitude: 0, longitude: 0 }).catch((error: unknown) => error);
    // Then
    expect(failure).toMatchObject({ code: 'WEATHER_SOURCE_ERROR', status: 502, message: failureMessage });
    expect(String(failure)).not.toContain(reason);
  });
  it('reports a forecast timeout when the provider stays silent', async () => {
    // Given
    const gateway = createOpenMeteoWeatherGateway({ fetch: createUnansweredFetch(), timeoutMs: 5 });
    // When
    const forecast = gateway.getForecast({ latitude: 0, longitude: 0 });
    // Then
    await expect(forecast).rejects.toMatchObject({
      code: 'WEATHER_SOURCE_TIMEOUT',
      status: 504,
      message: 'The weather provider did not respond in time.',
    });
  });
});
