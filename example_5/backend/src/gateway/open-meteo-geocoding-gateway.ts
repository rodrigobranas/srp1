import { LocationGateway, WeatherLocation } from '../types/weather';
import { createOpenMeteoClient, OpenMeteoClientOptions } from './open-meteo-client';
import { invalidPayloadError, isPayload, readNumber, readString } from './open-meteo-payload';

export const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
export const LOCATION_RESULT_LIMIT = 10;

const GEOCODING_MESSAGES = {
  failure: 'Location search is temporarily unavailable.',
  timeout: 'Location search did not respond in time.',
};

export function createOpenMeteoGeocodingGateway(options: OpenMeteoClientOptions = {}): LocationGateway {
  const client = createOpenMeteoClient(options);
  return {
    async searchLocations(query: string) {
      const payload = await client.getJson(buildSearchUrl(query), GEOCODING_MESSAGES);
      return parseLocations(payload);
    },
  };
}

function buildSearchUrl(query: string): URL {
  const url = new URL(GEOCODING_URL);
  url.search = new URLSearchParams({
    name: query,
    count: String(LOCATION_RESULT_LIMIT),
    language: 'pt',
    format: 'json',
  }).toString();
  return url;
}

function parseLocations(payload: unknown): WeatherLocation[] {
  if (!isPayload(payload)) throw invalidPayloadError(GEOCODING_MESSAGES.failure);
  if (payload.results === undefined) return [];
  if (!Array.isArray(payload.results)) throw invalidPayloadError(GEOCODING_MESSAGES.failure);
  return payload.results.slice(0, LOCATION_RESULT_LIMIT).map(parseLocation);
}

function parseLocation(result: unknown): WeatherLocation {
  const source = isPayload(result) ? result : {};
  const id = readNumber(source.id);
  const name = readString(source.name);
  const latitude = readNumber(source.latitude);
  const longitude = readNumber(source.longitude);
  if (id === null || name === null || latitude === null || longitude === null) {
    throw invalidPayloadError(GEOCODING_MESSAGES.failure);
  }
  return {
    id,
    name,
    region: readString(source.admin1),
    country: readString(source.country),
    countryCode: readString(source.country_code),
    latitude,
    longitude,
    timezone: readString(source.timezone),
  };
}
