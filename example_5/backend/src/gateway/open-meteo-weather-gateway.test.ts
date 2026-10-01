import { describe, expect, it } from 'vitest';
import { createForecastPayload } from '../tests/fixtures/open-meteo';
import { createFetchStub, createJsonResponse, getRequestedUrl } from '../tests/fake-fetch';
import { createOpenMeteoWeatherGateway, FORECAST_URL } from './open-meteo-weather-gateway';

const saoPaulo = { latitude: -23.5475, longitude: -46.6361 };

describe('createOpenMeteoWeatherGateway', () => {
  it('requests seven local days in Celsius and km/h for the selected coordinates', async () => {
    // Given
    const fetch = createFetchStub(createJsonResponse(createForecastPayload()));
    const gateway = createOpenMeteoWeatherGateway({ fetch });
    // When
    await gateway.getForecast(saoPaulo);
    // Then
    const url = getRequestedUrl(fetch);
    expect(`${url.origin}${url.pathname}`).toBe(FORECAST_URL);
    expect(Object.fromEntries(url.searchParams)).toEqual({
      latitude: '-23.5475',
      longitude: '-46.6361',
      current: 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code',
      daily: 'weather_code,temperature_2m_min,temperature_2m_max',
      forecast_days: '7',
      timezone: 'auto',
      temperature_unit: 'celsius',
      wind_speed_unit: 'kmh',
      timeformat: 'iso8601',
    });
  });
  it('describes the current weather in the timezone of the location', async () => {
    // Given
    const gateway = createOpenMeteoWeatherGateway({ fetch: createFetchStub(createJsonResponse(createForecastPayload())) });
    // When
    const forecast = await gateway.getForecast(saoPaulo);
    // Then
    expect(forecast.timezone).toBe('America/Sao_Paulo');
    expect(forecast.current).toEqual({
      time: '2026-10-01T09:15',
      temperatureC: 23.3,
      apparentTemperatureC: 23.7,
      relativeHumidityPercent: 69,
      windSpeedKmh: 14.4,
      weatherCode: 95,
    });
  });
  it('associates each daily condition and temperature range with its local date', async () => {
    // Given
    const gateway = createOpenMeteoWeatherGateway({ fetch: createFetchStub(createJsonResponse(createForecastPayload())) });
    // When
    const forecast = await gateway.getForecast(saoPaulo);
    // Then
    expect(forecast.daily).toHaveLength(7);
    expect(forecast.daily[0]).toEqual({ date: '2026-10-01', weatherCode: 95, minimumTemperatureC: 19.3, maximumTemperatureC: 25.8 });
    expect(forecast.daily[6]).toEqual({ date: '2026-10-07', weatherCode: 51, minimumTemperatureC: 17.2, maximumTemperatureC: 22.1 });
  });
  it('marks missing measurements as unavailable instead of failing the forecast', async () => {
    // Given
    const payload = createForecastPayload();
    const partialPayload = { ...payload, current: { time: payload.current.time, temperature_2m: null }, daily: { time: payload.daily.time } };
    const gateway = createOpenMeteoWeatherGateway({ fetch: createFetchStub(createJsonResponse(partialPayload)) });
    // When
    const forecast = await gateway.getForecast(saoPaulo);
    // Then
    expect(forecast.current).toEqual({ time: '2026-10-01T09:15', temperatureC: null, apparentTemperatureC: null, relativeHumidityPercent: null, windSpeedKmh: null, weatherCode: null });
    expect(forecast.daily[3]).toEqual({ date: '2026-10-04', weatherCode: null, minimumTemperatureC: null, maximumTemperatureC: null });
  });
});
