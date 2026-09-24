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
