import { describe, expect, it } from 'vitest'
import { createCycleDetectionSteps } from './linkedCycle'

describe('two-pointer cycle detection', () => {
  it('detects a cycle when slow and fast meet', () => {
    const steps = createCycleDetectionSteps([10, 20, 30, 40, 50], 2)
    expect(steps.at(-1)).toMatchObject({ phase: 'found' })
    expect(steps.at(-1)?.slowId).toBe(steps.at(-1)?.fastId)
    expect(steps[0].nodes.at(-1)?.nextId).toBe('node-2')
  })
  it('proves an acyclic list when fast reaches null', () => {
    const steps = createCycleDetectionSteps([10, 20, 30, 40, 50], null)
    expect(steps.at(-1)).toMatchObject({ phase: 'not-found', fastId: 'node-4' })
    expect(steps.at(-1)?.explanation).toContain('fast.next is null')
  })
  it('records one-hop and two-hop movement separately', () => {
    const advance = createCycleDetectionSteps([10, 20, 30, 40], null).find((step) => step.phase === 'advance')!
    expect(advance.movements).toEqual([{ pointerId: 'slow', fromId: 'node-0', toId: 'node-1', hops: 1 }, { pointerId: 'fast', fromId: 'node-0', toId: 'node-2', hops: 2 }])
  })
  it('rejects invalid structures', () => {
    expect(() => createCycleDetectionSteps([1], null)).toThrow(RangeError)
    expect(() => createCycleDetectionSteps([1, 2], 2)).toThrow(RangeError)
  })
})
