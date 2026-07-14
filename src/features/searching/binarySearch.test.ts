import { describe, expect, it } from 'vitest'
import { createBinarySearchSteps } from './binarySearch'

describe('createBinarySearchSteps', () => {
  it('finds a target and marks its exact index', () => {
    const finalStep = createBinarySearchSteps([1, 3, 4, 6, 8, 10, 13], 8).at(-1)

    expect(finalStep?.title).toBe('8 found at index 4')
    expect(finalStep?.sortedIndices).toEqual([4])
    expect(finalStep?.phaseLabel).toBe('FOUND')
  })

  it('reports an exhausted interval when the target is absent', () => {
    const finalStep = createBinarySearchSteps([1, 3, 4, 6, 8, 10, 13], 5).at(-1)

    expect(finalStep?.phaseLabel).toBe('NOT FOUND')
    expect(finalStep?.activeRange).toEqual([0, -1])
  })

  it('does not mutate the caller input', () => {
    const input = [1, 3, 5, 7]
    createBinarySearchSteps(input, 5)
    expect(input).toEqual([1, 3, 5, 7])
  })

  it('finds a matching value when duplicates exist', () => {
    const finalStep = createBinarySearchSteps([1, 2, 2, 2, 5], 2).at(-1)!
    expect(finalStep.values[finalStep.sortedIndices[0]]).toBe(2)
  })

  it('uses no more than logarithmic midpoint checks', () => {
    const values = Array.from({ length: 32 }, (_, index) => index * 2)
    const checks = createBinarySearchSteps(values, 63).filter((step) => step.compared !== null)
    expect(checks.length).toBeLessThanOrEqual(6)
  })

  it('keeps every inspected midpoint inside the current candidate interval', () => {
    const checks = createBinarySearchSteps([1, 4, 7, 10, 13, 16, 19], 16)
      .filter((step) => step.compared !== null)

    for (const step of checks) {
      const midpoint = step.compared![0]
      expect(midpoint).toBeGreaterThanOrEqual(step.activeRange![0])
      expect(midpoint).toBeLessThanOrEqual(step.activeRange![1])
    }
  })

  it('strictly shrinks the candidate interval after each unsuccessful check', () => {
    const ranges = createBinarySearchSteps([1, 4, 7, 10, 13, 16, 19], 8)
      .filter((step) => step.phaseLabel?.startsWith('DISCARD'))
      .map((step) => step.activeRange!)

    for (let index = 1; index < ranges.length; index += 1) {
      const previousSize = ranges[index - 1][1] - ranges[index - 1][0] + 1
      const currentSize = ranges[index][1] - ranges[index][0] + 1
      expect(currentSize).toBeLessThan(previousSize)
    }
  })

  it('rejects an unsorted input rather than returning a misleading result', () => {
    expect(() => createBinarySearchSteps([3, 1, 2], 1)).toThrow('requires values in nondecreasing order')
  })
})
