import { createContext } from 'react'
import { Theme } from '@/types/theme'

interface ThemeContextValue {
  setTheme: (theme: Theme) => void
  theme: Theme
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
