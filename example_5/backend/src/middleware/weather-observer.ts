import { NextFunction, Request, Response } from 'express';
import { performance } from 'node:perf_hooks';

type WeatherLogEvent = {
  event: 'request_started' | 'request_finished';
  route: string;
  durationMs: number;
  result: 'pending' | 'success' | 'error';
  errorCategory: string | null;
};

export type WeatherLogger = (entry: string) => void;

export function observeWeatherRequest(route: string, logger: WeatherLogger) {
  return (request: Request, response: Response, next: NextFunction) => {
    const requestRoute = `${request.baseUrl}${request.path}`.replace(/\/$/, '');
    if (requestRoute !== route) return next();
    const startedAt = performance.now();
    logger(serializeEvent({ event: 'request_started', route, durationMs: 0, result: 'pending', errorCategory: null }));
    response.on('finish', () => logCompletion(response, route, startedAt, logger));
    next();
  };
}

function logCompletion(response: Response, route: string, startedAt: number, logger: WeatherLogger) {
  const isSuccess = response.statusCode < 400;
  const errorCategory = response.locals.errorCategory as string | undefined;
  logger(serializeEvent({
    event: 'request_finished',
    route,
    durationMs: Math.round(performance.now() - startedAt),
    result: isSuccess ? 'success' : 'error',
    errorCategory: errorCategory ?? (isSuccess ? null : 'HTTP_ERROR'),
  }));
}

function serializeEvent(event: WeatherLogEvent): string {
  return JSON.stringify(event);
}
