import { WeatherFeedbackState } from '@/types/weather'

interface WeatherFeedbackProps {
  state: WeatherFeedbackState
  message?: string
  onRetry?(): void
}

const DEFAULT_MESSAGES: Record<Exclude<WeatherFeedbackState, 'idle'>, string> = {
  loading: 'Buscando as informações do clima…',
  invalid: 'Informe o nome de uma cidade para iniciar a busca.',
  empty: 'Nenhuma localidade encontrada. Confira o nome e tente novamente.',
  error: 'Não foi possível carregar os dados. Tente novamente.',
  'location-error': 'Não foi possível acessar sua localização. Você ainda pode pesquisar uma cidade.',
}

export function WeatherFeedback({ state, message, onRetry }: WeatherFeedbackProps) {
  if (state === 'idle') return <div id="weather-feedback" className="sr-only" aria-live="polite" />
  const isError = state === 'invalid' || state === 'error' || state === 'location-error'
  return (
    <div id="weather-feedback" className={`rounded-xl border px-4 py-3 text-sm ${isError ? 'border-destructive/40 bg-destructive/10 text-foreground' : 'border-border bg-secondary text-secondary-foreground'}`} role={isError ? 'alert' : 'status'} aria-live={isError ? 'assertive' : 'polite'} aria-atomic="true" aria-busy={state === 'loading'}>
      <p>{message ?? DEFAULT_MESSAGES[state]}</p>
      {state === 'error' && onRetry ? <button type="button" className="mt-2 font-semibold underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" onClick={onRetry}>Tentar novamente</button> : null}
    </div>
  )
}
