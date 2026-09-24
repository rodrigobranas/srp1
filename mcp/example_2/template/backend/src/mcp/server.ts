import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { findBestSameDayTrip, searchFlights } from '../services/flight-service';

export const createFlightMcpServer = (): McpServer => {
  const server = new McpServer(
    {
      name: 'aerobusca-flights',
      version: '1.0.0',
    },
    {
      instructions: 'Use find_best_same_day_trip quando o usuário descrever uma viagem com compromissos ou quiser a melhor combinação de ida e volta. Para uma listagem sem otimização, use search_flights.',
    },
  );

  const flightSearchInput = {
    origin: z.string().describe('Aeroporto de origem, por exemplo FLN.'),
    destination: z.string().describe('Aeroporto de destino: CGH, GRU ou São Paulo para considerar os dois aeroportos.'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('Data da viagem no formato YYYY-MM-DD.'),
  };

  server.registerTool(
    'search_flights',
    {
      title: 'Buscar voos de ida e volta',
      description: 'Lista os voos de ida e volta disponíveis na mesma data entre dois aeroportos.',
      inputSchema: flightSearchInput,
    },
    async ({ origin, destination, date }) => {
      try {
        const result = await searchFlights({ origin, destination, date });
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return {
          isError: true,
          content: [{ type: 'text', text: error instanceof Error ? error.message : 'Erro ao buscar voos.' }],
        };
      }
    },
  );

  server.registerTool(
    'find_best_same_day_trip',
    {
      title: 'Encontrar melhor combinação para compromisso',
      description: 'Encontra a combinação mais barata de ida e volta no mesmo dia. A ida chega até meetingStartTime e a volta parte a partir de meetingEndTime. Quando destination é São Paulo, compara CGH e GRU e escolhe o menor total.',
      inputSchema: {
        origin: z.string().describe('Origem, normalmente FLN.'),
        destination: z.string().describe('Destino, podendo ser São Paulo, CGH ou GRU.'),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('Data no formato YYYY-MM-DD.'),
        meetingStartTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional().describe('Horário de início do compromisso, no formato HH:mm.'),
        meetingEndTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional().describe('Horário de término do compromisso, no formato HH:mm.'),
        sameDay: z.boolean().default(true).describe('Mantém ida e volta no mesmo dia; deve permanecer true.'),
      },
    },
    async ({ origin, destination, date, meetingStartTime, meetingEndTime, sameDay }) => {
      try {
        const result = await findBestSameDayTrip({
          origin,
          destination,
          date,
          meetingStartTime,
          meetingEndTime,
          sameDay,
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return {
          isError: true,
          content: [{ type: 'text', text: error instanceof Error ? error.message : 'Erro ao encontrar a melhor combinação.' }],
        };
      }
    },
  );

  return server;
};
