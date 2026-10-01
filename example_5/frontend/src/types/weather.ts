export interface Coordinates {
  latitude: number
  longitude: number
}

export interface WeatherLocation extends Coordinates {
  id: number
  name: string
  region: string | null
  country: string | null
  countryCode: string | null
  timezone: string | null
}

export interface CurrentWeather {
  time: string
  temperatureC: number | null
  apparentTemperatureC: number | null
  relativeHumidityPercent: number | null
  windSpeedKmh: number | null
  weatherCode: number | null
}

export interface WeatherDay {
  date: string
  weatherCode: number | null
  minimumTemperatureC: number | null
  maximumTemperatureC: number | null
}

export interface WeatherForecast {
  timezone: string
  current: CurrentWeather
  daily: WeatherDay[]
}

export type WeatherApiErrorCode =
  | 'INVALID_QUERY'
  | 'INVALID_COORDINATES'
  | 'WEATHER_SOURCE_ERROR'
  | 'WEATHER_SOURCE_TIMEOUT'
  | 'INTERNAL_ERROR'

export interface WeatherApiErrorEnvelope {
  error: { code: WeatherApiErrorCode; message: string }
}

export type WeatherFeedbackState = 'idle' | 'loading' | 'invalid' | 'empty' | 'error' | 'location-error'

export interface WeatherDisplayResult {
  forecast: WeatherForecast
  locationName: string
  country: string | null
}

export class WeatherApiException extends Error {
  constructor(readonly code: WeatherApiErrorCode, message: string) {
    super(message)
    this.name = 'WeatherApiException'
  }
}
