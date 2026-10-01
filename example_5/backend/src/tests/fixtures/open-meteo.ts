export function createGeocodingPayload() {
  return {
    results: [
      {
        id: 2988507,
        name: 'Paris',
        latitude: 48.85341,
        longitude: 2.3488,
        country_code: 'FR',
        timezone: 'Europe/Paris',
        country: 'França',
        admin1: 'Île-de-France',
      },
      {
        id: 4717560,
        name: 'Paris',
        latitude: 33.66094,
        longitude: -95.55551,
        country_code: 'US',
        timezone: 'America/Chicago',
        country: 'Estados Unidos',
        admin1: 'Texas',
      },
    ],
    generationtime_ms: 0.58,
  };
}

export function createForecastPayload() {
  return {
    latitude: -23.514938,
    longitude: -46.610504,
    timezone: 'America/Sao_Paulo',
    current: {
      time: '2026-10-01T09:15',
      interval: 900,
      temperature_2m: 23.3,
      apparent_temperature: 23.7,
      relative_humidity_2m: 69,
      wind_speed_10m: 14.4,
      weather_code: 95,
    },
    daily: {
      time: ['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04', '2026-10-05', '2026-10-06', '2026-10-07'],
      weather_code: [95, 53, 81, 95, 95, 80, 51],
      temperature_2m_min: [19.3, 15, 14.9, 17.1, 17.2, 18.9, 17.2],
      temperature_2m_max: [25.8, 19.2, 21.2, 25.1, 26.2, 24.3, 22.1],
    },
  };
}
