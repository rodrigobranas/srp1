import { Router, Request, Response, NextFunction } from 'express';
import { searchFlights } from '../services/flight-service';

export const flightRoutes = Router();

flightRoutes.get('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { origin, destination, date } = req.query;

    if (typeof origin !== 'string' || typeof destination !== 'string' || typeof date !== 'string') {
      res.status(400).json({ error: 'Informe origin, destination e date.' });
      return;
    }

    const result = await searchFlights({ origin, destination, date });
    res.json(result);
  } catch (error) {
    next(error);
  }
});
