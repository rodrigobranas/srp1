import { WeatherReport } from '@/types/weather'

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export async function getWeather(city: string): Promise<WeatherReport> {
  const response = await fetch(`${apiUrl}/weather?city=${encodeURIComponent(city)}`)
  if (!response.ok) throw new Error(await getErrorMessage(response))
  return response.json() as Promise<WeatherReport>
}

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string }
    return body.error ?? 'Unable to load the weather right now'
  } catch {
    return 'Unable to load the weather right now'
  }
}
