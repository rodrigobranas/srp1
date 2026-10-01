import { afterEach, describe, expect, it, vi } from 'vitest';
import { createFetchStub, createJsonResponse, createUnansweredFetch } from '../tests/fake-fetch';
import { createOpenMeteoClient, OPEN_METEO_TIMEOUT_MS } from './open-meteo-client';

const sourceUrl = new URL('https://api.open-meteo.com/v1/forecast?latitude=0&longitude=0');
const messages = { failure: 'Provider unavailable.', timeout: 'Provider timed out.' };

afterEach(() => {
  vi.useRealTimers();
});

describe('createOpenMeteoClient', () => {
  it('returns the provider payload when the provider answers successfully', async () => {
    // Given
    const fetch = createFetchStub(createJsonResponse({ timezone: 'America/Sao_Paulo' }));
    const client = createOpenMeteoClient({ fetch });
    // When
    const payload = await client.getJson(sourceUrl, messages);
    // Then
    expect(payload).toEqual({ timezone: 'America/Sao_Paulo' });
    expect(fetch).toHaveBeenCalledWith(sourceUrl, { signal: expect.any(AbortSignal) });
  });
  it('reports a timeout after the provider stays silent for four seconds', async () => {
    // Given
    vi.useFakeTimers();
    const fetch = createUnansweredFetch();
    const client = createOpenMeteoClient({ fetch });
    // When
    const failure = client.getJson(sourceUrl, messages).catch((error: unknown) => error);
    await vi.advanceTimersByTimeAsync(OPEN_METEO_TIMEOUT_MS - 1);
    const abortedBeforeLimit = fetch.mock.calls[0][1].signal.aborted;
    await vi.advanceTimersByTimeAsync(1);
    // Then
    expect(OPEN_METEO_TIMEOUT_MS).toBe(4000);
    expect(abortedBeforeLimit).toBe(false);
    expect(await failure).toMatchObject({ code: 'WEATHER_SOURCE_TIMEOUT', status: 504, message: 'Provider timed out.' });
  });
  it('reports an unavailable provider without exposing its error body', async () => {
    // Given
    const reason = 'Latitude must be in range of -90 to 90°. Given: -123.0.';
    const fetch = createFetchStub(createJsonResponse({ error: true, reason }, 400));
    const client = createOpenMeteoClient({ fetch });
    // When
    const failure = await client.getJson(sourceUrl, messages).catch((error: unknown) => error);
    // Then
    expect(failure).toMatchObject({ code: 'WEATHER_SOURCE_ERROR', status: 502, message: 'Provider unavailable.' });
    expect(String(failure)).not.toContain(reason);
  });
  it('reports an unavailable provider when it answers with malformed JSON', async () => {
    // Given
    const fetch = createFetchStub(new Response('<html>Bad gateway</html>', { status: 200 }));
    const client = createOpenMeteoClient({ fetch });
    // When
    const failure = client.getJson(sourceUrl, messages);
    // Then
    await expect(failure).rejects.toMatchObject({ code: 'WEATHER_SOURCE_ERROR', status: 502 });
  });
  it('reports an unavailable provider when the network connection fails', async () => {
    // Given
    const fetch = createFetchStub(createJsonResponse({}));
    fetch.mockRejectedValue(new TypeError('fetch failed: ECONNREFUSED 10.0.0.1'));
    const client = createOpenMeteoClient({ fetch });
    // When
    const failure = await client.getJson(sourceUrl, messages).catch((error: unknown) => error);
    // Then
    expect(failure).toMatchObject({ code: 'WEATHER_SOURCE_ERROR', status: 502, message: 'Provider unavailable.' });
  });
  it('uses the native Node fetch when no HTTP client is provided', async () => {
    // Given
    const nativeFetch = createFetchStub(createJsonResponse({ results: [] }));
    vi.stubGlobal('fetch', nativeFetch);
    // When
    const payload = await createOpenMeteoClient().getJson(sourceUrl, messages);
    // Then
    expect(nativeFetch).toHaveBeenCalledWith(sourceUrl, { signal: expect.any(AbortSignal) });
    expect(payload).toEqual({ results: [] });
  });
});
