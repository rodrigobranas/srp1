import { WeatherError } from '../types/weather-error';

export const OPEN_METEO_TIMEOUT_MS = 4000;

export type FetchFunction = (url: URL, init: { signal: AbortSignal }) => Promise<Response>;

export interface OpenMeteoClientOptions {
  fetch?: FetchFunction;
  timeoutMs?: number;
}

export interface SourceErrorMessages {
  failure: string;
  timeout: string;
}

export interface OpenMeteoClient {
  getJson(url: URL, messages: SourceErrorMessages): Promise<unknown>;
}

export function createOpenMeteoClient(options: OpenMeteoClientOptions = {}): OpenMeteoClient {
  const fetchSource: FetchFunction = options.fetch ?? ((url, init) => fetch(url, init));
  const timeoutMs = options.timeoutMs ?? OPEN_METEO_TIMEOUT_MS;
  return {
    async getJson(url, messages) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const response = await fetchSource(url, { signal: controller.signal });
        return await readJson(response, messages);
      } catch (error) {
        throw classifySourceFailure(error, controller.signal, messages);
      } finally {
        clearTimeout(timer);
      }
    },
  };
}

async function readJson(response: Response, messages: SourceErrorMessages): Promise<unknown> {
  if (!response.ok) throw new WeatherError('WEATHER_SOURCE_ERROR', messages.failure);
  return response.json();
}

function classifySourceFailure(
  error: unknown,
  signal: AbortSignal,
  messages: SourceErrorMessages,
): WeatherError {
  if (error instanceof WeatherError) return error;
  if (signal.aborted) return new WeatherError('WEATHER_SOURCE_TIMEOUT', messages.timeout, { cause: error });
  return new WeatherError('WEATHER_SOURCE_ERROR', messages.failure, { cause: error });
}
