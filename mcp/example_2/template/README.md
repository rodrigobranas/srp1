# AeroBusca

Aplicação simples de pesquisa de voos entre FLN, CGH e GRU, com backend Express/TypeScript, PostgreSQL 18.4 e frontend React/Vite.

## Subir o banco

Na pasta `template/`:

```bash
docker compose up -d
```

O PostgreSQL cria automaticamente as tabelas `airlines`, `aircraft` e `flights` e popula voos de 10/06/2026 a 12/06/2026. São 8 horários por dia em cada sentido de cada rota: FLN ↔ CGH e FLN ↔ GRU.

Para recriar tudo em um volume limpo:

```bash
docker compose down -v
docker compose up -d
```

## Rodar a aplicação

Em outro terminal:

```bash
cd backend
npm install
npm run dev
```

Em outro terminal, para a interface:

```bash
cd frontend
npm install
npm run dev
```

Acesse a URL informada pelo Vite, normalmente `http://localhost:5173`.

## API

Health check:

```bash
curl http://localhost:3000/health
```

Pesquisa de ida e volta no mesmo dia:

```bash
curl 'http://localhost:3000/api/flights/search?origin=FLN&destination=CGH&date=2026-06-10'
```

A resposta possui `outboundFlights` e `returnFlights`. A busca aceita apenas as datas de 10/06/2026 a 12/06/2026.

## MCP via Streamable HTTP

O mesmo backend expõe um servidor MCP no endpoint:

```text
http://localhost:3000/mcp
```

O transporte é `StreamableHTTPServerTransport`, com sessões MCP e suporte a `POST`, `GET` e `DELETE`. O servidor usa `@modelcontextprotocol/sdk` e reutiliza a camada `services` da aplicação.

Ferramentas disponíveis:

- `search_flights`: lista os voos de ida e volta para uma origem, destino e data.
- `find_best_same_day_trip`: compara CGH e GRU quando o destino é “São Paulo”, filtra a ida para chegar antes do compromisso, a volta para sair depois dele e retorna a combinação de menor preço, com alternativas.

Exemplo de argumentos para a ferramenta de melhor combinação:

```json
{
  "origin": "FLN",
  "destination": "São Paulo",
  "date": "2026-06-10",
  "meetingStartTime": "10:00",
  "meetingEndTime": "17:00",
  "sameDay": true
}
```

Um cliente MCP deve apontar seu `StreamableHTTPClientTransport` para `http://localhost:3000/mcp`.

## Organização do backend

- `src/routes`: camada HTTP e validação do formato dos parâmetros.
- `src/services`: orquestração da busca, validações e consulta de ida/volta.
- `src/data`: acesso ao PostgreSQL usando `pg-promise` e transformação dos registros.
- `database/init`: schema, índices, relacionamentos e seed inicial.
