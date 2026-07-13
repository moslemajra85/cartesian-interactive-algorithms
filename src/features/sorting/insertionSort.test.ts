import { describe, expect, it } from 'vitest'
import { createInsertionSortSteps } from './insertionSort'

describe('createInsertionSortSteps', () => {
  const trivialCases: Array<[number[]]> = [[[]], [[8]]]

  it('finishes with every value sorted and every index in the ordered prefix', () => {
    const finalStep = createInsertionSortSteps([7, 3, 9, 2, 6, 4]).at(-1)

    expect(finalStep?.values).toEqual([2, 3, 4, 6, 7, 9])
    expect(finalStep?.sortedIndices).toEqual([0, 1, 2, 3, 4, 5])
    expect(finalStep?.title).toBe('Array sorted')
  })

  it('does not mutate the caller input', () => {
    const input = [3, 1, 2]

    createInsertionSortSteps(input)

    expect(input).toEqual([3, 1, 2])
  })

  it('preserves duplicate values', () => {
    const finalStep = createInsertionSortSteps([4, 2, 4, 1, 2]).at(-1)

    expect(finalStep?.values).toEqual([1, 2, 2, 4, 4])
  })

  it('uses only adjacent swaps to insert values', () => {
    const swapSteps = createInsertionSortSteps([5, 1, 4, 2])
      .filter((step) => step.swapped !== null)

    for (const step of swapSteps) {
      const [left, right] = step.swapped!
      expect(right - left).toBe(1)
    }
  })

  it('does not swap an already sorted input', () => {
    const swapSteps = createInsertionSortSteps([1, 2, 3, 4])
      .filter((step) => step.swapped !== null)

    expect(swapSteps).toHaveLength(0)
  })

  it('uses the maximum number of swaps for reverse-sorted input', () => {
    const swapSteps = createInsertionSortSteps([4, 3, 2, 1])
      .filter((step) => step.swapped !== null)

    expect(swapSteps).toHaveLength(6)
  })

  it.each(trivialCases)('handles arrays that need no comparisons: %j', (input) => {
    const steps = createInsertionSortSteps(input)

    expect(steps).toHaveLength(2)
    expect(steps.at(-1)?.values).toEqual(input)
    expect(steps.at(-1)?.title).toBe('Already sorted')
  })
})
