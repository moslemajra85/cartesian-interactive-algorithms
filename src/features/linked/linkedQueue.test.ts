import { describe, expect, it } from 'vitest'
import { traversalIds } from './linkedInsertion'
import { createQueueSteps } from './linkedQueue'

describe('linked queue operations', () => {
  it('links new after the old rear before moving rear', () => {
    const steps = createQueueSteps([10, 20, 30], 'enqueue', 40)
    const link = steps.find((step) => step.phase === 'link')!
    const moveRear = steps.find((step) => step.phase === 'move-boundary')!

    expect(link).toMatchObject({
      headId: 'node-0', frontId: 'node-0', rearId: 'node-2', newId: 'node-new',
      followedEdge: { fromId: 'node-2', toId: 'node-new' }, edgeAction: 'write',
    })
    expect(link.nodes.find((node) => node.id === 'node-2')?.nextId).toBe('node-new')
    expect(moveRear).toMatchObject({ frontId: 'node-0', rearId: 'node-new' })
    expect(traversalIds(steps.at(-1)!)).toEqual(['node-0', 'node-1', 'node-2', 'node-new'])
  })

  it('moves front before releasing a dequeued node', () => {
    const steps = createQueueSteps([10, 20, 30], 'dequeue')
    const moveFront = steps.find((step) => step.phase === 'move-boundary')!
    const release = steps.find((step) => step.phase === 'release')!

    expect(moveFront).toMatchObject({
      headId: 'node-1', frontId: 'node-1', rearId: 'node-2', removedId: 'node-0',
      followedEdge: { fromId: 'node-0', toId: 'node-1' }, edgeAction: 'follow',
    })
    expect(moveFront.nodes.find((node) => node.id === 'node-0')).toBeTruthy()
    expect(release.nodes.find((node) => node.id === 'node-0')).toBeUndefined()
    expect(traversalIds(steps.at(-1)!)).toEqual(['node-1', 'node-2'])
  })

  it('clears both boundaries when dequeuing the final item', () => {
    const steps = createQueueSteps([10], 'dequeue')
    const moveFront = steps.find((step) => step.phase === 'move-boundary')!
    const clearRear = steps.find((step) => step.phase === 'clear-rear')!
    const final = steps.at(-1)!

    expect(moveFront).toMatchObject({ frontId: null, rearId: 'node-0' })
    expect(clearRear).toMatchObject({ frontId: null, rearId: null })
    expect(final).toMatchObject({ headId: null, frontId: null, rearId: null, nodes: [] })
  })

  it('keeps every earlier snapshot immutable', () => {
    const steps = createQueueSteps([10, 20], 'enqueue', 30)
    expect(steps[0].nodes).toHaveLength(2)
    expect(steps[0].nodes[1].nextId).toBeNull()
    expect(steps[0].rearId).toBe('node-1')
  })

  it('rejects invalid operations', () => {
    expect(() => createQueueSteps([], 'dequeue')).toThrow(RangeError)
    expect(() => createQueueSteps([1], 'enqueue', 2.5)).toThrow(RangeError)
  })
})
