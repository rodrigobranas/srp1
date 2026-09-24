import { WeatherViewModel } from '@/hooks/use-weather'
import { WeatherCard } from './weather-card'
import { WeatherMessage } from './weather-message'

interface WeatherContentProps {
  model: Pick<WeatherViewModel, 'error' | 'isLoading' | 'weather'>
}

export function WeatherContent({ model }: WeatherContentProps) {
  if (model.isLoading) return <WeatherMessage isLoading message="Consultando as condições atuais..." />
  if (model.error) return <WeatherMessage isError message={model.error} />
  if (model.weather) return <WeatherCard weather={model.weather} />
  return <WeatherMessage message="Busque uma cidade para ver o clima atual." />
}
