import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT = Number(process.env.PORT || 3000);

interface GeocodingResult {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

interface GeocodingResponse {
  results?: GeocodingResult[];
}

interface ForecastResponse {
  current?: {
    temperature_2m?: number;
    apparent_temperature?: number;
    relative_humidity_2m?: number;
    weather_code?: number;
    wind_speed_10m?: number;
    time?: string;
  };
  timezone?: string;
}

const weatherCodeMap: Record<number, string> = {
  0: 'Céu limpo',
  1: 'Predominantemente limpo',
  2: 'Parcialmente nublado',
  3: 'Nublado',
  45: 'Nevoeiro',
  48: 'Nevoeiro com geada',
  51: 'Garoa leve',
  53: 'Garoa moderada',
  55: 'Garoa forte',
  56: 'Garoa gelada leve',
  57: 'Garoa gelada forte',
  61: 'Chuva leve',
  63: 'Chuva moderada',
  65: 'Chuva forte',
  66: 'Chuva gelada',
  67: 'Chuva gelada forte',
  71: 'Neve leve',
  73: 'Neve moderada',
  75: 'Neve forte',
  77: 'Granizo',
  80: 'Pancadas de chuva',
  81: 'Chuva intensa',
  82: 'Chuva muito intensa',
  85: 'Neve leve',
  86: 'Neve forte',
  95: 'Trovoada',
  96: 'Trovoada com granizo',
  99: 'Trovoada forte com granizo',
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Open-Meteo request failed (${response.status}): ${message}`);
  }

  return (await response.json()) as T;
}

function parseCoordinate(value: unknown): number | null {
  if (typeof value !== 'string') {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

async function getWeatherForCoordinates(latitude: number, longitude: number) {
  const reverseUrl = new URL('https://geocoding-api.open-meteo.com/v1/reverse');
  reverseUrl.searchParams.set('latitude', latitude.toString());
  reverseUrl.searchParams.set('longitude', longitude.toString());
  reverseUrl.searchParams.set('language', 'pt');
  reverseUrl.searchParams.set('format', 'json');

  const reverseData = await fetchJson<{ results?: GeocodingResult[] }>(reverseUrl.toString());
  const location = reverseData.results?.[0] ?? { name: 'Localização atual', country: 'Local', latitude, longitude };

  const forecastUrl = new URL('https://api.open-meteo.com/v1/forecast');
  forecastUrl.searchParams.set('latitude', latitude.toString());
  forecastUrl.searchParams.set('longitude', longitude.toString());
  forecastUrl.searchParams.set('current', 'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m');
  forecastUrl.searchParams.set('timezone', 'auto');
  forecastUrl.searchParams.set('forecast_days', '1');

  const forecastData = await fetchJson<ForecastResponse>(forecastUrl.toString());

  if (!forecastData.current) {
    throw new Error('Não foi possível obter as condições climáticas atuais.');
  }

  const weatherCode = forecastData.current.weather_code ?? 0;

  return {
    city: location.name,
    country: location.country,
    latitude,
    longitude,
    timezone: forecastData.timezone ?? 'auto',
    current: {
      time: forecastData.current.time ?? new Date().toISOString(),
      temperature: forecastData.current.temperature_2m ?? 0,
      apparentTemperature: forecastData.current.apparent_temperature ?? 0,
      relativeHumidity: forecastData.current.relative_humidity_2m ?? 0,
      windSpeed: forecastData.current.wind_speed_10m ?? 0,
      weatherCode,
      description: weatherCodeMap[weatherCode] ?? 'Condição climática não disponível',
    },
  };
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

app.get('/weather', async (req: Request, res: Response) => {
  try {
    const city = typeof req.query.city === 'string' ? req.query.city.trim() : '';
    const latitude = parseCoordinate(req.query.latitude);
    const longitude = parseCoordinate(req.query.longitude);

    if (city) {
      const geocodingUrl = new URL('https://geocoding-api.open-meteo.com/v1/search');
      geocodingUrl.searchParams.set('name', city);
      geocodingUrl.searchParams.set('count', '1');
      geocodingUrl.searchParams.set('language', 'pt');
      geocodingUrl.searchParams.set('format', 'json');

      const geocodingData = await fetchJson<GeocodingResponse>(geocodingUrl.toString());
      const location = geocodingData.results?.[0];

      if (!location) {
        return res.status(404).json({ error: `Cidade não encontrada para: ${city}` });
      }

      const forecastUrl = new URL('https://api.open-meteo.com/v1/forecast');
      forecastUrl.searchParams.set('latitude', location.latitude.toString());
      forecastUrl.searchParams.set('longitude', location.longitude.toString());
      forecastUrl.searchParams.set('current', 'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m');
      forecastUrl.searchParams.set('timezone', 'auto');
      forecastUrl.searchParams.set('forecast_days', '1');

      const forecastData = await fetchJson<ForecastResponse>(forecastUrl.toString());
      const current = forecastData.current;

      if (!current) {
        return res.status(500).json({ error: 'Não foi possível obter o clima atual.' });
      }

      const weatherCode = current.weather_code ?? 0;

      return res.json({
        city: location.name,
        country: location.country,
        latitude: location.latitude,
        longitude: location.longitude,
        timezone: forecastData.timezone ?? 'auto',
        current: {
          time: current.time ?? new Date().toISOString(),
          temperature: current.temperature_2m ?? 0,
          apparentTemperature: current.apparent_temperature ?? 0,
          relativeHumidity: current.relative_humidity_2m ?? 0,
          windSpeed: current.wind_speed_10m ?? 0,
          weatherCode,
          description: weatherCodeMap[weatherCode] ?? 'Condição climática não disponível',
        },
      });
    }

    if (latitude !== null && longitude !== null) {
      const weather = await getWeatherForCoordinates(latitude, longitude);
      return res.json(weather);
    }

    return res.status(400).json({
      error: 'Informe uma cidade ou coordenadas válidas.',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro inesperado';
    return res.status(500).json({ error: message });
  }
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});