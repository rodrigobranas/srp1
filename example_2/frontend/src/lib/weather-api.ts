import type { CitySuggestion, WeatherReport } from '@/types/weather'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { signal })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new Error('Não foi possível falar com o servidor. Ele está rodando?')
  }

  const body = await response.json().catch(() => null)
  if (!response.ok) {
    const message = body && typeof body.error === 'string' ? body.error : 'Falha ao consultar o clima.'
    throw new Error(message)
  }
  return body as T
}

export function fetchWeatherByCity(city: string, signal?: AbortSignal): Promise<WeatherReport> {
  return request<WeatherReport>(`/weather?city=${encodeURIComponent(city)}`, signal)
}

export function fetchWeatherByPlaceId(placeId: number, signal?: AbortSignal): Promise<WeatherReport> {
  return request<WeatherReport>(`/weather?placeId=${placeId}`, signal)
}

export function fetchWeatherByCoordinates(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<WeatherReport> {
  return request<WeatherReport>(`/weather?latitude=${latitude}&longitude=${longitude}`, signal)
}

export async function fetchCitySuggestions(query: string, signal?: AbortSignal): Promise<CitySuggestion[]> {
  const body = await request<{ results: CitySuggestion[] }>(
    `/weather/cities?q=${encodeURIComponent(query)}`,
    signal,
  )
  return body.results
}
