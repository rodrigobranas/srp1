import { CircleAlert, Radar, Search } from 'lucide-react'

interface WeatherMessageProps {
  isError?: boolean
  isLoading?: boolean
  message: string
}

export function WeatherMessage({ isError = false, isLoading = false, message }: WeatherMessageProps) {
  const Icon = isError ? CircleAlert : isLoading ? Radar : Search
  const role = isError ? 'alert' : 'status'
  const tone = isError ? 'border-rose-500/40 text-rose-700 dark:text-rose-200' : 'border-cyan-700/20 text-slate-600 dark:text-cyan-50/60'
  return (
    <section role={role} className={`flex min-h-[26rem] flex-col justify-between rounded-[14px] border bg-white/70 p-6 dark:bg-[#061528] ${tone}`}>
      <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em]"><span className={`h-2 w-2 rounded-full ${isError ? 'bg-rose-500' : 'bg-cyan-400'} ${isLoading ? 'motion-safe:animate-pulse' : ''}`} />Sinal {isError ? 'interrompido' : isLoading ? 'em varredura' : 'aguardando'}</div>
      <div className="max-w-xs"><Icon aria-hidden="true" size={54} strokeWidth={1.25} className="mb-5 text-cyan-700 dark:text-cyan-300" /><p className="text-xl leading-8 text-slate-800 dark:text-slate-100">{message}</p></div>
      <p className="border-t border-current/15 pt-4 text-xs uppercase tracking-[0.16em]">Dados via Open-Meteo</p>
    </section>
  )
}
