import { ThemeProvider } from '@/contexts/theme-provider'
import { WeatherView } from '@/views/weather-view'

export default function App() {
  return <ThemeProvider><WeatherView /></ThemeProvider>
}
