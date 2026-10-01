interface WeatherSearchFormProps {
  value: string
  isLoading: boolean
  feedbackId: string
  onChange(value: string): void
  onSearch(): void
}

export function WeatherSearchForm({ value, isLoading, feedbackId, onChange, onSearch }: WeatherSearchFormProps) {
  return (
    <form className="flex flex-col gap-3 sm:flex-row" onSubmit={(event) => { event.preventDefault(); onSearch() }}>
      <div className="min-w-0 flex-1">
        <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="city-search">Cidade</label>
        <input id="city-search" className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus-visible:border-sky-500 focus-visible:ring-4 focus-visible:ring-sky-100" value={value} onChange={(event) => onChange(event.currentTarget.value)} aria-describedby={feedbackId} autoComplete="off" placeholder="Ex.: São Paulo" />
      </div>
      <button className="min-h-12 self-end rounded-xl bg-sky-700 px-6 font-semibold text-white transition hover:bg-sky-800 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:cursor-wait disabled:opacity-60" type="submit" disabled={isLoading} aria-busy={isLoading}>
        {isLoading ? 'Buscando…' : 'Buscar clima'}
      </button>
    </form>
  )
}
