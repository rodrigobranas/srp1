import { Request, Response, Router } from 'express'
import { WeatherError } from '../errors/weather-error'
import { getWeatherByCity } from '../services/get-weather-by-city'

export const weatherRouter = Router()

weatherRouter.get('/', async (request: Request, response: Response) => {
  const city = getCityQuery(request.query.city)
  const weather = await getWeatherByCity(city)
  return response.json(weather)
})

function getCityQuery(value: unknown): string {
  if (typeof value === 'string') return value
  throw new WeatherError('A city query parameter is required', 400)
}
