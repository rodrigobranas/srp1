import { useEffect, useReducer, useRef } from 'react'
import { getForecast, searchLocations } from '@/services/weather-api'
import { BrowserGeolocation, useBrowserLocation } from './use-browser-location'
import { createWeatherActions } from './use-weather-actions'
import { WeatherApiClient, WeatherRetryRequest } from './weather-action-types'
import { initialWeatherState, weatherReducer } from './weather-state'

const WEATHER_API: WeatherApiClient = { searchLocations, getForecast }

export function useWeather(api: WeatherApiClient = WEATHER_API, geolocation?: BrowserGeolocation | null) {
  const [state, dispatch] = useReducer(weatherReducer, initialWeatherState)
  const sequence = useRef(0)
  const controller = useRef<AbortController | null>(null)
  const lastRequest = useRef<WeatherRetryRequest | null>(null)
  const browserLocation = useBrowserLocation(geolocation)
  useEffect(() => () => { sequence.current += 1; controller.current?.abort() }, [])
  const actions = createWeatherActions({ query: state.query, api, dispatch, sequence, controller, lastRequest, browserLocation })
  return { ...state, isLoading: state.active !== 'idle', isLocating: browserLocation.isLocating, ...actions }
}
