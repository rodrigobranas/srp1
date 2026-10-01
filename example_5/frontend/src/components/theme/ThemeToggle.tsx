import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const Icon = theme === 'dark' ? Sun : Moon
  return (
    <button type="button" aria-pressed={theme === 'dark'} onClick={toggleTheme} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-card-foreground transition hover:bg-accent focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-ring">
      <Icon aria-hidden="true" size={18} />
      <span>Alternar tema</span>
    </button>
  )
}
