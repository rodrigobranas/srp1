import { WeatherLocation } from '@/types/weather'
import { failLocationRequest, failRequest, loadForecast, startRequest } from './weather-action-helpers'
import { WeatherActionContext, WeatherRetryRequest } from './weather-action-types'

export function createWeatherActions(context: WeatherActionContext) {
  return {
    setQuery: (query: string) => context.dispatch({ type: 'query_changed', query }),
    search: (query?: string) => searchCity(context, query ?? context.query),
    selectLocation: (location: WeatherLocation) => selectWeatherLocation(context, location),
    locate: () => locateWeather(context),
    retry: () => retryWeatherRequest(context),
  }
}

async function searchCity(context: WeatherActionContext, query: string) {
  const normalized = query.trim()
  if (!normalized) return clearInvalidSearch(context)
  const request = startRequest(context)
  context.lastRequest.current = { type: 'search', query: normalized }
  context.dispatch({ type: 'search_started' })
  try {
    const locations = await context.api.searchLocations(normalized, request.signal)
    if (request.id !== context.sequence.current) return
    context.dispatch({ type: 'locations_loaded', locations })
    if (locations.length === 1) await loadForecast({ context, request, coordinates: locations[0], locationName: locations[0].name, country: locations[0].country })
  } catch (error) {
    if (request.id === context.sequence.current) failRequest(context, error)
  } finally {
    if (request.id === context.sequence.current) context.controller.current = null
  }
}

function clearInvalidSearch(context: WeatherActionContext) {
  startRequest(context)
  context.controller.current = null
  context.dispatch({ type: 'invalid_query' })
}

async function selectWeatherLocation(context: WeatherActionContext, location: WeatherLocation) {
  const request = startRequest(context)
  context.lastRequest.current = { type: 'select', location }
  context.dispatch({ type: 'location_selected', location })
  await loadForecast({ context, request, coordinates: location, locationName: location.name, country: location.country })
}

async function locateWeather(context: WeatherActionContext) {
  const request = startRequest(context)
  context.lastRequest.current = { type: 'browser' }
  context.dispatch({ type: 'location_started' })
  const position = await context.browserLocation.requestLocation()
  if (request.id !== context.sequence.current) return
  if (!position.coordinates) return failLocationRequest(context, position, request.id)
  context.dispatch({ type: 'forecast_started' })
  await loadForecast({ context, request, coordinates: position.coordinates, locationName: 'Sua localização', country: null })
}

function retryWeatherRequest(context: WeatherActionContext) {
  const request: WeatherRetryRequest | null = context.lastRequest.current
  if (request?.type === 'search') return searchCity(context, request.query)
  if (request?.type === 'select') return selectWeatherLocation(context, request.location)
  if (request?.type === 'browser') return locateWeather(context)
}
