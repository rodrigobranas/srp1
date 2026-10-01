export const WEATHER_ERROR_STATUS = {
  INVALID_QUERY: 400,
  INVALID_COORDINATES: 400,
  WEATHER_SOURCE_ERROR: 502,
  WEATHER_SOURCE_TIMEOUT: 504,
} as const;

export type WeatherErrorCode = keyof typeof WEATHER_ERROR_STATUS;

export class WeatherError extends Error {
  readonly code: WeatherErrorCode;
  readonly status: number;

  constructor(code: WeatherErrorCode, message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'WeatherError';
    this.code = code;
    this.status = WEATHER_ERROR_STATUS[code];
  }
}
