import { describe, expect, it } from 'vitest'
import { createRecursionStackSteps } from './recursionStack'

describe('recursion call-stack timeline', () => {
  it('pushes one frame per level and reaches the requested base case', () => {
    const steps = createRecursionStackSteps(3)
    const base = steps.find((step) => step.phase === 'base')!

    expect(base.frames).toEqual([1, 2, 3])
    expect(base.activeLevel).toBe(3)
  })

  it('unwinds frames in last-in, first-out order without mutating earlier events', () => {
    const steps = createRecursionStackSteps(3)
    const unwind = steps.filter((step) => step.phase === 'unwind')

    expect(unwind.map((step) => step.activeLevel)).toEqual([3, 2, 1])
    expect(unwind.map((step) => step.frames)).toEqual([[1, 2, 3], [1, 2], [1]])
    expect(steps.at(-1)).toMatchObject({ frames: [], phase: 'complete' })
  })

  it('creates two stack events per level plus ready, base, and complete', () => {
    expect(createRecursionStackSteps(5)).toHaveLength(13)
  })

  it.each([0, 9, 2.5])('rejects an unsupported recursion depth: %s', (depth) => {
    expect(() => createRecursionStackSteps(depth)).toThrow(RangeError)
  })
})
