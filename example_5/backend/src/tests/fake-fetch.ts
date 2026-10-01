import { Mock, vi } from 'vitest';
import { FetchFunction } from '../gateway/open-meteo-client';

export function createJsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

export function createFetchStub(response: Response): Mock<FetchFunction> {
  return vi.fn<FetchFunction>().mockResolvedValue(response);
}

export function createUnansweredFetch(): Mock<FetchFunction> {
  return vi.fn<FetchFunction>(
    (_url, init) =>
      new Promise<Response>((_resolve, reject) => {
        init.signal.addEventListener('abort', () => reject(init.signal.reason));
      }),
  );
}

export function getRequestedUrl(fetch: Mock<FetchFunction>): URL {
  return fetch.mock.calls[0][0];
}
