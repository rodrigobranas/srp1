const DEFAULT_TIMEOUT_MS = 8000

function messageFor(error: GeolocationPositionError): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Permissão de localização negada.'
    case error.POSITION_UNAVAILABLE:
      return 'Sua localização não está disponível.'
    default:
      return 'Não foi possível obter sua localização.'
  }
}

/**
 * Promise wrapper around `getCurrentPosition`.
 *
 * The API's own `timeout` only bounds acquiring the position — it does not run
 * while the permission prompt is open. If the user never answers it, neither
 * callback ever fires, so we race it against our own timer to be sure this
 * always settles.
 */
export function requestPosition(timeoutMs = DEFAULT_TIMEOUT_MS): Promise<GeolocationCoordinates> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Seu navegador não oferece geolocalização.'))
      return
    }

    let settled = false
    let timer: ReturnType<typeof setTimeout>

    const settle = (action: () => void) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      action()
    }

    timer = setTimeout(
      () => settle(() => reject(new Error('Tempo esgotado ao obter sua localização.'))),
      timeoutMs,
    )

    navigator.geolocation.getCurrentPosition(
      (position) => settle(() => resolve(position.coords)),
      (error) => settle(() => reject(new Error(messageFor(error)))),
      { timeout: timeoutMs, maximumAge: 10 * 60 * 1000 },
    )
  })
}
