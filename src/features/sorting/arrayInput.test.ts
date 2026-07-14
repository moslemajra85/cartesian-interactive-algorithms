import { describe, expect, it } from 'vitest'
import { parseArrayInput } from './arrayInput'

describe('parseArrayInput', () => {
  it('parses comma-separated values and normalizes their display', () => {
    expect(parseArrayInput('8,3, 12,5')).toEqual({
      ok: true,
      values: [8, 3, 12, 5],
      normalized: '8, 3, 12, 5',
    })
  })

  it('accepts whitespace and mixed separators', () => {
    expect(parseArrayInput('8  3,\n12 5')).toMatchObject({
      ok: true,
      values: [8, 3, 12, 5],
    })
  })

  it('preserves duplicate values', () => {
    expect(parseArrayInput('4, 4, 2')).toMatchObject({ ok: true, values: [4, 4, 2] })
  })

  it.each(['', '   '])('rejects an empty input', (input) => {
    expect(parseArrayInput(input)).toEqual({ ok: false, error: 'Enter at least two values.' })
  })

  it.each(['4', '1, 2, 3, 4, 5, 6, 7, 8, 9'])('enforces the visualization size limits', (input) => {
    expect(parseArrayInput(input)).toEqual({ ok: false, error: 'Use between 2 and 8 values.' })
  })

  it.each(['2, seven, 4', '2, 3.5, 4', '2, -3, 4'])('rejects tokens that are not unsigned whole numbers', (input) => {
    expect(parseArrayInput(input)).toEqual({ ok: false, error: 'Use whole numbers separated by commas or spaces.' })
  })

  it.each(['0, 2', '2, 100'])('enforces the supported value range', (input) => {
    expect(parseArrayInput(input)).toEqual({ ok: false, error: 'Each value must be between 1 and 99.' })
  })
})
