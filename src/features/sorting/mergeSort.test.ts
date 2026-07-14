import { describe, expect, it } from 'vitest'
import { createMergeSortSteps } from './mergeSort'

describe('createMergeSortSteps', () => {
  const trivialCases: Array<[number[]]> = [[[]], [[8]]]

  it('finishes with every value sorted and every index marked complete', () => {
    const finalStep = createMergeSortSteps([7, 3, 9, 2, 6, 4]).at(-1)

    expect(finalStep?.values).toEqual([2, 3, 4, 6, 7, 9])
    expect(finalStep?.sortedIndices).toEqual([0, 1, 2, 3, 4, 5])
    expect(finalStep?.title).toBe('Array sorted')
  })

  it('does not mutate the caller input', () => {
    const input = [3, 1, 2]

    createMergeSortSteps(input)

    expect(input).toEqual([3, 1, 2])
  })

  it('preserves duplicate values', () => {
    expect(createMergeSortSteps([4, 2, 4, 1, 2]).at(-1)?.values).toEqual([1, 2, 2, 4, 4])
  })

  it.each(trivialCases)('handles a base-case array: %j', (input) => {
    const steps = createMergeSortSteps(input)

    expect(steps).toHaveLength(2)
    expect(steps.at(-1)?.values).toEqual(input)
    expect(steps.at(-1)?.title).toBe('Already sorted')
  })

  it('compares only values from opposing ordered halves', () => {
    const comparisons = createMergeSortSteps([8, 3, 6, 2, 7, 4, 1])
      .filter((step) => step.compared !== null)

    for (const step of comparisons) {
      const [left, right] = step.compared!
      expect(step.activeRange).not.toBeNull()
      expect(step.splitAt).not.toBeNull()
      expect(left).toBeLessThanOrEqual(step.splitAt!)
      expect(right).toBeGreaterThan(step.splitAt!)
      expect(left).toBeGreaterThanOrEqual(step.activeRange![0])
      expect(right).toBeLessThanOrEqual(step.activeRange![1])
    }
  })

  it('emits an ordered snapshot for every completed merge range', () => {
    const mergedSteps = createMergeSortSteps([8, 3, 6, 2, 7, 4, 1])
      .filter((step) => step.mergedRange && step.mergedRange[0] !== step.mergedRange[1])

    for (const step of mergedSteps) {
      const [start, end] = step.mergedRange!
      const range = step.values.slice(start, end + 1)
      expect(range).toEqual([...range].sort((left, right) => left - right))
    }
  })

  it('recursively splits into smaller valid ranges', () => {
    const splitSteps = createMergeSortSteps([8, 3, 6, 2, 7])
      .filter((step) => step.phaseLabel?.startsWith('SPLIT'))

    for (const step of splitSteps) {
      const [start, end] = step.activeRange!
      expect(start).toBeLessThanOrEqual(step.splitAt!)
      expect(step.splitAt!).toBeLessThan(end)
    }
  })
})
