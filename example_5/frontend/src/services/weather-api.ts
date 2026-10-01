import { Coordinates, WeatherApiErrorCode, WeatherApiException, WeatherForecast, WeatherLocation } from '@/types/weather'

const DEFAULT_API_BASE_URL = 'http://localhost:3000'
const ERROR_MESSAGES: Record<WeatherApiErrorCode, string> = {
  INVALID_QUERY: 'Informe uma cidade com pelo menos 2 caracteres.',
  INVALID_COORDINATES: 'A localização informada não é válida. Tente novamente.',
  WEATHER_SOURCE_ERROR: 'Não foi possível carregar os dados do clima. Tente novamente.',
  WEATHER_SOURCE_TIMEOUT: 'A consulta demorou demais. Tente novamente.',
  INTERNAL_ERROR: 'O serviço está indisponível. Tente novamente em instantes.',
}

export async function searchLocations(query: string, signal?: AbortSignal): Promise<WeatherLocation[]> {
  const search = new URLSearchParams({ query })
  const response = await requestBackend<{ locations: WeatherLocation[] }>(`/weather/locations?${search}`, { method: 'GET', signal })
  return response.locations
}

export function getForecast(coordinates: Coordinates, signal?: AbortSignal): Promise<WeatherForecast> {
  return requestBackend<WeatherForecast>('/weather', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ latitude: coordinates.latitude, longitude: coordinates.longitude }),
    signal,
  })
}

async function requestBackend<T>(route: string, options: Parameters<typeof fetch>[1]): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${route}`, options)
  if (!response.ok) throw await createApiException(response)
  return response.json() as Promise<T>
}

async function createApiException(response: Response): Promise<WeatherApiException> {
  const payload: unknown = await response.json().catch(() => null)
  const code = readErrorCode(payload)
  return new WeatherApiException(code, ERROR_MESSAGES[code])
}

function readErrorCode(payload: unknown): WeatherApiErrorCode {
  if (!isObject(payload) || !isObject(payload.error)) return 'INTERNAL_ERROR'
  const code = payload.error.code
  if (typeof code !== 'string' || !Object.prototype.hasOwnProperty.call(ERROR_MESSAGES, code)) return 'INTERNAL_ERROR'
  return code as WeatherApiErrorCode
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function getApiBaseUrl(): string {
  return (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, '')
}
