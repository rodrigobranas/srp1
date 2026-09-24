import { WeatherError } from '../errors/weather-error'
import { getCurrentWeather, searchCity } from '../gateway/open-meteo-gateway'
import { WeatherReport } from '../types/weather'

export async function getWeatherByCity(city: string): Promise<WeatherReport> {
  const normalizedCity = validateCity(city)
  const location = await searchCity(normalizedCity)
  const current = await getCurrentWeather(location)
  return { location, current }
}

function validateCity(city: string): string {
  const normalizedCity = city.trim()
  if (!normalizedCity) throw new WeatherError('A city query parameter is required', 400)
  return normalizedCity
}
