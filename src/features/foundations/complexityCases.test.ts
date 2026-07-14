import { describe, expect, it } from 'vitest'
import { createComplexityCaseSteps, linearSearchCases } from './complexityCases'

describe('linear search complexity cases', () => {
  it('distinguishes best, expected, and worst comparison counts', () => {
    expect(linearSearchCases(9)).toEqual({ best: 1, average: 5, worst: 9 })
    expect(linearSearchCases(10)).toEqual({ best: 1, average: 5.5, worst: 10 })
  })

  it('keeps the best case constant while the worst case grows linearly', () => {
    const small = linearSearchCases(4)
    const doubled = linearSearchCases(8)

    expect(doubled.best).toBe(small.best)
    expect(doubled.worst).toBe(small.worst * 2)
  })

  it('creates a deterministic timeline through the requested input size', () => {
    const steps = createComplexityCaseSteps(6)

    expect(steps).toHaveLength(6)
    expect(steps.at(-1)).toMatchObject({ inputSize: 6, best: 1, average: 3.5, worst: 6 })
  })

  it.each([0, -1, 3.5])('rejects an invalid case input: %s', (size) => {
    expect(() => linearSearchCases(size)).toThrow(RangeError)
  })

  it.each([1, 21, 2.5])('rejects an invalid timeline maximum: %s', (size) => {
    expect(() => createComplexityCaseSteps(size)).toThrow(RangeError)
  })
})
