import { ErrorRequestHandler } from 'express';
import { WeatherError } from '../types/weather-error';

export const errorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  if (response.headersSent) return next(error);
  const apiError = toApiError(error);
  response.locals.errorCategory = apiError.code;
  return response.status(apiError.status).json({ error: { code: apiError.code, message: apiError.message } });
};

function toApiError(error: unknown) {
  if (error instanceof WeatherError) return error;
  if (isInvalidJson(error)) {
    return { status: 400, code: 'INVALID_COORDINATES', message: 'The request body must contain valid JSON.' };
  }
  return { status: 500, code: 'INTERNAL_ERROR', message: 'An unexpected error occurred.' };
}

function isInvalidJson(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false;
  const details = error as { status?: unknown; type?: unknown };
  return details.status === 400 && details.type === 'entity.parse.failed';
}
