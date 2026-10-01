import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const frontendRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

describe('frontend favicon', () => {
  it('serves the icon declared by the application document', () => {
    // Given
    const indexHtml = readFileSync(resolve(frontendRoot, 'index.html'), 'utf8')
    const faviconPath = resolve(frontendRoot, 'public/favicon.svg')
    // When
    const faviconIsDeclaredAndAvailable = indexHtml.includes('href="/favicon.svg"') && existsSync(faviconPath)
    // Then
    expect(faviconIsDeclaredAndAvailable).toBe(true)
  })
})
