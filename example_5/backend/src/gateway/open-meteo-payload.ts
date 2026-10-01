import { WeatherError } from '../types/weather-error';

export type Payload = Record<string, unknown>;

export function isPayload(value: unknown): value is Payload {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function readNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export function readString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value : null;
}

export function readArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

export function invalidPayloadError(message: string): WeatherError {
  return new WeatherError('WEATHER_SOURCE_ERROR', message);
}
