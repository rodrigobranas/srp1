import { CurrentWeather, WeatherDay, WeatherForecast } from '../types/weather';
import { invalidPayloadError, isPayload, readArray, readNumber, readString } from './open-meteo-payload';

export const FORECAST_DAYS = 7;

const LOCAL_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function parseForecast(payload: unknown, failureMessage: string): WeatherForecast {
  const source = isPayload(payload) ? payload : {};
  const timezone = readString(source.timezone);
  if (timezone === null) throw invalidPayloadError(failureMessage);
  return {
    timezone,
    current: parseCurrent(source.current, failureMessage),
    daily: parseDaily(source.daily, failureMessage),
  };
}

function parseCurrent(value: unknown, failureMessage: string): CurrentWeather {
  const source = isPayload(value) ? value : {};
  const time = readString(source.time);
  if (time === null) throw invalidPayloadError(failureMessage);
  return {
    time,
    temperatureC: readNumber(source.temperature_2m),
    apparentTemperatureC: readNumber(source.apparent_temperature),
    relativeHumidityPercent: readNumber(source.relative_humidity_2m),
    windSpeedKmh: readNumber(source.wind_speed_10m),
    weatherCode: readNumber(source.weather_code),
  };
}

function parseDaily(value: unknown, failureMessage: string): WeatherDay[] {
  const source = isPayload(value) ? value : {};
  const dates = readArray(source.time);
  if (dates.length !== FORECAST_DAYS || !dates.every(isLocalDate) || !areConsecutiveDates(dates)) {
    throw invalidPayloadError(failureMessage);
  }
  const weatherCodes = readArray(source.weather_code);
  const minimums = readArray(source.temperature_2m_min);
  const maximums = readArray(source.temperature_2m_max);
  return dates.map((date, index) => ({
    date,
    weatherCode: readNumber(weatherCodes[index]),
    minimumTemperatureC: readNumber(minimums[index]),
    maximumTemperatureC: readNumber(maximums[index]),
  }));
}

function isLocalDate(value: unknown): value is string {
  if (typeof value !== 'string' || !LOCAL_DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function areConsecutiveDates(dates: string[]): boolean {
  return dates.slice(1).every((date, index) => {
    const currentDay = Date.parse(`${date}T00:00:00Z`);
    const previousDay = Date.parse(`${dates[index]}T00:00:00Z`);
    return currentDay - previousDay === 86_400_000;
  });
}
