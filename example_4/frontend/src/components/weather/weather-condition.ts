export function getWeatherCondition(weatherCode: number): string {
  if (weatherCode === 0) return 'Céu limpo'
  if ([1, 2].includes(weatherCode)) return 'Parcialmente nublado'
  if (weatherCode === 3) return 'Nublado'
  if ([45, 48].includes(weatherCode)) return 'Neblina'
  if ([51, 53, 55, 56, 57].includes(weatherCode)) return 'Garoa'
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) return 'Chuva'
  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return 'Neve'
  if ([95, 96, 99].includes(weatherCode)) return 'Trovoadas'
  return 'Condições variáveis'
}
