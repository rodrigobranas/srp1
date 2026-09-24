import cors from 'cors';
import express, { Express, NextFunction, Request, Response } from 'express';
import { flightRoutes } from './routes/flight-routes';
import { checkDatabase } from './data/flight-data';
import { mcpRoutes } from './mcp/http-routes';

export const app: Express = express();

app.use(cors({ exposedHeaders: ['Mcp-Session-Id'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    await checkDatabase();
    res.json({ status: 'healthy', database: 'connected', timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});

app.use('/api/flights', flightRoutes);
app.use('/mcp', mcpRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  const status = error.message.includes('inválido') || error.message.includes('devem') || error.message.includes('data') ? 400 : 500;
  res.status(status).json({ error: error.message || 'Erro interno do servidor.' });
});
