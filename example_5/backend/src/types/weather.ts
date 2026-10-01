export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface WeatherLocation extends Coordinates {
  id: number;
  name: string;
  region: string | null;
  country: string | null;
  countryCode: string | null;
  timezone: string | null;
}

export interface CurrentWeather {
  time: string;
  temperatureC: number | null;
  apparentTemperatureC: number | null;
  relativeHumidityPercent: number | null;
  windSpeedKmh: number | null;
  weatherCode: number | null;
}

export interface WeatherDay {
  date: string;
  weatherCode: number | null;
  minimumTemperatureC: number | null;
  maximumTemperatureC: number | null;
}

export interface WeatherForecast {
  timezone: string;
  current: CurrentWeather;
  daily: WeatherDay[];
}

export interface LocationGateway {
  searchLocations(query: string): Promise<WeatherLocation[]>;
}

export interface ForecastGateway {
  getForecast(input: Coordinates): Promise<WeatherForecast>;
}

export interface WeatherGateways {
  locationGateway: LocationGateway;
  forecastGateway: ForecastGateway;
}

export interface WeatherService {
  searchLocations(query: string): Promise<WeatherLocation[]>;
  getForecast(input: Coordinates): Promise<WeatherForecast>;
}
