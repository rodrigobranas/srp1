import { WeatherForecast, WeatherLocation } from '@/types/weather'

export const parisMatches: WeatherLocation[] = [
  { id: 1, name: 'Paris', region: 'Île-de-France', country: 'França', countryCode: 'FR', latitude: 48.8, longitude: 2.3, timezone: 'Europe/Paris' },
  { id: 2, name: 'Paris', region: 'Texas', country: 'Estados Unidos', countryCode: 'US', latitude: 33.6, longitude: -95.5, timezone: 'America/Chicago' },
]

export function weatherForecast(): WeatherForecast {
  return {
    timezone: 'Europe/Paris',
    current: { time: '2026-10-01T09:15', temperatureC: 17.2, apparentTemperatureC: 16.9, relativeHumidityPercent: 52, windSpeedKmh: 8.4, weatherCode: 2 },
    daily: Array.from({ length: 7 }, (_, index) => ({
      date: `2026-10-0${index + 1}`, weatherCode: index % 2 === 0 ? 1 : 61, minimumTemperatureC: 12.1, maximumTemperatureC: 20.5,
    })),
  }
}
