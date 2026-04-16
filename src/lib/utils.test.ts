import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('utils > cn', () => {
  it('merges tailwind classes properly', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white')
  })

  it('resolves conflicting tailwind classes', () => {
    expect(cn('p-4 text-center', 'p-8')).toBe('text-center p-8')
  })

  it('handles conditional classes', () => {
    const isTrue = true
    const isFalse = false
    expect(cn('font-bold', isTrue && 'block', isFalse && 'hidden')).toBe('font-bold block')
  })

  it('handles arrays and undefined', () => {
    expect(cn(['flex', 'items-center'], undefined, null)).toBe('flex items-center')
  })
})
