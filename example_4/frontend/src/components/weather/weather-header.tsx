import { RadioTower } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Theme } from '@/types/theme'

interface WeatherHeaderProps {
  onThemeChange: (theme: Theme) => void
  theme: Theme
}

export function WeatherHeader({ onThemeChange, theme }: WeatherHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-slate-900/10 py-5 dark:border-cyan-100/10 sm:py-7">
      <div className="flex items-center gap-3 text-slate-900 dark:text-slate-50">
        <RadioTower aria-hidden="true" size={20} className="text-cyan-700 dark:text-cyan-300" />
        <span className="text-sm font-semibold tracking-[0.16em]">CLIMA AGORA</span>
      </div>
      <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
    </header>
  )
}
