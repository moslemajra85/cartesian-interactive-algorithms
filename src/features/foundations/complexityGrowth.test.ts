import { describe, expect, it } from 'vitest'
import { createComplexityGrowthSteps, operationCounts } from './complexityGrowth'

describe('complexity growth model', () => {
  it('calculates representative work counts without timing hardware', () => {
    expect(operationCounts(8)).toEqual({
      constant: 1,
      logarithmic: 4,
      linear: 8,
      quadratic: 64,
    })
  })

  it('shows that doubling input doubles linear work and quadruples quadratic work', () => {
    const smaller = operationCounts(5)
    const doubled = operationCounts(10)

    expect(doubled.linear).toBe(smaller.linear * 2)
    expect(doubled.quadratic).toBe(smaller.quadratic * 4)
    expect(doubled.constant).toBe(smaller.constant)
  })

  it('creates an immutable teaching timeline through the requested input size', () => {
    const steps = createComplexityGrowthSteps(6)

    expect(steps).toHaveLength(6)
    expect(steps[0].inputSize).toBe(1)
    expect(steps.at(-1)?.inputSize).toBe(6)
    expect(steps.at(-1)?.operations.quadratic).toBe(36)
  })

  it.each([0, 1, 21, 2.5])('rejects an invalid maximum input size: %s', (size) => {
    expect(() => createComplexityGrowthSteps(size)).toThrow(RangeError)
  })

  it.each([0, -1, 2.5])('rejects an invalid operation-count input: %s', (size) => {
    expect(() => operationCounts(size)).toThrow(RangeError)
  })
})
