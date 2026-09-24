import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;
const OPEN_METEO_GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const OPEN_METEO_WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

class WeatherServiceError extends Error {
  constructor(message: string, public readonly statusCode = 502) {
    super(message);
    this.name = 'WeatherServiceError';
  }
}

interface GeocodingResult {
  name: string;
  country?: string;
  country_code?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

interface GeocodingResponse {
  results?: GeocodingResult[];
}

interface ForecastResponse {
  timezone: string;
  current?: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
    is_day: number;
  };
  daily?: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
  };
}

async function fetchOpenMeteo<T>(url: URL): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new WeatherServiceError(`Open-Meteo respondeu com status ${response.status}.`);
    }

    return await response.json() as T;
  } catch (error) {
    if (error instanceof WeatherServiceError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new WeatherServiceError('A consulta ao serviço de clima demorou demais.');
    }

    throw new WeatherServiceError('Não foi possível conectar ao serviço de clima.');
  } finally {
    clearTimeout(timeout);
  }
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req: Request, res: Response) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/weather', async (req: Request, res: Response, next: NextFunction) => {
  const city = typeof req.query.city === 'string' ? req.query.city.trim() : '';

  if (!city) {
    res.status(400).json({ error: 'Informe uma cidade para consultar o clima.' });
    return;
  }

  if (city.length > 100) {
    res.status(400).json({ error: 'Informe uma cidade com até 100 caracteres.' });
    return;
  }

  try {
    const geocodingUrl = new URL(OPEN_METEO_GEOCODING_URL);
    geocodingUrl.searchParams.set('name', city);
    geocodingUrl.searchParams.set('count', '1');
    geocodingUrl.searchParams.set('language', 'pt');
    geocodingUrl.searchParams.set('format', 'json');

    const geocoding = await fetchOpenMeteo<GeocodingResponse>(geocodingUrl);
    const location = geocoding.results?.[0];

    if (!location) {
      res.status(404).json({ error: `Não encontramos a cidade “${city}”.` });
      return;
    }

    const weatherUrl = new URL(OPEN_METEO_WEATHER_URL);
    weatherUrl.searchParams.set('latitude', String(location.latitude));
    weatherUrl.searchParams.set('longitude', String(location.longitude));
    weatherUrl.searchParams.set(
      'current',
      'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,is_day',
    );
    weatherUrl.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,weather_code');
    weatherUrl.searchParams.set('timezone', 'auto');
    weatherUrl.searchParams.set('forecast_days', '5');

    const forecast = await fetchOpenMeteo<ForecastResponse>(weatherUrl);

    if (!forecast.current || !forecast.daily) {
      throw new WeatherServiceError('A resposta do serviço de clima está incompleta.');
    }

    res.json({
      location: {
        name: location.name,
        country: location.country ?? location.country_code ?? '',
        region: location.admin1 ?? '',
        latitude: location.latitude,
        longitude: location.longitude,
        timezone: forecast.timezone || location.timezone || 'auto',
      },
      current: {
        time: forecast.current.time,
        temperature: forecast.current.temperature_2m,
        apparentTemperature: forecast.current.apparent_temperature,
        humidity: forecast.current.relative_humidity_2m,
        precipitation: forecast.current.precipitation,
        weatherCode: forecast.current.weather_code,
        windSpeed: forecast.current.wind_speed_10m,
        isDay: forecast.current.is_day === 1,
      },
      daily: forecast.daily.time.map((date, index) => ({
        date,
        maxTemperature: forecast.daily?.temperature_2m_max[index] ?? 0,
        minTemperature: forecast.daily?.temperature_2m_min[index] ?? 0,
        weatherCode: forecast.daily?.weather_code[index] ?? 0,
      })),
    });
  } catch (error) {
    next(error);
  }
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);

  if (err instanceof WeatherServiceError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  res.status(500).json({ error: 'Não foi possível carregar o clima agora.' });
});

// Start server
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
