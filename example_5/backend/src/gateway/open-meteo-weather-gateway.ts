import { Coordinates, ForecastGateway } from '../types/weather';
import { createOpenMeteoClient, OpenMeteoClientOptions } from './open-meteo-client';
import { FORECAST_DAYS, parseForecast } from './open-meteo-forecast-parser';

export const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

const CURRENT_VARIABLES = 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code';
const DAILY_VARIABLES = 'weather_code,temperature_2m_min,temperature_2m_max';

const FORECAST_MESSAGES = {
  failure: 'The weather provider is temporarily unavailable.',
  timeout: 'The weather provider did not respond in time.',
};

export function createOpenMeteoWeatherGateway(options: OpenMeteoClientOptions = {}): ForecastGateway {
  const client = createOpenMeteoClient(options);
  return {
    async getForecast(input: Coordinates) {
      const payload = await client.getJson(buildForecastUrl(input), FORECAST_MESSAGES);
      return parseForecast(payload, FORECAST_MESSAGES.failure);
    },
  };
}

function buildForecastUrl(input: Coordinates): URL {
  const url = new URL(FORECAST_URL);
  url.search = new URLSearchParams({
    latitude: String(input.latitude),
    longitude: String(input.longitude),
    current: CURRENT_VARIABLES,
    daily: DAILY_VARIABLES,
    forecast_days: String(FORECAST_DAYS),
    timezone: 'auto',
    temperature_unit: 'celsius',
    wind_speed_unit: 'kmh',
    timeformat: 'iso8601',
  }).toString();
  return url;
}
