import { describe, expect, it } from 'vitest';
import { createForecastPayload } from '../tests/fixtures/open-meteo';
import { parseForecast } from './open-meteo-forecast-parser';

const failureMessage = 'The weather provider is temporarily unavailable.';

function withoutField(field: 'timezone' | 'current' | 'daily') {
  const payload: Record<string, unknown> = createForecastPayload();
  delete payload[field];
  return payload;
}

function withDates(dates: unknown[]) {
  const payload = createForecastPayload();
  return { ...payload, daily: { ...payload.daily, time: dates } };
}

describe('parseForecast', () => {
  it.each([
    ['a payload that is not an object', null],
    ['a forecast without timezone', withoutField('timezone')],
    ['a forecast without current conditions', withoutField('current')],
    ['current conditions without local time', { ...createForecastPayload(), current: { temperature_2m: 20 } }],
    ['a forecast without daily dates', withoutField('daily')],
    ['a forecast with only six dates', withDates(createForecastPayload().daily.time.slice(0, 6))],
    ['a forecast with a malformed date', withDates([...createForecastPayload().daily.time.slice(0, 6), '07/10/2026'])],
    ['a forecast with an impossible calendar date', withDates(['2026-10-01', '2026-10-02', '2026-02-31', '2026-10-04', '2026-10-05', '2026-10-06', '2026-10-07'])],
    ['a forecast with a repeated date', withDates(['2026-10-01', '2026-10-02', '2026-10-02', '2026-10-04', '2026-10-05', '2026-10-06', '2026-10-07'])],
    ['a forecast with a missing calendar day', withDates(['2026-10-01', '2026-10-02', '2026-10-04', '2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08'])],
  ])('rejects %s because it cannot fulfil the seven-day contract', (_scenario, payload) => {
    // Given
    const parse = () => parseForecast(payload, failureMessage);
    // When / Then
    expect(parse).toThrow(expect.objectContaining({ code: 'WEATHER_SOURCE_ERROR', status: 502, message: failureMessage }));
  });
});
