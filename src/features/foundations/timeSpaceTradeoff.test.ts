import { describe, expect, it } from 'vitest'
import { compareLookupStrategies, createLookupTradeoffSteps } from './timeSpaceTradeoff'

describe('lookup time-space tradeoff', () => {
  it('prefers a scan for one lookup and an index when reuse amortizes setup', () => {
    expect(compareLookupStrategies(1)).toMatchObject({ scanWork: 10, indexWork: 11, recommendation: 'scan' })
    expect(compareLookupStrategies(2)).toMatchObject({ scanWork: 20, indexWork: 12, recommendation: 'index' })
  })
  it('keeps index memory linear while repeated scan work compounds', () => {
    expect(compareLookupStrategies(8)).toEqual({ queries: 8, scanWork: 80, indexWork: 18, scanExtraSpace: 1, indexExtraSpace: 10, recommendation: 'index' })
  })
  it('creates a query-volume timeline', () => { expect(createLookupTradeoffSteps(6).at(-1)).toMatchObject({ queries: 6, scanWork: 60, indexWork: 16 }) })
  it.each([[0, 10], [1.5, 10], [1, 0]])('rejects invalid workload values', (queries, records) => { expect(() => compareLookupStrategies(queries, records)).toThrow(RangeError) })
})
