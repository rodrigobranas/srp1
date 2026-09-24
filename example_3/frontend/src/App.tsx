import { FormEvent, useEffect, useState } from 'react'

type WeatherData = {
  city: string
  country: string
  latitude: number
  longitude: number
  timezone: string
  current: {
    time: string
    temperature: number
    apparentTemperature: number
    relativeHumidity: number
    windSpeed: number
    weatherCode: number
    description: string
  }
}

const API_BASE = 'http://localhost:3000'

const weatherCodeMap: Record<number, string> = {
  0: '☀️ Céu limpo',
  1: '🌤 Predominantemente limpo',
  2: '⛅ Parcialmente nublado',
  3: '☁️ Nublado',
  45: '🌫 Nevoeiro',
  48: '🌫 Nevoeiro com geada',
  51: '🌦 Garoa leve',
  53: '🌦 Garoa moderada',
  55: '🌧 Garoa forte',
  56: '🌧 Garoa gelada leve',
  57: '🌧 Garoa gelada forte',
  61: '🌧 Chuva leve',
  63: '🌧 Chuva moderada',
  65: '🌧 Chuva forte',
  66: '🌧 Chuva gelada',
  67: '🌧 Chuva gelada forte',
  71: '❄️ Neve leve',
  73: '❄️ Neve moderada',
  75: '❄️ Neve forte',
  77: '❄️ Granizo',
  80: '🌦 Pancadas de chuva',
  81: '🌧 Chuva intensa',
  82: '🌧 Chuva muito intensa',
  85: '❄️ Neve leve',
  86: '❄️ Neve forte',
  95: '⛈ Trovoada',
  96: '⛈ Trovoada com granizo',
  99: '⛈ Trovoada forte com granizo',
}

function formatTemperature(value: number) {
  return `${Math.round(value)}°C`
}

function formatTime(value: string) {
  return new Date(value).toLocaleString('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function App() {
  const [cityInput, setCityInput] = useState('São Paulo')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchWeather = async (city?: string, latitude?: number, longitude?: number) => {
    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams()

      if (city) {
        params.set('city', city)
      }

      if (typeof latitude === 'number') {
        params.set('latitude', latitude.toString())
      }

      if (typeof longitude === 'number') {
        params.set('longitude', longitude.toString())
      }

      const response = await fetch(`${API_BASE}/weather?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Não foi possível buscar o clima.')
      }

      setWeather(data)
      setCityInput(data.city)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar o clima.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!cityInput.trim()) {
      setError('Digite uma cidade para consultar o clima.')
      return
    }

    await fetchWeather(cityInput.trim())
  }

  const handleUseCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      setError('Geolocalização não suportada pelo navegador.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await fetchWeather(undefined, position.coords.latitude, position.coords.longitude)
      },
      () => {
        setError('Não foi possível obter sua localização atual.')
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  useEffect(() => {
    const initializeWeather = async () => {
      if (!('geolocation' in navigator)) {
        await fetchWeather('São Paulo')
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await fetchWeather(undefined, position.coords.latitude, position.coords.longitude)
        },
        async () => {
          await fetchWeather('São Paulo')
        },
        { enableHighAccuracy: true, timeout: 10000 },
      )
    }

    void initializeWeather()
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex max-w-5xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl shadow-cyan-950/30 backdrop-blur">
          <div className="border-b border-slate-800 bg-slate-900/80 p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Weather Dashboard</p>
                <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Clima em tempo real</h1>
              </div>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="rounded-full border border-cyan-500/60 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/20"
              >
                Usar minha localização
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                value={cityInput}
                onChange={(event) => setCityInput(event.target.value)}
                placeholder="Digite uma cidade"
                className="flex-1 rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-base text-slate-50 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-2xl bg-cyan-500 px-5 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
            </form>

            {error ? (
              <p className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </p>
            ) : null}
          </div>

          <div className="p-6 sm:p-8">
            {loading ? (
              <div className="flex items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/40 py-10 text-slate-300">
                Carregando condições climáticas...
              </div>
            ) : weather ? (
              <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-cyan-500/20 via-slate-900 to-slate-900 p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-cyan-200">Local</p>
                      <h2 className="mt-2 text-3xl font-bold text-white">{weather.city}</h2>
                      <p className="text-sm text-slate-300">{weather.country}</p>
                    </div>
                    <div className="rounded-full border border-slate-700 bg-slate-950/40 px-3 py-1 text-xs text-slate-200">
                      {weather.timezone}
                    </div>
                  </div>

                  <div className="mt-8 flex items-end gap-3">
                    <span className="text-6xl font-bold text-white">{formatTemperature(weather.current.temperature)}</span>
                    <span className="mb-2 text-lg text-cyan-200">{weather.current.description}</span>
                  </div>

                  <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Sensação</p>
                      <p className="mt-2 text-xl font-semibold text-white">{formatTemperature(weather.current.apparentTemperature)}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Umidade</p>
                      <p className="mt-2 text-xl font-semibold text-white">{Math.round(weather.current.relativeHumidity)}%</p>
                    </div>
                    <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Vento</p>
                      <p className="mt-2 text-xl font-semibold text-white">{Math.round(weather.current.windSpeed)} km/h</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Resumo</p>
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-sm text-slate-400">Código do clima</p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        {weatherCodeMap[weather.current.weatherCode] ?? 'Condição indisponível'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Última atualização</p>
                      <p className="mt-1 text-lg font-semibold text-white">{formatTime(weather.current.time)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Coordenadas</p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        {weather.latitude.toFixed(2)}, {weather.longitude.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 py-12 text-center text-slate-400">
                Digite uma cidade e confira o clima atual.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
