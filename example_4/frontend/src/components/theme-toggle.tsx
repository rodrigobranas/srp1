import { Moon, Sun } from 'lucide-react'
import { Theme } from '@/types/theme'

interface ThemeToggleProps {
  onThemeChange: (theme: Theme) => void
  theme: Theme
}

const buttonClasses = 'flex h-9 w-9 items-center justify-center rounded-[9px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500'

export function ThemeToggle({ onThemeChange, theme }: ThemeToggleProps) {
  return (
    <div aria-label="Selecionar tema" role="group" className="inline-flex rounded-[12px] border border-slate-900/10 bg-white/50 p-1 dark:border-cyan-100/15 dark:bg-[#0a1d31]">
      <button aria-label="Tema claro" aria-pressed={theme === 'light'} className={`${buttonClasses} ${theme === 'light' ? 'bg-white text-amber-600 shadow-[0_4px_12px_rgba(15,23,42,0.1)]' : 'text-slate-500 hover:text-slate-900 dark:text-cyan-50/45 dark:hover:text-white'}`} onClick={() => onThemeChange('light')} type="button"><Sun aria-hidden="true" size={18} /></button>
      <button aria-label="Tema escuro" aria-pressed={theme === 'dark'} className={`${buttonClasses} ${theme === 'dark' ? 'bg-cyan-300 text-cyan-950 shadow-[0_4px_12px_rgba(8,47,73,0.35)]' : 'text-slate-500 hover:text-slate-900 dark:text-cyan-50/45 dark:hover:text-white'}`} onClick={() => onThemeChange('dark')} type="button"><Moon aria-hidden="true" size={18} /></button>
    </div>
  )
}
