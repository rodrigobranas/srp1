import { describe, expect, it, vi } from 'vitest';
import { Coordinates, WeatherForecast, WeatherGateways, WeatherLocation } from '../types/weather';
import { createWeatherService } from './weather-service';

function createGatewayStubs(locations: WeatherLocation[] = [], forecast?: WeatherForecast) {
  return {
    locationGateway: { searchLocations: vi.fn().mockResolvedValue(locations) },
    forecastGateway: { getForecast: vi.fn().mockResolvedValue(forecast) },
  } satisfies WeatherGateways;
}

describe('createWeatherService', () => {
  it('rejects a blank search without asking the location provider', async () => {
    // Given
    const gateways = createGatewayStubs();
    const service = createWeatherService(gateways);
    // When
    const search = service.searchLocations('   ');
    // Then
    await expect(search).rejects.toMatchObject({ code: 'INVALID_QUERY', status: 400 });
    expect(gateways.locationGateway.searchLocations).not.toHaveBeenCalled();
  });
  it('rejects coordinates outside the globe without asking the weather provider', async () => {
    // Given
    const gateways = createGatewayStubs();
    const service = createWeatherService(gateways);
    // When
    const forecast = service.getForecast({ latitude: -123, longitude: -46.6361 });
    // Then
    await expect(forecast).rejects.toMatchObject({ code: 'INVALID_COORDINATES', status: 400 });
    expect(gateways.forecastGateway.getForecast).not.toHaveBeenCalled();
  });
  it('searches the provider with the trimmed city name and returns its matches', async () => {
    // Given
    const paris = { id: 1, name: 'Paris', region: 'Texas', country: 'Estados Unidos' } as WeatherLocation;
    const gateways = createGatewayStubs([paris]);
    const service = createWeatherService(gateways);
    // When
    const locations = await service.searchLocations('  Paris ');
    // Then
    expect(gateways.locationGateway.searchLocations).toHaveBeenCalledWith('Paris');
    expect(locations).toEqual([paris]);
  });
  it('returns the forecast of the selected coordinates', async () => {
    // Given
    const selected: Coordinates = { latitude: 33.66094, longitude: -95.55551 };
    const expectedForecast = { timezone: 'America/Chicago' } as WeatherForecast;
    const gateways = createGatewayStubs([], expectedForecast);
    const service = createWeatherService(gateways);
    // When
    const forecast = await service.getForecast(selected);
    // Then
    expect(gateways.forecastGateway.getForecast).toHaveBeenCalledWith(selected);
    expect(forecast).toBe(expectedForecast);
  });
});
