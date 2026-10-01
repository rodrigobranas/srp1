import { describe, expect, it } from 'vitest'
import { ClassValue } from 'clsx'
import { cn } from './utils'

describe('cn', () => {
  it('combines conditional classes and keeps the latest Tailwind conflict', () => {
    // Given
    const classes: ClassValue[] = ['rounded-md', false, { 'font-bold': true, underline: false }, 'rounded-xl']
    // When
    const merged = cn(...classes)
    // Then
    expect(merged).toBe('font-bold rounded-xl')
  })
})
