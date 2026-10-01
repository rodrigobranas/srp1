import { Coordinates, WeatherApiException, WeatherDisplayResult } from '@/types/weather'
import { ActiveWeatherRequest, WeatherActionContext } from './weather-action-types'
import { BrowserLocationResult } from './use-browser-location'

export function startRequest(context: WeatherActionContext): ActiveWeatherRequest {
  context.controller.current?.abort()
  context.controller.current = new AbortController()
  context.sequence.current += 1
  return { id: context.sequence.current, signal: context.controller.current.signal }
}

export async function loadForecast(input: {
  context: WeatherActionContext
  request: ActiveWeatherRequest
  coordinates: Coordinates
  locationName: string
  country: string | null
}) {
  try {
    const forecast = await input.context.api.getForecast(input.coordinates, input.request.signal)
    if (input.request.id === input.context.sequence.current) completeForecast(input, forecast)
  } catch (error) {
    if (input.request.id === input.context.sequence.current) failRequest(input.context, error)
  } finally {
    if (input.request.id === input.context.sequence.current) input.context.controller.current = null
  }
}

export function failLocationRequest(context: WeatherActionContext, position: Extract<BrowserLocationResult, { coordinates: null }>, id: number) {
  context.dispatch({ type: 'request_failed', state: 'location-error', message: position.error })
  if (id === context.sequence.current) context.controller.current = null
}

export function failRequest(context: WeatherActionContext, error: unknown) {
  const message = error instanceof WeatherApiException ? error.message : 'Não foi possível carregar os dados. Tente novamente.'
  context.dispatch({ type: 'request_failed', state: 'error', message })
}

function completeForecast(input: {
  context: WeatherActionContext
  request: ActiveWeatherRequest
  coordinates: Coordinates
  locationName: string
  country: string | null
}, forecast: WeatherDisplayResult['forecast']) {
  input.context.dispatch({ type: 'forecast_loaded', result: { forecast, locationName: input.locationName, country: input.country } })
}
