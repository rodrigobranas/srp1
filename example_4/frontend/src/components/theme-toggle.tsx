import { Moon, Sun } from 'lucide-react'
import { Theme } from '@/types/theme'

interface ThemeToggleProps {
  onThemeChange: (theme: Theme) => void
  theme: Theme
}

const buttonClasses = 'flex h-9 w-9 items-center justify-center rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500'

export function ThemeToggle({ onThemeChange, theme }: ThemeToggleProps) {
  return (
    <div aria-label="Selecionar tema" role="group" className="inline-flex rounded-xl bg-slate-200 p-1 shadow-sm dark:bg-slate-800">
      <button aria-label="Tema claro" aria-pressed={theme === 'light'} className={`${buttonClasses} ${theme === 'light' ? 'bg-white text-amber-500 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`} onClick={() => onThemeChange('light')} type="button"><Sun aria-hidden="true" size={18} /></button>
      <button aria-label="Tema escuro" aria-pressed={theme === 'dark'} className={`${buttonClasses} ${theme === 'dark' ? 'bg-slate-700 text-sky-300 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`} onClick={() => onThemeChange('dark')} type="button"><Moon aria-hidden="true" size={18} /></button>
    </div>
  )
}
