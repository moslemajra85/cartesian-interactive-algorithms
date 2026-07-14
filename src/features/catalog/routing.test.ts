import { describe, expect, it } from 'vitest'
import { hashForRoute, routeFromHash, titleForRoute } from './routing'

describe('catalogue routing', () => {
  it.each(['', '#', '#top', '#/'])('maps the empty learning-path hash to home: %s', (hash) => {
    expect(routeFromHash(hash)).toEqual({ kind: 'home' })
  })

  it('maps the chapter catalogue and preserves existing lesson hashes', () => {
    expect(routeFromHash('#foundations')).toEqual({ kind: 'catalogue', chapterId: 'foundations' })
    expect(routeFromHash('#arrays')).toEqual({ kind: 'catalogue', chapterId: 'arrays' })
    expect(routeFromHash('#complexity-growth')).toEqual({ kind: 'lesson', slug: 'complexity-growth' })
    expect(routeFromHash('#counting-operations')).toEqual({ kind: 'lesson', slug: 'counting-operations' })
    expect(routeFromHash('#space-complexity')).toEqual({ kind: 'lesson', slug: 'space-complexity' })
    expect(routeFromHash('#complexity-cases')).toEqual({ kind: 'lesson', slug: 'complexity-cases' })
    expect(routeFromHash('#recursion-stack')).toEqual({ kind: 'lesson', slug: 'recursion-stack' })
    expect(routeFromHash('#time-space-tradeoff')).toEqual({ kind: 'lesson', slug: 'time-space-tradeoff' })
    expect(routeFromHash('#bubble-sort')).toEqual({ kind: 'lesson', slug: 'bubble-sort' })
    expect(routeFromHash('#/selection-sort/')).toEqual({ kind: 'lesson', slug: 'selection-sort' })
    expect(routeFromHash('#merge-sort')).toEqual({ kind: 'lesson', slug: 'merge-sort' })
    expect(routeFromHash('#binary-search')).toEqual({ kind: 'lesson', slug: 'binary-search' })
  })

  it('keeps an unknown path available for a useful not-found screen', () => {
    expect(routeFromHash('#dynamic-programming')).toEqual({ kind: 'not-found', requestedPath: 'dynamic-programming' })
  })

  it('serializes navigable routes', () => {
    expect(hashForRoute({ kind: 'home' })).toBe('')
    expect(hashForRoute({ kind: 'catalogue', chapterId: 'foundations' })).toBe('#foundations')
    expect(hashForRoute({ kind: 'catalogue', chapterId: 'arrays' })).toBe('#arrays')
    expect(hashForRoute({ kind: 'lesson', slug: 'insertion-sort' })).toBe('#insertion-sort')
  })

  it('derives document titles from the catalogue', () => {
    expect(titleForRoute({ kind: 'home' })).toBe('Cartesian — Interactive Algorithms')
    expect(titleForRoute({ kind: 'catalogue', chapterId: 'foundations' })).toBe('The Foundations — Cartesian')
    expect(titleForRoute({ kind: 'catalogue', chapterId: 'arrays' })).toBe('Arrays & Sorting — Cartesian')
    expect(titleForRoute({ kind: 'lesson', slug: 'selection-sort' })).toBe('Selection Sort — Cartesian')
    expect(titleForRoute({ kind: 'lesson', slug: 'merge-sort' })).toBe('Merge Sort — Cartesian')
    expect(titleForRoute({ kind: 'lesson', slug: 'binary-search' })).toBe('Binary Search — Cartesian')
    expect(titleForRoute({ kind: 'lesson', slug: 'complexity-growth' })).toBe('Growth of Work — Cartesian')
    expect(titleForRoute({ kind: 'lesson', slug: 'counting-operations' })).toBe('Counting Operations — Cartesian')
    expect(titleForRoute({ kind: 'lesson', slug: 'space-complexity' })).toBe('Space Complexity — Cartesian')
    expect(titleForRoute({ kind: 'lesson', slug: 'complexity-cases' })).toBe('Cases & Guarantees — Cartesian')
    expect(titleForRoute({ kind: 'lesson', slug: 'recursion-stack' })).toBe('Recursion & the Stack — Cartesian')
    expect(titleForRoute({ kind: 'lesson', slug: 'time-space-tradeoff' })).toBe('Time–Space Trade-offs — Cartesian')
    expect(titleForRoute({ kind: 'not-found', requestedPath: 'missing' })).toBe('Page not found — Cartesian')
  })
})
