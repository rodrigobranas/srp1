import { Dispatch, MutableRefObject } from 'react'
import { Coordinates, WeatherDisplayResult, WeatherLocation } from '@/types/weather'
import { BrowserLocationResult } from './use-browser-location'
import { WeatherAction } from './weather-state'

export interface WeatherApiClient {
  searchLocations(query: string, signal?: AbortSignal): Promise<WeatherLocation[]>
  getForecast(coordinates: Coordinates, signal?: AbortSignal): Promise<WeatherDisplayResult['forecast']>
}

export type WeatherRetryRequest =
  | { type: 'search'; query: string }
  | { type: 'select'; location: WeatherLocation }
  | { type: 'browser' }

export interface WeatherActionContext {
  query: string
  api: WeatherApiClient
  dispatch: Dispatch<WeatherAction>
  sequence: MutableRefObject<number>
  controller: MutableRefObject<AbortController | null>
  lastRequest: MutableRefObject<WeatherRetryRequest | null>
  browserLocation: { requestLocation(): Promise<BrowserLocationResult> }
}

export interface ActiveWeatherRequest {
  id: number
  signal: AbortSignal
}
