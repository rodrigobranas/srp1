import { describe, expect, it } from 'vitest';
import { invalidPayloadError, isPayload, readArray, readNumber, readString } from './open-meteo-payload';

describe('open-meteo payload readers', () => {
  it.each([
    [{ timezone: 'UTC' }, true],
    [[], false],
    [null, false],
    ['UTC', false],
  ])('recognizes only JSON objects as provider payloads: %j', (value, expected) => {
    // When
    const result = isPayload(value);
    // Then
    expect(result).toBe(expected);
  });
  it.each([
    [21.5, 21.5],
    [0, 0],
    [null, null],
    ['21.5', null],
    [Number.NaN, null],
  ])('keeps only finite measurements: %j', (value, expected) => {
    // When
    const measurement = readNumber(value);
    // Then
    expect(measurement).toBe(expected);
  });
  it.each([
    ['Texas', 'Texas'],
    ['  ', null],
    [undefined, null],
    [42, null],
  ])('keeps only filled texts: %j', (value, expected) => {
    // When
    const text = readString(value);
    // Then
    expect(text).toBe(expected);
  });
  it('treats a missing list as empty', () => {
    // When
    const values = [readArray(undefined), readArray([1, 2])];
    // Then
    expect(values).toEqual([[], [1, 2]]);
  });
  it('builds an unavailable-provider error with a safe message', () => {
    // When
    const error = invalidPayloadError('Location search is temporarily unavailable.');
    // Then
    expect(error).toMatchObject({ code: 'WEATHER_SOURCE_ERROR', status: 502, message: 'Location search is temporarily unavailable.' });
  });
});
