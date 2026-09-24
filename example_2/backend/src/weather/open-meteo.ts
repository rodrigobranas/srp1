import { HttpError } from './http-error';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const GEOCODING_GET_URL = 'https://geocoding-api.open-meteo.com/v1/get';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const REQUEST_TIMEOUT_MS = 8000;

export interface GeocodingPlace {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string;
  timezone?: string;
}

export interface ForecastResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
  current_units: Record<string, string>;
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: (number | null)[];
    sunrise: string[];
    sunset: string[];
  };
}

async function fetchJson<T>(url: URL, source: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: { Accept: 'application/json' },
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new HttpError(504, `Não foi possível contatar a ${source}: ${reason}`);
  }

  if (!response.ok) {
    throw new HttpError(502, `A ${source} respondeu com status ${response.status}.`);
  }

  return (await response.json()) as T;
}

export async function searchPlaces(city: string, limit: number): Promise<GeocodingPlace[]> {
  const url = new URL(GEOCODING_URL);
  url.searchParams.set('name', city);
  url.searchParams.set('count', String(limit));
  url.searchParams.set('language', 'pt');
  url.searchParams.set('format', 'json');

  const body = await fetchJson<{ results?: GeocodingPlace[] }>(url, 'API de geocoding');
  return body.results ?? [];
}

export async function getPlaceById(id: number): Promise<GeocodingPlace | null> {
  const url = new URL(GEOCODING_GET_URL);
  url.searchParams.set('id', String(id));
  url.searchParams.set('language', 'pt');

  try {
    return await fetchJson<GeocodingPlace>(url, 'API de geocoding');
  } catch (error) {
    if (error instanceof HttpError && error.status === 502) return null;
    throw error;
  }
}

export async function fetchForecast(latitude: number, longitude: number): Promise<ForecastResponse> {
  const url = new URL(FORECAST_URL);
  url.searchParams.set('latitude', String(latitude));
  url.searchParams.set('longitude', String(longitude));
  url.searchParams.set(
    'current',
    [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
    ].join(','),
  );
  url.searchParams.set(
    'daily',
    [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'sunrise',
      'sunset',
    ].join(','),
  );
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('forecast_days', '7');

  return fetchJson<ForecastResponse>(url, 'API de previsão do tempo');
}
