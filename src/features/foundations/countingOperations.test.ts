import { describe, expect, it } from 'vitest'
import { countSequentialOperations, createOperationCountingSteps } from './countingOperations'

describe('counting sequential operations', () => {
  it('adds fixed setup and two independent linear passes', () => {
    expect(countSequentialOperations(5)).toEqual({
      setup: 3,
      firstPass: 5,
      secondPass: 5,
      total: 13,
    })
  })

  it('doubles only the repeated work when input doubles', () => {
    const smaller = countSequentialOperations(4)
    const doubled = countSequentialOperations(8)

    expect(doubled.firstPass).toBe(smaller.firstPass * 2)
    expect(doubled.secondPass).toBe(smaller.secondPass * 2)
    expect(doubled.setup).toBe(smaller.setup)
    expect(doubled.total).toBe(19)
  })

  it('creates a deterministic timeline ending at the requested input size', () => {
    const steps = createOperationCountingSteps(7)

    expect(steps).toHaveLength(7)
    expect(steps.at(-1)).toMatchObject({ inputSize: 7, total: 17 })
    expect(steps.at(-1)?.explanation).toContain('2n + 3 = 17')
  })

  it.each([0, -1, 1.5])('rejects an invalid input size: %s', (size) => {
    expect(() => countSequentialOperations(size)).toThrow(RangeError)
  })

  it.each([1, 21, 4.5])('rejects an invalid timeline maximum: %s', (size) => {
    expect(() => createOperationCountingSteps(size)).toThrow(RangeError)
  })
})
