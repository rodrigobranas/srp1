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
        <label className="mb-2 block text-sm font-semibold text-foreground" htmlFor="city-search">Cidade</label>
        <input id="city-search" className="min-h-12 w-full rounded-xl border border-input bg-background px-4 text-base text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20" value={value} onChange={(event) => onChange(event.currentTarget.value)} aria-describedby={feedbackId} autoComplete="off" placeholder="Ex.: São Paulo" />
      </div>
      <button className="min-h-12 self-end rounded-xl bg-primary px-6 font-semibold text-primary-foreground transition hover:opacity-90 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-wait disabled:opacity-60" type="submit" disabled={isLoading} aria-busy={isLoading}>
        {isLoading ? 'Buscando…' : 'Buscar clima'}
      </button>
    </form>
  )
}
