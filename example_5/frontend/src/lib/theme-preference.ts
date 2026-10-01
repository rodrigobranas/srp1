export type Theme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'weather-dashboard-theme'
const THEME_COLORS: Record<Theme, string> = { light: '#f8fafc', dark: '#09090b' }

export function getInitialTheme(): Theme {
  if (!isReloadNavigation()) return 'dark'
  return readStoredTheme()
}

function isReloadNavigation(): boolean {
  const [navigation] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
  return navigation?.type === 'reload'
}

function readStoredTheme(): Theme {
  try {
    const storedTheme = window.sessionStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(storedTheme) ? storedTheme : 'dark'
  } catch {
    return 'dark'
  }
}

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark'
}

export function saveTheme(theme: Theme): void {
  try {
    window.sessionStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    return
  }
}

export function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (themeColor) themeColor.content = THEME_COLORS[theme]
}
