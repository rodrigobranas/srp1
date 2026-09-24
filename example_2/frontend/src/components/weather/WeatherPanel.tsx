import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { LocateFixed, Loader2, Search, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CurrentWeatherCard } from './CurrentWeatherCard'
import { ForecastList } from './ForecastList'
import {
  fetchCitySuggestions,
  fetchWeatherByCity,
  fetchWeatherByCoordinates,
  fetchWeatherByPlaceId,
} from '@/lib/weather-api'
import { requestPosition } from '@/lib/geolocation'
import type { CitySuggestion, WeatherReport } from '@/types/weather'

const DEFAULT_CITY = 'Brasília'
const SUGGESTION_DEBOUNCE_MS = 300

function isAbort(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

export function WeatherPanel() {
  const [query, setQuery] = useState('')
  const [report, setReport] = useState<WeatherReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLocating, setIsLocating] = useState(false)

  // Lets a newer lookup cancel whichever one is still in flight.
  const requestRef = useRef<AbortController | null>(null)
  const searchBoxRef = useRef<HTMLDivElement>(null)

  const load = useCallback(async (lookup: (signal: AbortSignal) => Promise<WeatherReport>) => {
    requestRef.current?.abort()
    const controller = new AbortController()
    requestRef.current = controller

    setIsLoading(true)
    setError(null)
    setShowSuggestions(false)

    try {
      const result = await lookup(controller.signal)
      setReport(result)
      setQuery(result.location.name)
    } catch (err) {
      if (isAbort(err)) return
      setError(err instanceof Error ? err.message : 'Falha ao consultar o clima.')
      setReport(null)
    } finally {
      if (!controller.signal.aborted) setIsLoading(false)
    }
  }, [])

  // Try the browser's location first, falling back to a default city when it is
  // denied, unavailable or simply takes too long.
  useEffect(() => {
    requestPosition()
      .then((coords) =>
        load((signal) => fetchWeatherByCoordinates(coords.latitude, coords.longitude, signal)),
      )
      .catch(() => load((signal) => fetchWeatherByCity(DEFAULT_CITY, signal)))
  }, [load])

  // Autocomplete for whatever is currently typed.
  useEffect(() => {
    const term = query.trim()
    if (term.length < 2 || !showSuggestions) {
      setSuggestions([])
      return
    }

    const controller = new AbortController()
    const timer = setTimeout(() => {
      fetchCitySuggestions(term, controller.signal)
        .then(setSuggestions)
        .catch(() => setSuggestions([]))
    }, SUGGESTION_DEBOUNCE_MS)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query, showSuggestions])

  // Close the dropdown when clicking anywhere outside the search box.
  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!searchBoxRef.current?.contains(event.target as Node)) setShowSuggestions(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const city = query.trim()
    if (!city) return
    void load((signal) => fetchWeatherByCity(city, signal))
  }

  const handlePickSuggestion = (suggestion: CitySuggestion) => {
    void load((signal) => fetchWeatherByPlaceId(suggestion.id, signal))
  }

  const handleUseMyLocation = async () => {
    setIsLocating(true)
    try {
      const coords = await requestPosition()
      await load((signal) => fetchWeatherByCoordinates(coords.latitude, coords.longitude, signal))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível obter sua localização.')
    } finally {
      setIsLocating(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 pb-24 pt-10 sm:px-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Painel do Clima</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Busque uma cidade para ver as condições atuais e a previsão da semana.
        </p>
      </header>

      <div ref={searchBoxRef} className="relative">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              strokeWidth={2}
              aria-hidden="true"
            />
            <Input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setShowSuggestions(true)
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Digite uma cidade (ex.: Recife)"
              aria-label="Cidade"
              autoComplete="off"
              className="pl-9"
            />
          </div>

          <Button type="submit" disabled={isLoading || !query.trim()}>
            Buscar
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleUseMyLocation}
            disabled={isLocating || isLoading}
            title="Usar minha localização"
            aria-label="Usar minha localização"
          >
            {isLocating ? <Loader2 className="animate-spin" /> : <LocateFixed />}
          </Button>
        </form>

        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 mt-1.5 w-full overflow-hidden rounded-md border bg-popover shadow-md">
            {suggestions.map((suggestion) => (
              <li key={suggestion.id}>
                <button
                  type="button"
                  onClick={() => handlePickSuggestion(suggestion)}
                  className="flex w-full items-baseline gap-2 px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  <span className="font-medium">{suggestion.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {[suggestion.region, suggestion.country].filter(Boolean).join(', ')}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && (
        <Card className="flex items-center gap-3 border-destructive/40 bg-destructive/5 p-4 text-sm">
          <TriangleAlert className="h-4 w-4 shrink-0 text-destructive" strokeWidth={2} aria-hidden="true" />
          <span>{error}</span>
        </Card>
      )}

      {isLoading && !report && (
        <Card className="flex items-center justify-center gap-3 p-16 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Carregando clima...
        </Card>
      )}

      {report && (
        <div className={isLoading ? 'space-y-6 opacity-60 transition-opacity' : 'space-y-6 transition-opacity'}>
          <CurrentWeatherCard report={report} />
          <ForecastList daily={report.daily} />
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Dados fornecidos por{' '}
        <a
          href="https://open-meteo.com"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:text-foreground"
        >
          Open-Meteo
        </a>
      </p>
    </div>
  )
}
