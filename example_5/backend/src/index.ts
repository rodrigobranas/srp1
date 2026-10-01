import dotenv from 'dotenv';
import { createApp } from './app';
import { createOpenMeteoGeocodingGateway } from './gateway/open-meteo-geocoding-gateway';
import { createOpenMeteoWeatherGateway } from './gateway/open-meteo-weather-gateway';
import { createWeatherService } from './services/weather-service';

dotenv.config();

const weatherService = createWeatherService({
  locationGateway: createOpenMeteoGeocodingGateway(),
  forecastGateway: createOpenMeteoWeatherGateway(),
});
const app = createApp(weatherService);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Weather API is running at http://localhost:${PORT}`);
});
