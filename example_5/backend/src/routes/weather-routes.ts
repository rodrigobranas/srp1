import { Router } from 'express';
import { parseCoordinates, parseLocationQuery } from '../services/weather-validation';
import { WeatherService } from '../types/weather';

export function createWeatherRouter(service: WeatherService): Router {
  const router = Router();
  router.get('/locations', async (request, response) => {
    const query = parseLocationQuery(request.query.query);
    const locations = await service.searchLocations(query);
    return response.json({ locations });
  });
  router.post('/', async (request, response) => {
    const coordinates = parseCoordinates(request.body);
    const forecast = await service.getForecast(coordinates);
    return response.json(forecast);
  });
  return router;
}
