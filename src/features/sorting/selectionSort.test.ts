import { describe, expect, it } from 'vitest'
import { createSelectionSortSteps } from './selectionSort'

describe('createSelectionSortSteps', () => {
  const trivialCases: Array<[number[]]> = [[[]], [[8]]]

  it('finishes with every value sorted and every index marked complete', () => {
    const finalStep = createSelectionSortSteps([7, 3, 9, 2, 6, 4]).at(-1)

    expect(finalStep?.values).toEqual([2, 3, 4, 6, 7, 9])
    expect(finalStep?.sortedIndices).toEqual([0, 1, 2, 3, 4, 5])
    expect(finalStep?.title).toBe('Array sorted')
  })

  it('does not mutate the caller input', () => {
    const input = [3, 1, 2]

    createSelectionSortSteps(input)

    expect(input).toEqual([3, 1, 2])
  })

  it('preserves duplicate values', () => {
    const finalStep = createSelectionSortSteps([4, 2, 4, 1, 2]).at(-1)

    expect(finalStep?.values).toEqual([1, 2, 2, 4, 4])
  })

  it('records at most one swap for each pass', () => {
    const steps = createSelectionSortSteps([5, 1, 4, 2, 3])
    const swapCountByPass = new Map<number, number>()

    for (const step of steps.filter((candidate) => candidate.swapped !== null)) {
      swapCountByPass.set(step.pass, (swapCountByPass.get(step.pass) ?? 0) + 1)
    }

    expect([...swapCountByPass.values()].every((count) => count === 1)).toBe(true)
  })

  it('does not emit a swap when the pass minimum is already in place', () => {
    const firstPass = createSelectionSortSteps([1, 4, 3, 2])
      .filter((step) => step.pass === 1)

    expect(firstPass.some((step) => step.swapped !== null)).toBe(false)
  })

  it.each(trivialCases)('handles arrays that need no comparisons: %j', (input) => {
    const steps = createSelectionSortSteps(input)

    expect(steps).toHaveLength(2)
    expect(steps.at(-1)?.values).toEqual(input)
    expect(steps.at(-1)?.title).toBe('Already sorted')
  })
})
