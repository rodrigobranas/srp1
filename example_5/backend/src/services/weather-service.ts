import { Coordinates, WeatherGateways, WeatherService } from '../types/weather';
import { parseCoordinates, parseLocationQuery } from './weather-validation';

export function createWeatherService(gateways: WeatherGateways): WeatherService {
  return {
    async searchLocations(query: string) {
      return gateways.locationGateway.searchLocations(parseLocationQuery(query));
    },
    async getForecast(input: Coordinates) {
      return gateways.forecastGateway.getForecast(parseCoordinates(input));
    },
  };
}
