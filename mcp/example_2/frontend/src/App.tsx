import { FormEvent, useState } from 'react'
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Clock3, CreditCard, MapPin, Plane, Search, UserRound } from 'lucide-react'

type SelectionStep = 'outbound' | 'return' | 'seats' | 'payment' | 'success'
type FlightLeg = 'outbound' | 'return'
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

const initialSearch = { origin: 'FLN' as Airport, destination: 'CGH' as Airport, date: '2026-10-10' }
const unavailableSeats: Record<FlightLeg, Set<string>> = {
  outbound: new Set(['1A', '2F', '4C', '7D', '10B', '14E', '18A', '22F', '27C']),
  return: new Set(['1F', '3B', '6E', '9A', '12D', '16C', '20F', '24B', '29E']),
}

function App() {
  const [search, setSearch] = useState(initialSearch)
  const [result, setResult] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedOutboundId, setSelectedOutboundId] = useState<number | null>(null)
  const [selectedReturnId, setSelectedReturnId] = useState<number | null>(null)
  const [selectedOutboundSeat, setSelectedOutboundSeat] = useState<string | null>(null)
  const [selectedReturnSeat, setSelectedReturnSeat] = useState<string | null>(null)
  const [selectionStep, setSelectionStep] = useState<SelectionStep>('outbound')
  const [reservationLocator, setReservationLocator] = useState('')

  const selectedOutbound = result?.outboundFlights.find((flight) => flight.id === selectedOutboundId) ?? null
  const selectedReturn = result?.returnFlights.find((flight) => flight.id === selectedReturnId) ?? null

  const performSearch = async (event?: FormEvent) => {
    event?.preventDefault()
    setError('')
    setLoading(true)
    setResult(null)
    setSelectedOutboundId(null)
    setSelectedReturnId(null)
    setSelectedOutboundSeat(null)
    setSelectedReturnSeat(null)
    setSelectionStep('outbound')
    setReservationLocator('')

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
      <section className="bg-[#102a43] pb-[50px]">
      <div className="mx-auto max-w-6xl px-5 pt-7 sm:px-8">
        <header className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-400 p-2.5 text-[#102a43] shadow-lg shadow-cyan-950/20"><Plane size={22} /></div>
            <div>
              <p className="text-lg font-bold tracking-tight">AeroBusca</p>
              <p className="text-xs text-slate-300">Sua próxima rota começa aqui</p>
            </div>
          </div>
        </header>

        {selectionStep !== 'success' && <>
        <form onSubmit={performSearch} className="mt-10 rounded-2xl bg-white p-4 shadow-2xl shadow-slate-900/10 sm:p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700"><Search size={17} className="text-cyan-600" /> Buscar voos</div>
          <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_1fr_auto] md:items-end">
            <AirportSelect label="Origem" value={search.origin} onChange={(origin) => setSearch({ ...search, origin })} exclude={search.destination} />
            <button type="button" onClick={swapAirports} aria-label="Inverter origem e destino" className="mb-1 hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-cyan-400 hover:text-cyan-600 md:flex"><ArrowRight size={17} /></button>
            <AirportSelect label="Destino" value={search.destination} onChange={(destination) => setSearch({ ...search, destination })} exclude={search.origin} />
            <label className="block text-sm font-medium text-slate-600">Data
              <span className="relative mt-2 block"><CalendarDays size={17} className="pointer-events-none absolute left-3 top-3 text-slate-400" /><input required type="date" min="2026-10-10" max="2026-10-12" value={search.date} onChange={(event) => setSearch({ ...search, date: event.target.value })} className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" /></span>
            </label>
            <button disabled={loading} className="h-11 rounded-lg bg-[#102a43] px-6 text-sm font-bold text-white transition hover:bg-[#163d5f] disabled:cursor-wait disabled:opacity-60">{loading ? 'Buscando…' : 'Pesquisar'}</button>
          </div>
          <p className="mt-4 text-xs text-slate-400">Disponível para viagens entre 10 e 12 de outubro de 2026.</p>
        </form>

        {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        </>}
      </div>
      </section>

      <div className={`mx-auto max-w-6xl px-5 pb-16 sm:px-8 ${selectionStep === 'success' ? 'pt-10' : 'pt-5'}`}>
        {result && <section>
          {selectionStep !== 'success' && <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div><p className="text-sm font-semibold text-cyan-700">{formatDate(result.search.date)}</p><h2 className="mt-1 text-2xl font-bold tracking-tight">Voos de {result.search.origin} para {result.search.destination}</h2></div>
            <p className="text-sm text-slate-500">{selectionStep === 'outbound' ? `${result.outboundFlights.length} opções de ida · etapa 1 de 4` : selectionStep === 'return' ? `${result.returnFlights.length} opções de volta · etapa 2 de 4` : selectionStep === 'seats' ? 'Etapa 3 de 4 · Assentos' : 'Etapa 4 de 4 · Pagamento'}</p>
          </div>
          }
          {selectionStep === 'outbound' ? <div>
            <FlightGroup
              title="1. Voo de ida"
              subtitle={`${result.search.origin} → ${result.search.destination}`}
              flights={result.outboundFlights}
              selectedFlightId={selectedOutboundId}
              onSelectFlight={(flight) => {
                setSelectedOutboundId(flight.id)
                setSelectedReturnId(null)
                setSelectedOutboundSeat(null)
                setSelectedReturnSeat(null)
              }}
            />
            {selectedOutbound && <button type="button" onClick={() => setSelectionStep('return')} className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#102a43] px-6 text-sm font-bold text-white transition hover:bg-[#163d5f] sm:ml-auto sm:w-auto">Ir para o voo de volta <ArrowRight size={16} /></button>}
          </div> : selectionStep === 'return' && selectedOutbound ? <div>
            <button type="button" onClick={() => setSelectionStep('outbound')} className="mb-5 text-sm font-semibold text-cyan-700 transition hover:text-cyan-900">← Voltar para escolher o voo de ida</button>
            <FlightGroup
              title="2. Voo de volta"
              subtitle={`${result.search.destination} → ${result.search.origin}`}
              flights={result.returnFlights}
              selectedFlightId={selectedReturnId}
              onSelectFlight={(flight) => {
                setSelectedReturnId(flight.id)
                setSelectedReturnSeat(null)
              }}
            />
            {selectedReturn && <button type="button" onClick={() => setSelectionStep('seats')} className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#102a43] px-6 text-sm font-bold text-white transition hover:bg-[#163d5f] sm:ml-auto sm:w-auto">Ir para seleção de assentos <ArrowRight size={16} /></button>}
          </div> : selectionStep === 'seats' && selectedOutbound && selectedReturn ? <SeatSelectionStep
            result={result}
            outboundFlight={selectedOutbound}
            returnFlight={selectedReturn}
            outboundSeat={selectedOutboundSeat}
            returnSeat={selectedReturnSeat}
            onSelectOutboundSeat={setSelectedOutboundSeat}
            onSelectReturnSeat={setSelectedReturnSeat}
            onBack={() => setSelectionStep('return')}
            onContinue={() => setSelectionStep('payment')}
          /> : selectionStep === 'payment' && selectedOutbound && selectedReturn && selectedOutboundSeat && selectedReturnSeat ? <PaymentStep
            result={result}
            outboundFlight={selectedOutbound}
            returnFlight={selectedReturn}
            outboundSeat={selectedOutboundSeat}
            returnSeat={selectedReturnSeat}
            onBack={() => setSelectionStep('seats')}
            onConfirm={() => {
              setReservationLocator(Math.random().toString(36).slice(2, 8).toUpperCase())
              setSelectionStep('success')
            }}
          /> : null}
          {selectionStep === 'success' && reservationLocator && selectedOutbound && selectedReturn && selectedOutboundSeat && selectedReturnSeat && <PurchaseSuccessStep result={result} outboundFlight={selectedOutbound} returnFlight={selectedReturn} outboundSeat={selectedOutboundSeat} returnSeat={selectedReturnSeat} locator={reservationLocator} />}
        </section>}

        {!result && !error && <div className="mt-14 flex flex-col items-center text-center text-slate-400"><div className="rounded-full bg-white p-5 shadow-sm"><Plane size={28} className="text-cyan-500" /></div><p className="mt-4 text-sm">Escolha uma rota e uma data para ver os horários disponíveis.</p></div>}
      </div>
    </main>
  )
}

function AirportSelect({ label, value, exclude, onChange }: { label: string; value: Airport; exclude: Airport; onChange: (value: Airport) => void }) {
  return <label className="block text-sm font-medium text-slate-600">{label}<span className="relative mt-2 block"><MapPin size={17} className="pointer-events-none absolute left-3 top-3 text-slate-400" /><select value={value} onChange={(event) => onChange(event.target.value as Airport)} className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100">{(['FLN', 'CGH', 'GRU'] as Airport[]).filter((airport) => airport !== exclude).map((airport) => <option key={airport} value={airport}>{airport} · {airportNames[airport]}</option>)}</select></span></label>
}

function FlightGroup({ title, subtitle, flights, selectedFlightId, onSelectFlight }: { title: string; subtitle: string; flights: Flight[]; selectedFlightId: number | null; onSelectFlight: (flight: Flight) => void }) {
  return <div><div className="mb-3 flex items-center justify-between"><div><h3 className="font-bold text-slate-800">{title}</h3><p className="text-xs text-slate-500">{subtitle}</p></div><span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700">{flights.length} voos</span></div><div className="space-y-3">{flights.map((flight) => <FlightCard key={flight.id} flight={flight} selected={flight.id === selectedFlightId} onSelect={() => onSelectFlight(flight)} />)}{flights.length === 0 && <p className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-6 text-sm text-slate-500">Nenhum voo disponível para este trecho.</p>}</div></div>
}

function FlightCard({ flight, selected, onSelect }: { flight: Flight; selected: boolean; onSelect: () => void }) {
  return <button type="button" aria-pressed={selected} onClick={onSelect} className={`block w-full rounded-xl border p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${selected ? 'border-cyan-500 bg-cyan-50 ring-2 ring-cyan-100' : 'border-slate-200 bg-white hover:border-cyan-200'}`}><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold text-slate-800">{flight.airline.name}</p><p className="mt-1 text-xs text-slate-400">{flight.flightNumber} · {flight.aircraft.model}</p></div><div className="text-right"><p className="text-lg font-bold text-[#102a43]">R$ {flight.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p><p className="text-[11px] text-slate-400">por passageiro</p></div></div><div className="mt-4 flex items-center gap-3"><div><p className="text-xl font-bold text-slate-800">{flight.departureTime}</p><p className="text-xs font-semibold text-slate-500">{flight.origin}</p></div><div className="flex flex-1 items-center gap-2"><div className="h-px flex-1 bg-slate-200" /><div className="flex items-center gap-1 text-[11px] text-slate-400"><Clock3 size={12} /> {Math.floor(flight.durationMinutes / 60)}h {flight.durationMinutes % 60}m</div><div className="h-px flex-1 bg-slate-200" /></div><div className="text-right"><p className="text-xl font-bold text-slate-800">{flight.arrivalTime}</p><p className="text-xs font-semibold text-slate-500">{flight.destination}</p></div></div><p className={`mt-3 text-right text-xs font-bold ${selected ? 'text-cyan-700' : 'text-slate-400'}`}>{selected ? 'Selecionado' : 'Selecionar voo'}</p></button>
}

function SeatSelectionStep({ result, outboundFlight, returnFlight, outboundSeat, returnSeat, onSelectOutboundSeat, onSelectReturnSeat, onBack, onContinue }: { result: SearchResult; outboundFlight: Flight; returnFlight: Flight; outboundSeat: string | null; returnSeat: string | null; onSelectOutboundSeat: (seat: string) => void; onSelectReturnSeat: (seat: string) => void; onBack: () => void; onContinue: () => void }) {
  const [activeLeg, setActiveLeg] = useState<FlightLeg>('outbound')
  const selectedSeatTotal = (outboundSeat ? getSeatPrice(outboundSeat) : 0) + (returnSeat ? getSeatPrice(returnSeat) : 0)

  return <div className="space-y-6">
    <div>
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 transition hover:text-cyan-900"><ArrowLeft size={16} /> Voltar para o voo de volta</button>
      <p className="mt-2 text-sm text-slate-500">Escolha um assento para cada trecho. O valor de cada assento será somado à passagem.</p>
    </div>

    <div className="grid grid-cols-2 gap-3" role="group" aria-label="Trecho do voo">
      <button type="button" aria-pressed={activeLeg === 'outbound'} onClick={() => setActiveLeg('outbound')} className={`rounded-xl border px-4 py-3 text-left transition ${activeLeg === 'outbound' ? 'border-cyan-500 bg-cyan-50 ring-2 ring-cyan-100' : 'border-slate-200 bg-white hover:border-cyan-300'}`}>
        <span className="block text-sm font-bold text-slate-800">{result.search.origin} → {result.search.destination}</span>
        <span className="mt-1 block text-xs text-slate-500">{outboundSeat ? `Assento ${outboundSeat} · ${formatCurrency(getSeatPrice(outboundSeat))}` : 'Escolher assento de ida'}</span>
      </button>
      <button type="button" aria-pressed={activeLeg === 'return'} onClick={() => setActiveLeg('return')} className={`rounded-xl border px-4 py-3 text-left transition ${activeLeg === 'return' ? 'border-cyan-500 bg-cyan-50 ring-2 ring-cyan-100' : 'border-slate-200 bg-white hover:border-cyan-300'}`}>
        <span className="block text-sm font-bold text-slate-800">{result.search.destination} → {result.search.origin}</span>
        <span className="mt-1 block text-xs text-slate-500">{returnSeat ? `Assento ${returnSeat} · ${formatCurrency(getSeatPrice(returnSeat))}` : 'Escolher assento de volta'}</span>
      </button>
    </div>

    {activeLeg === 'outbound' ? <SeatMap leg="outbound" title="Voo de ida" flight={outboundFlight} date={result.search.date} selectedSeat={outboundSeat} onSelectSeat={onSelectOutboundSeat} /> : <SeatMap leg="return" title="Voo de volta" flight={returnFlight} date={result.search.date} selectedSeat={returnSeat} onSelectSeat={onSelectReturnSeat} />}

    <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600">Valor dos assentos selecionados: <span className="font-bold text-slate-900">{formatCurrency(selectedSeatTotal)}</span></p>
      <button type="button" disabled={!outboundSeat || !returnSeat} onClick={onContinue} className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#102a43] px-6 text-sm font-bold text-white transition hover:bg-[#163d5f] disabled:cursor-not-allowed disabled:opacity-40">Ir para pagamento <ArrowRight size={16} /></button>
    </div>
  </div>
}

function SeatMap({ leg, title, flight, date, selectedSeat, onSelectSeat }: { leg: FlightLeg; title: string; flight: Flight; date: string; selectedSeat: string | null; onSelectSeat: (seat: string) => void }) {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F']
  const unavailable = unavailableSeats[leg]

  return <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
    <FlightLegSummary title={title} flight={flight} date={date} seat={selectedSeat} />
    <div className="mt-5 border-t border-slate-100 pt-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-bold text-slate-800">Selecione seu assento</h3>
        <div className="flex items-center gap-3 text-xs text-slate-500"><span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded border border-cyan-200 bg-cyan-50" />Disponível</span><span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded border border-slate-200 bg-slate-100" />Indisponível</span></div>
      </div>
      <div className="mb-3 flex flex-wrap gap-2 text-[11px] text-slate-600">
        <SeatPriceLegend rows="1–3" price={110} />
        <SeatPriceLegend rows="4–12" price={70} />
        <SeatPriceLegend rows="13–20" price={50} />
        <SeatPriceLegend rows="21–30" price={40} />
      </div>
      <div className="max-h-[26rem] overflow-y-auto rounded-xl border border-slate-100 bg-slate-50 p-3">
        <div className="mx-auto max-w-md space-y-1.5">
          <div className="flex items-center justify-center gap-1 pb-1 text-[10px] font-bold text-slate-400">
            <span className="w-7 shrink-0 text-center">Fila</span>
            <div className="grid flex-1 grid-cols-3 gap-1">{letters.slice(0, 3).map((letter) => <span key={letter} className="text-center">{letter}</span>)}</div>
            <span className="w-4 shrink-0" />
            <div className="grid flex-1 grid-cols-3 gap-1">{letters.slice(3).map((letter) => <span key={letter} className="text-center">{letter}</span>)}</div>
          </div>
          {Array.from({ length: 30 }, (_, index) => index + 1).map((row) => <div key={row} className="flex items-center justify-center gap-1">
            <span className="w-7 shrink-0 text-center text-[10px] font-semibold text-slate-400">{row}</span>
            <div className="grid flex-1 grid-cols-3 gap-1">{letters.slice(0, 3).map((letter) => <SeatButton key={letter} seat={`${row}${letter}`} selectedSeat={selectedSeat} unavailable={unavailable.has(`${row}${letter}`)} onSelect={onSelectSeat} />)}</div>
            <span className="w-4 shrink-0" />
            <div className="grid flex-1 grid-cols-3 gap-1">{letters.slice(3).map((letter) => <SeatButton key={letter} seat={`${row}${letter}`} selectedSeat={selectedSeat} unavailable={unavailable.has(`${row}${letter}`)} onSelect={onSelectSeat} />)}</div>
          </div>)}
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500">{selectedSeat ? <>Assento <span className="font-bold text-slate-800">{selectedSeat}</span> selecionado · acréscimo de <span className="font-bold text-slate-800">{formatCurrency(getSeatPrice(selectedSeat))}</span></> : 'Clique em um assento disponível para selecionar.'}</p>
    </div>
  </section>
}

function SeatButton({ seat, selectedSeat, unavailable, onSelect }: { seat: string; selectedSeat: string | null; unavailable: boolean; onSelect: (seat: string) => void }) {
  const selected = seat === selectedSeat
  const price = getSeatPrice(seat)
  return <button type="button" disabled={unavailable} aria-pressed={selected} aria-label={`Assento ${seat}, ${unavailable ? 'indisponível' : `${formatCurrency(price)}`}`} title={unavailable ? 'Assento indisponível' : `Assento ${seat} · ${formatCurrency(price)}`} onClick={() => onSelect(seat)} className={`h-8 min-w-0 rounded-md border px-0 text-[10px] font-semibold transition sm:h-9 sm:text-xs ${unavailable ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-300' : selected ? 'border-cyan-700 bg-cyan-600 text-white' : 'border-cyan-200 bg-cyan-50 text-cyan-800 hover:bg-cyan-100'}`}>{seat}</button>
}

function SeatPriceLegend({ rows, price }: { rows: string; price: number }) {
  return <span className="rounded-md bg-slate-100 px-2 py-1">Fileiras {rows}: <span className="font-bold">{formatCurrency(price)}</span></span>
}

function FlightLegSummary({ title, flight, date, seat }: { title: string; flight: Flight; date: string; seat: string | null }) {
  return <article className="rounded-xl border border-slate-200 p-4">
    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
      <div><h3 className="font-bold text-slate-800">{title}</h3><p className="mt-1 text-xs text-slate-500">{flight.airline.name} · {flight.flightNumber} · {flight.aircraft.model}</p></div>
      <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${seat ? 'bg-cyan-50 text-cyan-800' : 'bg-slate-100 text-slate-500'}`}>{seat ? `Assento ${seat} · ${formatCurrency(getSeatPrice(seat))}` : 'Assento não selecionado'}</span>
    </div>
    <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
      <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Partida</p><p className="mt-1 text-sm font-bold text-slate-800">{formatFullDate(date)} · {flight.departureTime}</p><p className="text-xs text-slate-500">{airportNames[flight.origin as Airport]} ({flight.origin})</p></div>
      <ArrowRight size={17} className="hidden text-slate-300 sm:block" />
      <div className="sm:text-right"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Chegada</p><p className="mt-1 text-sm font-bold text-slate-800">{formatFullDate(date)} · {flight.arrivalTime}</p><p className="text-xs text-slate-500">{airportNames[flight.destination as Airport]} ({flight.destination})</p></div>
    </div>
  </article>
}

function PaymentStep({ result, outboundFlight, returnFlight, outboundSeat, returnSeat, onBack, onConfirm }: { result: SearchResult; outboundFlight: Flight; returnFlight: Flight; outboundSeat: string; returnSeat: string; onBack: () => void; onConfirm: () => void }) {
  const outboundSeatPrice = getSeatPrice(outboundSeat)
  const returnSeatPrice = getSeatPrice(returnSeat)
  const flightTotal = outboundFlight.price + returnFlight.price
  const seatTotal = outboundSeatPrice + returnSeatPrice
  const total = flightTotal + seatTotal

  return <div className="space-y-6">
    <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 transition hover:text-cyan-900"><ArrowLeft size={16} /> Voltar para seleção de assentos</button>

    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <div className="space-y-6">
        <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center gap-2"><UserRound size={19} className="text-cyan-600" /><h3 className="font-bold text-slate-800">Dados do passageiro</h3></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <PaymentField label="Nome completo" autoComplete="name" placeholder="Como aparece no documento" />
            <PaymentField label="CPF" inputMode="numeric" placeholder="000.000.000-00" />
            <PaymentField label="E-mail" type="email" autoComplete="email" placeholder="voce@exemplo.com" />
            <PaymentField label="Telefone" type="tel" autoComplete="tel" placeholder="(00) 00000-0000" />
          </div>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center gap-2"><CreditCard size={19} className="text-cyan-600" /><h3 className="font-bold text-slate-800">Cartão de crédito</h3></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><PaymentField label="Número do cartão" inputMode="numeric" autoComplete="cc-number" placeholder="0000 0000 0000 0000" /></div>
            <div className="sm:col-span-2"><PaymentField label="Nome impresso no cartão" autoComplete="cc-name" placeholder="Nome como aparece no cartão" /></div>
            <PaymentField label="Validade" autoComplete="cc-exp" placeholder="MM/AA" />
            <PaymentField label="Código de segurança" inputMode="numeric" autoComplete="cc-csc" placeholder="CVV" />
          </div>
        </section>
      </div>

      <div className="space-y-6">
        <section className="space-y-4 rounded-2xl bg-white p-5 shadow-sm sm:p-7">
          <div><p className="text-sm font-semibold text-cyan-700">Revise seu itinerário</p><h3 className="mt-1 text-xl font-bold text-slate-900">Ida e volta</h3></div>
          <FlightLegSummary title="Voo de ida" flight={outboundFlight} date={result.search.date} seat={outboundSeat} />
          <div className="flex justify-end text-sm text-slate-600">Voo {formatCurrency(outboundFlight.price)} + assento {formatCurrency(outboundSeatPrice)}</div>
          <FlightLegSummary title="Voo de volta" flight={returnFlight} date={result.search.date} seat={returnSeat} />
          <div className="flex justify-end text-sm text-slate-600">Voo {formatCurrency(returnFlight.price)} + assento {formatCurrency(returnSeatPrice)}</div>
        </section>

        <section className="rounded-2xl bg-[#102a43] p-5 text-white shadow-lg sm:p-7">
          <p className="text-sm font-semibold text-cyan-300">Resumo do preço</p>
          <div className="mt-3 space-y-2 border-b border-white/15 pb-4 text-sm text-slate-200">
            <div className="flex justify-between gap-4"><span>Voos de ida e volta</span><span>{formatCurrency(flightTotal)}</span></div>
            <div className="flex justify-between gap-4"><span>Assentos {outboundSeat} e {returnSeat}</span><span>{formatCurrency(seatTotal)}</span></div>
          </div>
          <div className="mt-4 flex items-end justify-between gap-4"><p className="text-sm text-slate-300">Preço total por passageiro</p><p className="text-3xl font-bold">{formatCurrency(total)}</p></div>
        </section>
      </div>
    </div>

    <div className="flex justify-end">
      <button type="button" onClick={onConfirm} className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#102a43] px-7 text-sm font-bold text-white transition hover:bg-[#163d5f] sm:w-auto">Confirmar <CheckCircle2 size={17} /></button>
    </div>
  </div>
}

function PurchaseSuccessStep({ result, outboundFlight, returnFlight, outboundSeat, returnSeat, locator }: { result: SearchResult; outboundFlight: Flight; returnFlight: Flight; outboundSeat: string; returnSeat: string; locator: string }) {
  const total = outboundFlight.price + returnFlight.price + getSeatPrice(outboundSeat) + getSeatPrice(returnSeat)

  return <section className="mx-auto max-w-3xl rounded-2xl bg-white p-6 text-center shadow-xl sm:p-10">
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><CheckCircle2 size={34} /></div>
    <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Compra confirmada</p>
    <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Boa viagem!</h2>
    <p className="mt-2 text-sm text-slate-500">Sua reserva foi concluída. Guarde o localizador para consultar sua viagem.</p>

    <div className="mt-7 rounded-xl border border-cyan-100 bg-cyan-50 px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Localizador da reserva</p>
      <p className="mt-2 font-mono text-3xl font-bold tracking-[0.25em] text-[#102a43]">{locator}</p>
    </div>

    <div className="mt-6 space-y-3 text-left">
      <SuccessFlightLine title="Ida" flight={outboundFlight} date={result.search.date} seat={outboundSeat} />
      <SuccessFlightLine title="Volta" flight={returnFlight} date={result.search.date} seat={returnSeat} />
    </div>

    <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5 text-left">
      <span className="text-sm font-medium text-slate-600">Total pago</span>
      <span className="text-2xl font-bold text-[#102a43]">{formatCurrency(total)}</span>
    </div>
  </section>
}

function SuccessFlightLine({ title, flight, date, seat }: { title: string; flight: Flight; date: string; seat: string }) {
  return <div className="rounded-lg border border-slate-200 p-4">
    <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Voo de {title}</p>
    <p className="mt-1 text-sm font-bold text-slate-800">{flight.origin} {flight.departureTime} → {flight.destination} {flight.arrivalTime}</p>
    <p className="mt-1 text-xs text-slate-500">{formatFullDate(date)} · {flight.airline.name} · {flight.flightNumber} · Assento {seat}</p>
  </div>
}

function PaymentField({ label, type = 'text', placeholder, autoComplete, inputMode }: { label: string; type?: 'text' | 'email' | 'tel'; placeholder: string; autoComplete?: string; inputMode?: 'text' | 'numeric' }) {
  return <label className="block text-sm font-medium text-slate-600">{label}<input type={type} inputMode={inputMode} autoComplete={autoComplete} placeholder={placeholder} className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" /></label>
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }).format(new Date(`${date}T12:00:00`))
}

function formatFullDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(`${date}T12:00:00`))
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function getSeatPrice(seat: string) {
  const row = Number.parseInt(seat, 10)
  if (row <= 3) return 110
  if (row <= 12) return 70
  if (row <= 20) return 50
  return 40
}

export default App
