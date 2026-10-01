import { createContext } from 'react'
import { Theme } from '@/lib/theme-preference'

export interface ThemeContextValue {
  theme: Theme
  toggleTheme(): void
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)
