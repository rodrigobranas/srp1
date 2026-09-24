import { HttpError } from './http-error';
import {
  fetchForecast,
  getPlaceById,
  searchPlaces,
  type ForecastResponse,
  type GeocodingPlace,
} from './open-meteo';
import { describeWeatherCode, type WeatherCondition } from './wmo';

export interface WeatherLocation {
  name: string;
  region?: string;
  country?: string;
  countryCode?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  /** `coordinates` means the name was derived from the timezone, not from a geocoding match. */
  source: 'search' | 'coordinates';
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  windDirection: number;
  isDay: boolean;
  condition: WeatherCondition;
}

export interface DailyForecast {
  date: string;
  condition: WeatherCondition;
  temperatureMax: number;
  temperatureMin: number;
  precipitationProbability: number | null;
  sunrise: string;
  sunset: string;
}

export interface WeatherReport {
  location: WeatherLocation;
  current: CurrentWeather;
  daily: DailyForecast[];
  units: {
    temperature: string;
    windSpeed: string;
    precipitation: string;
    humidity: string;
  };
}

/** Turns `America/Sao_Paulo` into `Sao Paulo`, so a coordinate lookup still has a readable label. */
function labelFromTimezone(timezone: string): string {
  const city = timezone.split('/').pop();
  if (!city) return 'Sua localização';
  return city.replace(/_/g, ' ');
}

function toReport(place: WeatherLocation, forecast: ForecastResponse): WeatherReport {
  const { current, daily } = forecast;

  return {
    location: place,
    current: {
      time: current.time,
      temperature: current.temperature_2m,
      apparentTemperature: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      precipitation: current.precipitation,
      windSpeed: current.wind_speed_10m,
      windDirection: current.wind_direction_10m,
      isDay: current.is_day === 1,
      condition: describeWeatherCode(current.weather_code),
    },
    daily: daily.time.map((date, index) => ({
      date,
      condition: describeWeatherCode(daily.weather_code[index]),
      temperatureMax: daily.temperature_2m_max[index],
      temperatureMin: daily.temperature_2m_min[index],
      precipitationProbability: daily.precipitation_probability_max[index] ?? null,
      sunrise: daily.sunrise[index],
      sunset: daily.sunset[index],
    })),
    units: {
      temperature: forecast.current_units.temperature_2m ?? '°C',
      windSpeed: forecast.current_units.wind_speed_10m ?? 'km/h',
      precipitation: forecast.current_units.precipitation ?? 'mm',
      humidity: forecast.current_units.relative_humidity_2m ?? '%',
    },
  };
}

async function reportForPlace(place: GeocodingPlace): Promise<WeatherReport> {
  const forecast = await fetchForecast(place.latitude, place.longitude);

  return toReport(
    {
      name: place.name,
      region: place.admin1,
      country: place.country,
      countryCode: place.country_code,
      latitude: place.latitude,
      longitude: place.longitude,
      timezone: forecast.timezone,
      source: 'search',
    },
    forecast,
  );
}

export async function getWeatherByCity(city: string): Promise<WeatherReport> {
  const [place] = await searchPlaces(city, 1);
  if (!place) {
    throw new HttpError(404, `Nenhuma cidade encontrada para "${city}".`);
  }
  return reportForPlace(place);
}

/** Resolves an exact place picked from the autocomplete, so ambiguous names stay unambiguous. */
export async function getWeatherByPlaceId(placeId: number): Promise<WeatherReport> {
  const place = await getPlaceById(placeId);
  if (!place) {
    throw new HttpError(404, `Nenhuma cidade encontrada para o id ${placeId}.`);
  }
  return reportForPlace(place);
}

export async function getWeatherByCoordinates(latitude: number, longitude: number): Promise<WeatherReport> {
  const forecast = await fetchForecast(latitude, longitude);

  return toReport(
    {
      name: labelFromTimezone(forecast.timezone),
      latitude,
      longitude,
      timezone: forecast.timezone,
      source: 'coordinates',
    },
    forecast,
  );
}

export interface CitySuggestion {
  id: number;
  name: string;
  region?: string;
  country?: string;
  countryCode?: string;
  latitude: number;
  longitude: number;
}

export async function suggestCities(query: string, limit = 5): Promise<CitySuggestion[]> {
  const places = await searchPlaces(query, limit);
  return places.map((place: GeocodingPlace) => ({
    id: place.id,
    name: place.name,
    region: place.admin1,
    country: place.country,
    countryCode: place.country_code,
    latitude: place.latitude,
    longitude: place.longitude,
  }));
}
