import { Router, type NextFunction, type Request, type Response } from 'express';
import { HttpError } from './http-error';
import {
  getWeatherByCity,
  getWeatherByCoordinates,
  getWeatherByPlaceId,
  suggestCities,
} from './weather-service';

const MAX_CITY_LENGTH = 100;

function readCoordinate(value: unknown, name: string, max: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || Math.abs(parsed) > max) {
    throw new HttpError(400, `O parâmetro "${name}" deve ser um número entre -${max} e ${max}.`);
  }
  return parsed;
}

function readCity(value: unknown): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new HttpError(400, 'Informe o parâmetro "city" ou o par "latitude"/"longitude".');
  }
  const city = value.trim();
  if (city.length > MAX_CITY_LENGTH) {
    throw new HttpError(400, `O parâmetro "city" deve ter no máximo ${MAX_CITY_LENGTH} caracteres.`);
  }
  return city;
}

export const weatherRouter: Router = Router();

/**
 * GET /weather?city=Recife
 * GET /weather?placeId=3390760          (exact match picked from the autocomplete)
 * GET /weather?latitude=-8.05&longitude=-34.88
 */
weatherRouter.get('/weather', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { city, placeId, latitude, longitude } = req.query;

    if (placeId !== undefined) {
      const id = Number(placeId);
      if (!Number.isInteger(id) || id <= 0) {
        throw new HttpError(400, 'O parâmetro "placeId" deve ser um inteiro positivo.');
      }
      res.json(await getWeatherByPlaceId(id));
      return;
    }

    if (latitude !== undefined || longitude !== undefined) {
      const report = await getWeatherByCoordinates(
        readCoordinate(latitude, 'latitude', 90),
        readCoordinate(longitude, 'longitude', 180),
      );
      res.json(report);
      return;
    }

    const report = await getWeatherByCity(readCity(city));
    res.json(report);
  } catch (error) {
    next(error);
  }
});

/** GET /weather/cities?q=rec — autocomplete for the search box. */
weatherRouter.get('/weather/cities', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    if (query.length < 2) {
      res.json({ results: [] });
      return;
    }
    res.json({ results: await suggestCities(query.slice(0, MAX_CITY_LENGTH)) });
  } catch (error) {
    next(error);
  }
});
