import { WeatherDisplayResult, WeatherFeedbackState, WeatherLocation } from '@/types/weather'

export interface WeatherState {
  query: string
  locations: WeatherLocation[]
  selectedLocation: WeatherLocation | null
  result: WeatherDisplayResult | null
  active: 'idle' | 'search' | 'forecast' | 'location'
  feedbackState: WeatherFeedbackState
  feedbackMessage: string | null
}

export type WeatherAction =
  | { type: 'query_changed'; query: string }
  | { type: 'search_started' }
  | { type: 'locations_loaded'; locations: WeatherLocation[] }
  | { type: 'location_selected'; location: WeatherLocation }
  | { type: 'location_started' }
  | { type: 'forecast_started' }
  | { type: 'forecast_loaded'; result: WeatherDisplayResult }
  | { type: 'request_failed'; state: 'error' | 'location-error'; message: string }
  | { type: 'invalid_query' }

export const initialWeatherState: WeatherState = {
  query: '', locations: [], selectedLocation: null, result: null, active: 'idle', feedbackState: 'idle', feedbackMessage: null,
}

export function weatherReducer(state: WeatherState, action: WeatherAction): WeatherState {
  if (action.type === 'query_changed') return { ...state, query: action.query, feedbackState: state.active === 'idle' ? 'idle' : 'loading', feedbackMessage: null }
  if (action.type === 'search_started') return { ...state, locations: [], selectedLocation: null, active: 'search', feedbackState: 'loading', feedbackMessage: null }
  if (action.type === 'locations_loaded') return locationsLoaded(state, action.locations)
  if (action.type === 'location_selected') return { ...state, selectedLocation: action.location, active: 'forecast', feedbackState: 'loading', feedbackMessage: null }
  if (action.type === 'location_started') return { ...state, active: 'location', feedbackState: 'loading', feedbackMessage: null }
  if (action.type === 'forecast_started') return { ...state, active: 'forecast', feedbackState: 'loading', feedbackMessage: null }
  if (action.type === 'forecast_loaded') return { ...state, result: action.result, active: 'idle', feedbackState: 'idle', feedbackMessage: null }
  if (action.type === 'request_failed') return { ...state, active: 'idle', feedbackState: action.state, feedbackMessage: action.message }
  return { ...state, locations: [], selectedLocation: null, result: null, active: 'idle', feedbackState: 'invalid', feedbackMessage: null }
}

function locationsLoaded(state: WeatherState, locations: WeatherLocation[]): WeatherState {
  const onlyMatch = locations.length === 1 ? locations[0] : null
  return {
    ...state, locations, selectedLocation: onlyMatch, active: onlyMatch ? 'forecast' : 'idle',
    feedbackState: locations.length === 0 ? 'empty' : onlyMatch ? 'loading' : 'idle', feedbackMessage: null,
  }
}
