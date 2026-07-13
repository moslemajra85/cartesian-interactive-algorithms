import { describe, expect, it } from 'vitest'
import { createBubbleSortSteps } from './bubbleSort'

describe('createBubbleSortSteps', () => {
  const trivialCases: Array<[number[]]> = [[[]], [[8]]]

  it('finishes with every value sorted and every index marked complete', () => {
    const steps = createBubbleSortSteps([7, 3, 9, 2, 6, 4])
    const finalStep = steps.at(-1)

    expect(finalStep?.values).toEqual([2, 3, 4, 6, 7, 9])
    expect(finalStep?.sortedIndices).toEqual([0, 1, 2, 3, 4, 5])
    expect(finalStep?.title).toBe('Array sorted')
  })

  it('does not mutate the caller input', () => {
    const input = [3, 1, 2]

    createBubbleSortSteps(input)

    expect(input).toEqual([3, 1, 2])
  })

  it('preserves duplicate values', () => {
    const finalStep = createBubbleSortSteps([4, 2, 4, 1, 2]).at(-1)

    expect(finalStep?.values).toEqual([1, 2, 2, 4, 4])
  })

  it('exits after one pass when the input is already sorted', () => {
    const steps = createBubbleSortSteps([1, 2, 3, 4])
    const finalStep = steps.at(-1)

    expect(finalStep?.pass).toBe(1)
    expect(steps.filter((step) => step.swapped !== null)).toHaveLength(0)
  })

  it.each(trivialCases)('handles arrays that need no comparisons: %j', (input) => {
    const steps = createBubbleSortSteps(input)

    expect(steps).toHaveLength(2)
    expect(steps.at(-1)?.values).toEqual(input)
    expect(steps.at(-1)?.title).toBe('Already sorted')
  })

  it('records only adjacent indices for swaps', () => {
    const swapSteps = createBubbleSortSteps([5, 1, 4, 2])
      .filter((step) => step.swapped !== null)

    for (const step of swapSteps) {
      const [left, right] = step.swapped!
      expect(right - left).toBe(1)
    }
  })
})
