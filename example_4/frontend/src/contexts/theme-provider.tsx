import { ReactNode, useEffect, useState } from 'react'
import { ThemeContext } from '@/contexts/theme-context'
import { Theme } from '@/types/theme'

interface ThemeProviderProps {
  children: ReactNode
}

const storageKey = 'weather-theme'

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  useEffect(() => syncTheme(theme), [theme])
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

function getInitialTheme(): Theme {
  const storedTheme = localStorage.getItem(storageKey)
  if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme
  return 'dark'
}

function syncTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  localStorage.setItem(storageKey, theme)
}
