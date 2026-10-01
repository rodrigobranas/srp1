import cors from 'cors';
import express, { Express } from 'express';
import { errorHandler } from './middleware/error-handler';
import { observeWeatherRequest, WeatherLogger } from './middleware/weather-observer';
import { createWeatherRouter } from './routes/weather-routes';
import { WeatherService } from './types/weather';

export function createApp(service: WeatherService, logger: WeatherLogger = (entry) => console.info(entry)): Express {
  const app = express();
  app.use(cors());
  app.use('/weather/locations', observeWeatherRequest('/weather/locations', logger));
  app.use('/weather', observeWeatherRequest('/weather', logger));
  app.post('/weather', (_request, response, next) => { response.setHeader('Cache-Control', 'no-store'); next(); });
  app.use(express.json());
  app.get('/health', (_request, response) => response.json({ status: 'healthy', timestamp: new Date().toISOString() }));
  app.use('/weather', createWeatherRouter(service));
  app.use(errorHandler);
  return app;
}
