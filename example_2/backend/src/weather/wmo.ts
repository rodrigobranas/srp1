/**
 * WMO weather interpretation codes used by Open-Meteo.
 * https://open-meteo.com/en/docs#weather_variable_documentation
 */

export type WeatherIcon =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'freezing-rain'
  | 'snow'
  | 'showers'
  | 'thunderstorm'
  | 'thunderstorm-hail';

export interface WeatherCondition {
  code: number;
  label: string;
  icon: WeatherIcon;
}

const CONDITIONS: Record<number, { label: string; icon: WeatherIcon }> = {
  0: { label: 'Céu limpo', icon: 'clear' },
  1: { label: 'Predominantemente limpo', icon: 'partly-cloudy' },
  2: { label: 'Parcialmente nublado', icon: 'partly-cloudy' },
  3: { label: 'Nublado', icon: 'cloudy' },
  45: { label: 'Nevoeiro', icon: 'fog' },
  48: { label: 'Nevoeiro congelante', icon: 'fog' },
  51: { label: 'Garoa leve', icon: 'drizzle' },
  53: { label: 'Garoa moderada', icon: 'drizzle' },
  55: { label: 'Garoa intensa', icon: 'drizzle' },
  56: { label: 'Garoa congelante leve', icon: 'freezing-rain' },
  57: { label: 'Garoa congelante intensa', icon: 'freezing-rain' },
  61: { label: 'Chuva fraca', icon: 'rain' },
  63: { label: 'Chuva moderada', icon: 'rain' },
  65: { label: 'Chuva forte', icon: 'rain' },
  66: { label: 'Chuva congelante fraca', icon: 'freezing-rain' },
  67: { label: 'Chuva congelante forte', icon: 'freezing-rain' },
  71: { label: 'Neve fraca', icon: 'snow' },
  73: { label: 'Neve moderada', icon: 'snow' },
  75: { label: 'Neve forte', icon: 'snow' },
  77: { label: 'Grãos de neve', icon: 'snow' },
  80: { label: 'Pancadas de chuva fracas', icon: 'showers' },
  81: { label: 'Pancadas de chuva moderadas', icon: 'showers' },
  82: { label: 'Pancadas de chuva violentas', icon: 'showers' },
  85: { label: 'Pancadas de neve fracas', icon: 'snow' },
  86: { label: 'Pancadas de neve fortes', icon: 'snow' },
  95: { label: 'Trovoada', icon: 'thunderstorm' },
  96: { label: 'Trovoada com granizo', icon: 'thunderstorm-hail' },
  99: { label: 'Trovoada com granizo forte', icon: 'thunderstorm-hail' },
};

export function describeWeatherCode(code: number): WeatherCondition {
  const condition = CONDITIONS[code];
  if (!condition) {
    return { code, label: 'Condição desconhecida', icon: 'cloudy' };
  }
  return { code, ...condition };
}
