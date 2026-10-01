import { useState } from 'react'
import { Coordinates } from '@/types/weather'

export type BrowserGeolocation = Pick<Geolocation, 'getCurrentPosition'>
export type BrowserLocationResult = { coordinates: Coordinates; error: null } | { coordinates: null; error: string }

export function useBrowserLocation(geolocation: BrowserGeolocation | null = getGeolocation()) {
  const [isLocating, setIsLocating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  async function requestLocation(): Promise<BrowserLocationResult> {
    if (!geolocation) {
      const message = 'Este navegador não oferece localização. Você ainda pode pesquisar uma cidade.'
      setError(message)
      return { coordinates: null, error: message }
    }
    setIsLocating(true)
    setError(null)
    return new Promise((resolve) => requestPosition(geolocation, (result) => {
      setIsLocating(false)
      setError(result.error)
      resolve(result)
    }))
  }
  return { isLocating, error, requestLocation }
}

function requestPosition(geolocation: BrowserGeolocation, finish: (result: BrowserLocationResult) => void) {
  try {
    geolocation.getCurrentPosition(
      (position) => finish({ coordinates: { latitude: position.coords.latitude, longitude: position.coords.longitude }, error: null }),
      (failure) => finish({ coordinates: null, error: getLocationError(failure) }),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    )
  } catch {
    finish({ coordinates: null, error: 'Não foi possível acessar sua localização. Você ainda pode pesquisar uma cidade.' })
  }
}

function getLocationError(error: GeolocationPositionError): string {
  if (error.code === 1) return 'A permissão de localização foi negada. Você ainda pode pesquisar uma cidade.'
  return 'Não foi possível obter sua localização. Você ainda pode pesquisar uma cidade.'
}

function getGeolocation(): BrowserGeolocation | null {
  return typeof navigator === 'undefined' ? null : navigator.geolocation ?? null
}
