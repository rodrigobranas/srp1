import { vi } from 'vitest';
import { WeatherForecast, WeatherLocation, WeatherService } from '../types/weather';

export const sampleLocation: WeatherLocation = {
  id: 3448439, name: 'São Paulo', region: 'São Paulo', country: 'Brasil', countryCode: 'BR',
  latitude: -23.5475, longitude: -46.6361, timezone: 'America/Sao_Paulo',
};

export function sampleForecast(): WeatherForecast {
  return {
    timezone: 'America/Sao_Paulo',
    current: { time: '2026-10-01T09:15', temperatureC: 23.3, apparentTemperatureC: 23.7, relativeHumidityPercent: 69, windSpeedKmh: 14.4, weatherCode: 2 },
    daily: Array.from({ length: 7 }, (_, index) => ({
      date: `2026-10-0${index + 1}`, weatherCode: 2, minimumTemperatureC: 18, maximumTemperatureC: 25,
    })),
  };
}

export function createWeatherServiceStub(overrides: Partial<WeatherService> = {}) {
  return {
    searchLocations: vi.fn(async () => [sampleLocation]),
    getForecast: vi.fn(async () => sampleForecast()),
    ...overrides,
  } satisfies WeatherService;
}
