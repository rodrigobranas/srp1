export type WeatherIcon =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'freezing-rain'
  | 'snow'
  | 'showers'
  | 'thunderstorm'
  | 'thunderstorm-hail'

export interface WeatherCondition {
  code: number
  label: string
  icon: WeatherIcon
}

export interface WeatherLocation {
  name: string
  region?: string
  country?: string
  countryCode?: string
  latitude: number
  longitude: number
  timezone: string
  source: 'search' | 'coordinates'
}

export interface CurrentWeather {
  time: string
  temperature: number
  apparentTemperature: number
  humidity: number
  precipitation: number
  windSpeed: number
  windDirection: number
  isDay: boolean
  condition: WeatherCondition
}

export interface DailyForecast {
  date: string
  condition: WeatherCondition
  temperatureMax: number
  temperatureMin: number
  precipitationProbability: number | null
  sunrise: string
  sunset: string
}

export interface WeatherUnits {
  temperature: string
  windSpeed: string
  precipitation: string
  humidity: string
}

export interface WeatherReport {
  location: WeatherLocation
  current: CurrentWeather
  daily: DailyForecast[]
  units: WeatherUnits
}

export interface CitySuggestion {
  id: number
  name: string
  region?: string
  country?: string
  countryCode?: string
  latitude: number
  longitude: number
}
