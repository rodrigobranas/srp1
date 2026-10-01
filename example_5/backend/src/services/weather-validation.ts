import { Coordinates } from '../types/weather';
import { WeatherError } from '../types/weather-error';

export const QUERY_MIN_LENGTH = 2;
export const QUERY_MAX_LENGTH = 100;

interface CoordinateRule {
  field: keyof Coordinates;
  label: string;
  limit: number;
}

const LATITUDE_RULE: CoordinateRule = { field: 'latitude', label: 'Latitude', limit: 90 };
const LONGITUDE_RULE: CoordinateRule = { field: 'longitude', label: 'Longitude', limit: 180 };

export function parseLocationQuery(value: unknown): string {
  const query = typeof value === 'string' ? value.trim() : '';
  if (query.length >= QUERY_MIN_LENGTH && query.length <= QUERY_MAX_LENGTH) return query;
  throw new WeatherError(
    'INVALID_QUERY',
    `The query must contain between ${QUERY_MIN_LENGTH} and ${QUERY_MAX_LENGTH} characters.`,
  );
}

export function parseCoordinates(value: unknown): Coordinates {
  const input = typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
  return {
    latitude: parseCoordinate(input, LATITUDE_RULE),
    longitude: parseCoordinate(input, LONGITUDE_RULE),
  };
}

function parseCoordinate(input: Record<string, unknown>, rule: CoordinateRule): number {
  const value = input[rule.field];
  if (typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= rule.limit) return value;
  throw new WeatherError(
    'INVALID_COORDINATES',
    `${rule.label} must be a finite number between -${rule.limit} and ${rule.limit}.`,
  );
}
