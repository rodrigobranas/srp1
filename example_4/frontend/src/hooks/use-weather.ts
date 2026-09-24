import { useState } from 'react'
import { getWeather } from '@/services/weather/get-weather'
import { WeatherReport } from '@/types/weather'

export interface WeatherViewModel {
  city: string
  error: string | null
  isLoading: boolean
  weather: WeatherReport | null
  onCityChange: (city: string) => void
  onSubmit: () => void
}

export function useWeather(): WeatherViewModel {
  const [city, setCity] = useState('São Paulo')
  const [weather, setWeather] = useState<WeatherReport | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const searchWeather = async () => {
    const cityName = city.trim()
    if (!cityName) return setError('Digite uma cidade para consultar o clima.')
    setIsLoading(true)
    setError(null)
    try {
      setWeather(await getWeather(cityName))
    } catch (requestError) {
      setWeather(null)
      setError(getMessage(requestError))
    } finally {
      setIsLoading(false)
    }
  }
  return { city, error, isLoading, weather, onCityChange: setCity, onSubmit: searchWeather }
}

function getMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return 'Não foi possível carregar o clima agora.'
}
