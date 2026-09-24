export interface WeatherLocation {
  city: string
  country: string
  latitude: number
  longitude: number
  timezone: string
}

export interface CurrentWeather {
  temperature: number
  apparentTemperature: number
  humidity: number
  windSpeed: number
  weatherCode: number
  observedAt: string
}

export interface WeatherReport {
  location: WeatherLocation
  current: CurrentWeather
}

export interface GeocodingResponse {
  results?: Array<GeocodingLocationResponse>
}

export interface GeocodingLocationResponse {
  name: string
  country: string
  latitude: number
  longitude: number
  timezone: string
}

export interface ForecastResponse {
  timezone: string
  current?: CurrentWeatherResponse
}

export interface CurrentWeatherResponse {
  temperature_2m: number
  apparent_temperature: number
  relative_humidity_2m: number
  wind_speed_10m: number
  weather_code: number
  time: string
}
