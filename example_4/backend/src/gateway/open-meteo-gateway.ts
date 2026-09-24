import { WeatherError } from '../errors/weather-error'
import {
  CurrentWeather,
  ForecastResponse,
  GeocodingLocationResponse,
  GeocodingResponse,
  WeatherLocation,
} from '../types/weather'

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

export async function searchCity(city: string): Promise<WeatherLocation> {
  const url = new URL(GEOCODING_URL)
  url.searchParams.set('name', city)
  url.searchParams.set('count', '1')
  url.searchParams.set('language', 'pt')
  const data = await fetchJson<GeocodingResponse>(url)
  const location = data.results?.[0]
  if (!location) throw new WeatherError('City not found', 404)
  return mapLocation(location)
}

export async function getCurrentWeather(location: WeatherLocation): Promise<CurrentWeather> {
  const url = new URL(FORECAST_URL)
  url.searchParams.set('latitude', String(location.latitude))
  url.searchParams.set('longitude', String(location.longitude))
  url.searchParams.set('current', 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code')
  url.searchParams.set('timezone', location.timezone)
  const data = await fetchJson<ForecastResponse>(url)
  if (!data.current) throw new WeatherError('Weather data is unavailable', 502)
  return mapCurrentWeather(data.current)
}

function mapCurrentWeather(weather: ForecastResponse['current']): CurrentWeather {
  if (!weather) throw new WeatherError('Weather data is unavailable', 502)
  return {
    temperature: weather.temperature_2m,
    apparentTemperature: weather.apparent_temperature,
    humidity: weather.relative_humidity_2m,
    windSpeed: weather.wind_speed_10m,
    weatherCode: weather.weather_code,
    observedAt: weather.time,
  }
}

function mapLocation(location: GeocodingLocationResponse): WeatherLocation {
  return {
    city: location.name,
    country: location.country,
    latitude: location.latitude,
    longitude: location.longitude,
    timezone: location.timezone,
  }
}

async function fetchJson<T>(url: URL): Promise<T> {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new WeatherError('Weather provider is unavailable', 502)
    return (await response.json()) as T
  } catch (error) {
    if (error instanceof WeatherError) throw error
    throw new WeatherError('Weather provider is unavailable', 502)
  }
}
