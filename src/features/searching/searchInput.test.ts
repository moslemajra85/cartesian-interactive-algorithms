import { describe, expect, it } from 'vitest'
import { parseSearchTarget } from './searchInput'

describe('parseSearchTarget', () => {
  it('parses a supported whole-number target', () => {
    expect(parseSearchTarget(' 42 ')).toEqual({ ok: true, target: 42 })
  })

  it.each(['', '3.5', '-2', 'target'])('rejects a non-whole-number target: %s', (input) => {
    expect(parseSearchTarget(input)).toEqual({ ok: false, error: 'The target must be a whole number.' })
  })

  it.each(['0', '100'])('rejects a target outside the visual range: %s', (input) => {
    expect(parseSearchTarget(input)).toEqual({ ok: false, error: 'The target must be between 1 and 99.' })
  })
})
