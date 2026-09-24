import { FormEvent } from 'react'
import { Search } from 'lucide-react'
import { WeatherViewModel } from '@/hooks/use-weather'

interface WeatherSearchProps {
  model: Pick<WeatherViewModel, 'city' | 'isLoading' | 'onCityChange' | 'onSubmit'>
}

export function WeatherSearch({ model }: WeatherSearchProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    model.onSubmit()
  }
  return (
    <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="city">Cidade</label>
      <input id="city" value={model.city} onChange={(event) => model.onCityChange(event.target.value)} placeholder="Ex.: Rio de Janeiro" className="h-12 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-sky-950" />
      <button type="submit" disabled={model.isLoading} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 font-semibold text-white shadow-lg shadow-sky-600/20 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70">
        <Search aria-hidden="true" size={18} />
        {model.isLoading ? 'Buscando...' : 'Buscar clima'}
      </button>
    </form>
  )
}
