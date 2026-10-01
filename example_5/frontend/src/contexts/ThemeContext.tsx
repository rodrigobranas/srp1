import { PropsWithChildren, useLayoutEffect, useState } from 'react'
import { applyTheme, getInitialTheme, saveTheme } from '@/lib/theme-preference'
import { ThemeContext } from './theme-context'

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState(getInitialTheme)
  useLayoutEffect(() => applyTheme(theme), [theme])
  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    saveTheme(nextTheme)
    setTheme(nextTheme)
  }
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}
