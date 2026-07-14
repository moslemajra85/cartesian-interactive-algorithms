import { describe, expect, it } from 'vitest'
import { hashForRoute, routeFromHash, titleForRoute } from './routing'

describe('catalogue routing', () => {
  it.each(['', '#', '#top', '#/'])('maps the empty learning-path hash to home: %s', (hash) => {
    expect(routeFromHash(hash)).toEqual({ kind: 'home' })
  })

  it('maps the chapter catalogue and preserves existing lesson hashes', () => {
    expect(routeFromHash('#arrays')).toEqual({ kind: 'catalogue', chapterId: 'arrays' })
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
    expect(hashForRoute({ kind: 'catalogue', chapterId: 'arrays' })).toBe('#arrays')
    expect(hashForRoute({ kind: 'lesson', slug: 'insertion-sort' })).toBe('#insertion-sort')
  })

  it('derives document titles from the catalogue', () => {
    expect(titleForRoute({ kind: 'home' })).toBe('Cartesian — Interactive Algorithms')
    expect(titleForRoute({ kind: 'catalogue', chapterId: 'arrays' })).toBe('Arrays & Sorting — Cartesian')
    expect(titleForRoute({ kind: 'lesson', slug: 'selection-sort' })).toBe('Selection Sort — Cartesian')
    expect(titleForRoute({ kind: 'lesson', slug: 'merge-sort' })).toBe('Merge Sort — Cartesian')
    expect(titleForRoute({ kind: 'lesson', slug: 'binary-search' })).toBe('Binary Search — Cartesian')
    expect(titleForRoute({ kind: 'not-found', requestedPath: 'missing' })).toBe('Page not found — Cartesian')
  })
})
