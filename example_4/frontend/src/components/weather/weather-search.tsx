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
    <form className="space-y-3" onSubmit={handleSubmit}>
      <label className="block text-sm font-medium text-slate-700 dark:text-cyan-50/80" htmlFor="city">Cidade</label>
      <div className="flex flex-col gap-2 rounded-[14px] border border-slate-900/15 bg-white/70 p-2 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.5)] transition focus-within:border-cyan-600/70 dark:border-cyan-100/20 dark:bg-[#081a2e] dark:shadow-none sm:flex-row">
        <input id="city" value={model.city} onChange={(event) => model.onCityChange(event.target.value)} placeholder="Ex.: Rio de Janeiro" className="h-12 min-w-0 flex-1 bg-transparent px-3 text-base text-slate-950 outline-none placeholder:text-slate-500 dark:text-slate-50 dark:placeholder:text-cyan-50/65" />
        <button type="submit" disabled={model.isLoading} className="inline-flex h-12 items-center justify-center gap-2 rounded-[10px] bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-cyan-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-70 dark:bg-cyan-300 dark:text-cyan-950 dark:hover:bg-cyan-200 dark:focus-visible:ring-offset-[#081a2e]">
          <Search aria-hidden="true" size={18} strokeWidth={2.25} />
        {model.isLoading ? 'Buscando...' : 'Buscar clima'}
      </button>
      </div>
    </form>
  )
}
