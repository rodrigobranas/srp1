import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import {
  AlertCircle,
  Cloud,
  CloudDrizzle,
  CloudLightning,
  CloudRain,
  CloudSun,
  Droplets,
  LoaderCircle,
  MapPin,
  Search,
  Sun,
  Thermometer,
  Umbrella,
  Wind,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type ApiStatus = 'checking' | 'online' | 'offline'

interface WeatherData {
  location: {
    name: string
    country: string
    region: string
    timezone: string
  }
  current: {
    time: string
    temperature: number
    apparentTemperature: number
    humidity: number
    precipitation: number
    weatherCode: number
    windSpeed: number
    isDay: boolean
  }
  daily: Array<{
    date: string
    maxTemperature: number
    minTemperature: number
    weatherCode: number
  }>
}

interface ErrorResponse {
  error?: string
}

interface WeatherMeta {
  label: string
  icon: LucideIcon
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
const DEFAULT_CITY = 'São Paulo'

function getWeatherMeta(code: number, isDay = true): WeatherMeta {
  if (code === 0) return { label: isDay ? 'Céu limpo' : 'Noite limpa', icon: isDay ? Sun : CloudSun }
  if ([1, 2].includes(code)) return { label: 'Parcialmente nublado', icon: CloudSun }
  if (code === 3) return { label: 'Nublado', icon: Cloud }
  if ([45, 48].includes(code)) return { label: 'Neblina', icon: Cloud }
  if ([51, 53, 55, 56, 57].includes(code)) return { label: 'Garoa', icon: CloudDrizzle }
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { label: 'Chuva', icon: CloudRain }
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: 'Neve', icon: Cloud }
  if ([95, 96, 99].includes(code)) return { label: 'Tempestade', icon: CloudLightning }
  return { label: 'Condição variável', icon: CloudSun }
}

function formatTemperature(value: number) {
  return `${Math.round(value)}°`
}

function formatDay(date: string, index: number) {
  if (index === 0) return 'Hoje'

  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  })
    .format(new Date(`${date}T12:00:00`))
    .replace('.', '')
}

function App() {
  const [query, setQuery] = useState(DEFAULT_CITY)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [apiStatus, setApiStatus] = useState<ApiStatus>('checking')
  const controllerRef = useRef<AbortController | null>(null)

  const fetchWeather = useCallback(async (city: string) => {
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/api/weather?city=${encodeURIComponent(city)}`, {
        signal: controller.signal,
      })
      const payload = await response.json() as WeatherData & ErrorResponse

      if (!response.ok) {
        throw new Error(payload.error ?? 'Não foi possível encontrar essa cidade.')
      }

      setWeather(payload)
      setQuery(payload.location.name)
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === 'AbortError') return

      setError(requestError instanceof Error ? requestError.message : 'Não foi possível carregar o clima.')
    } finally {
      if (controllerRef.current === controller) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    void fetchWeather(DEFAULT_CITY)

    return () => controllerRef.current?.abort()
  }, [fetchWeather])

  useEffect(() => {
    let active = true

    const checkApiStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/health`)
        if (active) setApiStatus(response.ok ? 'online' : 'offline')
      } catch {
        if (active) setApiStatus('offline')
      }
    }

    void checkApiStatus()
    const interval = window.setInterval(checkApiStatus, 30_000)

    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const city = query.trim()

    if (!city) {
      setError('Digite o nome de uma cidade para consultar o clima.')
      return
    }

    void fetchWeather(city)
  }

  const currentMeta = weather ? getWeatherMeta(weather.current.weatherCode, weather.current.isDay) : null
  const CurrentIcon = currentMeta?.icon ?? CloudSun

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f4f7fb] text-slate-950">
      <div className="pointer-events-none absolute -left-32 -top-40 h-[28rem] w-[28rem] rounded-full bg-sky-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[32rem] w-[32rem] rounded-full bg-indigo-100/70 blur-3xl" />

      <main className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-12 lg:py-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
              <CloudSun className="h-6 w-6" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-sm font-bold tracking-[0.22em] text-slate-900">CLIMA AGORA</p>
              <p className="mt-0.5 text-xs text-slate-500">Previsão simples, onde você estiver</p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-2 text-xs font-medium text-slate-500 shadow-sm backdrop-blur sm:flex">
            <span className={`h-2 w-2 rounded-full ${apiStatus === 'online' ? 'bg-emerald-500' : apiStatus === 'offline' ? 'bg-rose-500' : 'bg-amber-400'} ${apiStatus === 'checking' ? 'animate-pulse' : ''}`} />
            {apiStatus === 'online' ? 'Serviço online' : apiStatus === 'offline' ? 'Serviço indisponível' : 'Conectando...'}
          </div>
        </header>

        <section className="mx-auto mt-16 w-full max-w-3xl text-center sm:mt-20">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-sky-600">Seu clima, em um instante</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
            Como está o tempo <span className="text-sky-500">por aí?</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-500 sm:text-lg">
            Pesquise uma cidade e veja as condições atuais, temperatura e previsão para os próximos dias.
          </p>

          <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 rounded-3xl border border-white/80 bg-white/80 p-2.5 shadow-xl shadow-slate-300/30 backdrop-blur sm:flex-row">
            <label className="flex min-h-14 flex-1 items-center gap-3 rounded-2xl px-4 text-left focus-within:ring-2 focus-within:ring-sky-400/50">
              <MapPin className="h-5 w-5 shrink-0 text-sky-500" />
              <span className="sr-only">Cidade</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Digite uma cidade..."
                className="min-w-0 flex-1 bg-transparent text-base font-medium text-slate-900 outline-none placeholder:text-slate-400"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-7 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-70"
            >
              {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {loading ? 'Buscando' : 'Buscar clima'}
            </button>
          </form>
        </section>

        <section className="mx-auto mt-12 w-full max-w-6xl pb-8 sm:mt-16">
          {error && (
            <div role="alert" className="mx-auto mb-6 flex max-w-2xl items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-left text-sm text-rose-700">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading && !weather ? (
            <div className="grid animate-pulse gap-5 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="h-80 rounded-[2rem] bg-slate-200/70" />
              <div className="h-80 rounded-[2rem] bg-white/70" />
            </div>
          ) : weather && currentMeta ? (
            <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
              <article className="relative min-h-[20rem] overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0f2742] via-[#123d61] to-[#216b8d] p-7 text-white shadow-2xl shadow-sky-900/20 sm:p-10">
                <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full border-[28px] border-white/5" />
                <div className="absolute -bottom-28 -left-16 h-64 w-64 rounded-full border-[38px] border-white/5" />
                <div className="relative flex h-full flex-col justify-between gap-12">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-sky-100">
                        <MapPin className="h-4 w-4" />
                        <span>{weather.location.name}{weather.location.region ? `, ${weather.location.region}` : ''}</span>
                      </div>
                      <p className="mt-2 text-xs text-sky-200/75">{weather.location.country} · {weather.location.timezone}</p>
                    </div>
                    <CurrentIcon className="h-16 w-16 text-amber-300 sm:h-20 sm:w-20" strokeWidth={1.2} />
                  </div>

                  <div className="flex flex-wrap items-end justify-between gap-5">
                    <div>
                      <div className="flex items-start">
                        <span className="text-8xl font-light leading-none tracking-[-0.08em] sm:text-9xl">{Math.round(weather.current.temperature)}</span>
                        <span className="mt-2 text-4xl font-light">°</span>
                      </div>
                      <p className="mt-3 text-lg font-medium text-white">{currentMeta.label}</p>
                      <p className="mt-1 text-sm text-sky-100/75">Sensação de {formatTemperature(weather.current.apparentTemperature)}</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 px-4 py-3 text-right backdrop-blur-sm">
                      <p className="text-xs text-sky-100/75">Atualizado às</p>
                      <p className="mt-1 text-sm font-semibold">{new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(weather.current.time))}</p>
                    </div>
                  </div>
                </div>
              </article>

              <article className="rounded-[2rem] border border-white/80 bg-white/85 p-7 shadow-xl shadow-slate-300/20 backdrop-blur sm:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Condições atuais</p>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Detalhes do clima</h2>
                  </div>
                  <div className="rounded-2xl bg-sky-50 p-3 text-sky-500">
                    <Thermometer className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  <WeatherDetail icon={Droplets} label="Umidade" value={`${Math.round(weather.current.humidity)}%`} />
                  <WeatherDetail icon={Wind} label="Vento" value={`${Math.round(weather.current.windSpeed)} km/h`} />
                  <WeatherDetail icon={Umbrella} label="Precipitação" value={`${weather.current.precipitation.toFixed(1)} mm`} />
                  <WeatherDetail icon={Sun} label="Sensação" value={formatTemperature(weather.current.apparentTemperature)} />
                </div>
              </article>
            </div>
          ) : null}

          {weather && (
            <article className="mt-5 rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-xl shadow-slate-300/20 backdrop-blur sm:p-8">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Próximos dias</p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Previsão estendida</h2>
                </div>
                <p className="text-sm text-slate-500">Temperaturas em graus Celsius</p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
                {weather.daily.map((day, index) => {
                  const meta = getWeatherMeta(day.weatherCode)
                  const DayIcon = meta.icon

                  return (
                    <div key={day.date} className={`rounded-2xl p-4 ${index === 0 ? 'bg-sky-50 ring-1 ring-sky-100' : 'bg-slate-50'}`}>
                      <p className={`text-sm font-bold capitalize ${index === 0 ? 'text-sky-600' : 'text-slate-500'}`}>{formatDay(day.date, index)}</p>
                      <DayIcon className={`my-5 h-8 w-8 ${index === 0 ? 'text-sky-500' : 'text-slate-400'}`} strokeWidth={1.7} />
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-slate-900">{formatTemperature(day.maxTemperature)}</span>
                        <span className="text-sm font-medium text-slate-400">{formatTemperature(day.minTemperature)}</span>
                      </div>
                      <p className="mt-1 truncate text-xs text-slate-400">{meta.label}</p>
                    </div>
                  )
                })}
              </div>
            </article>
          )}
        </section>

        <footer className="mt-auto flex flex-col items-center justify-between gap-3 border-t border-slate-200/70 pt-5 text-xs text-slate-400 sm:flex-row">
          <span>Dados meteorológicos por Open-Meteo</span>
          <span>Atualização automática a cada consulta</span>
        </footer>
      </main>
    </div>
  )
}

interface WeatherDetailProps {
  icon: LucideIcon
  label: string
  value: string
}

function WeatherDetail({ icon: Icon, label, value }: WeatherDetailProps) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <Icon className="h-5 w-5 text-sky-500" strokeWidth={1.8} />
      <p className="mt-4 text-xs font-medium text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-800">{value}</p>
    </div>
  )
}

export default App
