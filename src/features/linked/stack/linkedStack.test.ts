import { describe, expect, it } from 'vitest'
import { traversalIds } from '../model/linkedList'
import { createStackSteps } from './linkedStack'

describe('linked stack operations', () => {
  it('links a pushed node to the old top before moving top', () => {
    const steps = createStackSteps([30, 20, 10], 'push', 40)
    const link = steps.find((step) => step.phase === 'link')!
    const moveTop = steps.find((step) => step.phase === 'move-top')!

    expect(link).toMatchObject({
      headId: 'node-0', topId: 'node-0', newId: 'node-new',
      followedEdge: { fromId: 'node-new', toId: 'node-0' }, edgeAction: 'write',
    })
    expect(link.nodes.find((node) => node.id === 'node-new')?.nextId).toBe('node-0')
    expect(moveTop).toMatchObject({ headId: 'node-new', topId: 'node-new' })
    expect(traversalIds(steps.at(-1)!)).toEqual(['node-new', 'node-0', 'node-1', 'node-2'])
  })

  it('moves top before releasing a popped node', () => {
    const steps = createStackSteps([30, 20, 10], 'pop')
    const moveTop = steps.find((step) => step.phase === 'move-top')!
    const release = steps.find((step) => step.phase === 'release')!

    expect(moveTop).toMatchObject({
      headId: 'node-1', topId: 'node-1', removedId: 'node-0',
      followedEdge: { fromId: 'node-0', toId: 'node-1' }, edgeAction: 'follow',
    })
    expect(moveTop.nodes.find((node) => node.id === 'node-0')).toBeTruthy()
    expect(release.nodes.find((node) => node.id === 'node-0')).toBeUndefined()
    expect(traversalIds(steps.at(-1)!)).toEqual(['node-1', 'node-2'])
  })

  it('can pop the final item into an empty stack', () => {
    const final = createStackSteps([30], 'pop').at(-1)!
    expect(final).toMatchObject({ headId: null, topId: null, nodes: [] })
    expect(traversalIds(final)).toEqual([])
  })

  it('keeps earlier snapshots immutable', () => {
    const steps = createStackSteps([30, 20], 'push', 40)
    expect(steps[0].nodes).toHaveLength(2)
    expect(steps[0].headId).toBe('node-0')
    expect(steps[0].nodes[0].nextId).toBe('node-1')
  })

  it('rejects invalid operations', () => {
    expect(() => createStackSteps([], 'pop')).toThrow(RangeError)
    expect(() => createStackSteps([1], 'push', 2.5)).toThrow(RangeError)
  })
})
