import { randomUUID } from 'node:crypto';
import { Router, Request, Response } from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import { createFlightMcpServer } from './server';

type McpTransport = StreamableHTTPServerTransport;

const transports = new Map<string, McpTransport>();

export const mcpRoutes = Router();

mcpRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    let transport = sessionId ? transports.get(sessionId) : undefined;

    if (!transport && !sessionId && isInitializeRequest(req.body)) {
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (newSessionId) => {
          transports.set(newSessionId, transport as McpTransport);
        },
      });

      transport.onclose = () => {
        if (transport?.sessionId) {
          transports.delete(transport.sessionId);
        }
      };

      const server = createFlightMcpServer();
      await server.connect(transport);
    }

    if (!transport) {
      res.status(400).json({ error: 'Sessão MCP ausente ou inválida. Inicialize o cliente primeiro.' });
      return;
    }

    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error('MCP POST error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Erro ao processar requisição MCP.' });
    }
  }
});

mcpRoutes.get('/', async (req: Request, res: Response) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  const transport = sessionId ? transports.get(sessionId) : undefined;

  if (!transport) {
    res.status(400).json({ error: 'Sessão MCP ausente ou inválida.' });
    return;
  }

  await transport.handleRequest(req, res);
});

mcpRoutes.delete('/', async (req: Request, res: Response) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  const transport = sessionId ? transports.get(sessionId) : undefined;

  if (!transport) {
    res.status(404).json({ error: 'Sessão MCP não encontrada.' });
    return;
  }

  await transport.handleRequest(req, res);
});
