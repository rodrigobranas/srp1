import { FormEvent, useEffect, useState } from 'react'
import { ArrowRight, CalendarDays, Clock3, MapPin, Plane, Search, Wifi } from 'lucide-react'

type ApiStatus = 'checking' | 'online' | 'offline'
type Airport = 'FLN' | 'CGH' | 'GRU'

type Flight = {
  id: number
  flightNumber: string
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  durationMinutes: number
  price: number
  airline: { code: string; name: string }
  aircraft: { registration: string; model: string }
}

type SearchResult = {
  search: { origin: Airport; destination: Airport; date: string }
  outboundFlights: Flight[]
  returnFlights: Flight[]
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const airportNames: Record<Airport, string> = {
  FLN: 'Florianópolis',
  CGH: 'São Paulo / Congonhas',
  GRU: 'São Paulo / Guarulhos',
}

const initialSearch = { origin: 'FLN' as Airport, destination: 'CGH' as Airport, date: '2026-06-10' }

function App() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>('checking')
  const [search, setSearch] = useState(initialSearch)
  const [result, setResult] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/health`)
        setApiStatus(response.ok ? 'online' : 'offline')
      } catch {
        setApiStatus('offline')
      }
    }

    checkApiStatus()
    const interval = setInterval(checkApiStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  const performSearch = async (event?: FormEvent) => {
    event?.preventDefault()
    setError('')
    setLoading(true)

    try {
      const params = new URLSearchParams({ ...search })
      const response = await fetch(`${API_URL}/api/flights/search?${params}`)
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Não foi possível buscar os voos.')
      setResult(payload as SearchResult)
    } catch (requestError) {
      setResult(null)
      setError(requestError instanceof Error ? requestError.message : 'Erro ao buscar voos.')
    } finally {
      setLoading(false)
    }
  }

  const swapAirports = () => setSearch((current) => ({ ...current, origin: current.destination, destination: current.origin }))

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f7fb] text-slate-900">
      <div className="absolute left-0 top-0 -z-0 h-72 w-full bg-[#102a43]" />
      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-16 pt-7 sm:px-8">
        <header className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-400 p-2.5 text-[#102a43] shadow-lg shadow-cyan-950/20"><Plane size={22} /></div>
            <div>
              <p className="text-lg font-bold tracking-tight">AeroBusca</p>
              <p className="text-xs text-slate-300">Sua próxima rota começa aqui</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs text-slate-200 sm:flex">
            <Wifi size={14} className={apiStatus === 'online' ? 'text-emerald-300' : 'text-amber-300'} />
            API {apiStatus === 'online' ? 'online' : apiStatus === 'checking' ? 'conectando' : 'offline'}
          </div>
        </header>

        <section className="mt-16 max-w-2xl text-white">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Voos nacionais</p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">Encontre o voo ideal para sua viagem.</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">Pesquise horários entre Florianópolis e São Paulo com tarifas para ida e volta no mesmo dia.</p>
        </section>

        <form onSubmit={performSearch} className="mt-10 rounded-2xl bg-white p-4 shadow-2xl shadow-slate-900/10 sm:p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700"><Search size={17} className="text-cyan-600" /> Buscar voos</div>
          <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_1fr_auto] md:items-end">
            <AirportSelect label="Origem" value={search.origin} onChange={(origin) => setSearch({ ...search, origin })} exclude={search.destination} />
            <button type="button" onClick={swapAirports} aria-label="Inverter origem e destino" className="mb-1 hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-cyan-400 hover:text-cyan-600 md:flex"><ArrowRight size={17} /></button>
            <AirportSelect label="Destino" value={search.destination} onChange={(destination) => setSearch({ ...search, destination })} exclude={search.origin} />
            <label className="block text-sm font-medium text-slate-600">Data
              <span className="relative mt-2 block"><CalendarDays size={17} className="pointer-events-none absolute left-3 top-3 text-slate-400" /><input required type="date" min="2026-06-10" max="2026-06-12" value={search.date} onChange={(event) => setSearch({ ...search, date: event.target.value })} className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" /></span>
            </label>
            <button disabled={loading} className="h-11 rounded-lg bg-[#102a43] px-6 text-sm font-bold text-white transition hover:bg-[#163d5f] disabled:cursor-wait disabled:opacity-60">{loading ? 'Buscando…' : 'Pesquisar'}</button>
          </div>
          <p className="mt-4 text-xs text-slate-400">Disponível para viagens entre 10 e 12 de junho de 2026.</p>
        </form>

        {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        {result && <section className="mt-10">
          <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div><p className="text-sm font-semibold text-cyan-700">{formatDate(result.search.date)}</p><h2 className="mt-1 text-2xl font-bold tracking-tight">Voos de {result.search.origin} para {result.search.destination}</h2></div>
            <p className="text-sm text-slate-500">{result.outboundFlights.length} opções de ida · {result.returnFlights.length} de volta</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <FlightGroup title="Ida" subtitle={`${result.search.origin} → ${result.search.destination}`} flights={result.outboundFlights} />
            <FlightGroup title="Volta" subtitle={`${result.search.destination} → ${result.search.origin}`} flights={result.returnFlights} />
          </div>
        </section>}

        {!result && !error && <div className="mt-14 flex flex-col items-center text-center text-slate-400"><div className="rounded-full bg-white p-5 shadow-sm"><Plane size={28} className="text-cyan-500" /></div><p className="mt-4 text-sm">Escolha uma rota e uma data para ver os horários disponíveis.</p></div>}
      </div>
    </main>
  )
}

function AirportSelect({ label, value, exclude, onChange }: { label: string; value: Airport; exclude: Airport; onChange: (value: Airport) => void }) {
  return <label className="block text-sm font-medium text-slate-600">{label}<span className="relative mt-2 block"><MapPin size={17} className="pointer-events-none absolute left-3 top-3 text-slate-400" /><select value={value} onChange={(event) => onChange(event.target.value as Airport)} className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100">{(['FLN', 'CGH', 'GRU'] as Airport[]).filter((airport) => airport !== exclude).map((airport) => <option key={airport} value={airport}>{airport} · {airportNames[airport]}</option>)}</select></span></label>
}

function FlightGroup({ title, subtitle, flights }: { title: string; subtitle: string; flights: Flight[] }) {
  return <div><div className="mb-3 flex items-center justify-between"><div><h3 className="font-bold text-slate-800">{title}</h3><p className="text-xs text-slate-500">{subtitle}</p></div><span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700">{flights.length} voos</span></div><div className="space-y-3">{flights.map((flight) => <FlightCard key={flight.id} flight={flight} />)}</div></div>
}

function FlightCard({ flight }: { flight: Flight }) {
  return <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold text-slate-800">{flight.airline.name}</p><p className="mt-1 text-xs text-slate-400">{flight.flightNumber} · {flight.aircraft.model}</p></div><div className="text-right"><p className="text-lg font-bold text-[#102a43]">R$ {flight.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p><p className="text-[11px] text-slate-400">por passageiro</p></div></div><div className="mt-4 flex items-center gap-3"><div><p className="text-xl font-bold text-slate-800">{flight.departureTime}</p><p className="text-xs font-semibold text-slate-500">{flight.origin}</p></div><div className="flex flex-1 items-center gap-2"><div className="h-px flex-1 bg-slate-200" /><div className="flex items-center gap-1 text-[11px] text-slate-400"><Clock3 size={12} /> {Math.floor(flight.durationMinutes / 60)}h {flight.durationMinutes % 60}m</div><div className="h-px flex-1 bg-slate-200" /></div><div className="text-right"><p className="text-xl font-bold text-slate-800">{flight.arrivalTime}</p><p className="text-xs font-semibold text-slate-500">{flight.destination}</p></div></div></article>
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }).format(new Date(`${date}T12:00:00`))
}

export default App
