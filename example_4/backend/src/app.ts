import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import { WeatherError } from './errors/weather-error'
import { weatherRouter } from './routes/weather-route'

export function createApp() {
  const app = express()
  app.use(cors())
  app.use(express.json())
  app.get('/health', healthCheck)
  app.use('/weather', weatherRouter)
  app.use(handleError)
  return app
}

function healthCheck(_request: Request, response: Response) {
  return response.json({ status: 'healthy', timestamp: new Date().toISOString() })
}

function handleError(error: unknown, _request: Request, response: Response, _next: NextFunction) {
  if (error instanceof WeatherError) return response.status(error.statusCode).json({ error: error.message })
  return response.status(500).json({ error: 'An unexpected error occurred' })
}
