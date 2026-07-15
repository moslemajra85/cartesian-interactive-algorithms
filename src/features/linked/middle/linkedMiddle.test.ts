import { describe, expect, it } from 'vitest'
import { createMiddleSteps } from './linkedMiddle'

describe('find linked-list middle', () => {
  it('finds the single middle of an odd list', () => { expect(createMiddleSteps([10, 20, 30, 40, 50]).at(-1)).toMatchObject({ phase: 'found', slowId: 'node-2', fastId: 'node-4' }) })
  it('chooses the second middle of an even list', () => { expect(createMiddleSteps([10, 20, 30, 40]).at(-1)).toMatchObject({ slowId: 'node-2', fastId: null }) })
  it('records the one-to-two movement ratio', () => { expect(createMiddleSteps([10, 20, 30])[1].movements.map(({ pointerId, hops }) => ({ pointerId, hops }))).toEqual([{ pointerId: 'slow', hops: 1 }, { pointerId: 'fast', hops: 2 }]) })
  it('supports a singleton and rejects an empty list', () => { expect(createMiddleSteps([10]).at(-1)).toMatchObject({ slowId: 'node-0', round: 0 }); expect(() => createMiddleSteps([])).toThrow(RangeError) })
})
