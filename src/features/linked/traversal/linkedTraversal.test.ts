import { describe, expect, it } from 'vitest'
import { createLinkedTraversalSteps } from './linkedTraversal'

describe('linked-list traversal', () => {
  it('stops as soon as a target is found', () => {
    const steps = createLinkedTraversalSteps([10, 20, 30, 40], 20)
    expect(steps.at(-1)).toMatchObject({
      phase: 'found', activeIds: ['node-1'], currentId: 'node-1',
      visitedIds: ['node-0', 'node-1'], comparisonCount: 2,
    })
    expect(steps.at(-1)?.explanation).toContain('2 comparisons')
    expect(steps.some((step) => step.activeIds.includes('node-2'))).toBe(false)
  })
  it('models pointer assignments separately from comparisons', () => {
    const steps = createLinkedTraversalSteps([10, 20, 30], 30)
    expect(steps[0]).toMatchObject({ phase: 'ready', currentId: 'node-0', visitedIds: [], comparisonCount: 0 })
    expect(steps[1]).toMatchObject({ phase: 'inspect', currentId: 'node-0', visitedIds: [], comparisonCount: 1 })
    expect(steps[2]).toMatchObject({
      phase: 'advance', currentId: 'node-1', visitedIds: ['node-0'],
      followedEdge: { fromId: 'node-0', toId: 'node-1' }, comparisonCount: 1,
    })
  })
  it('follows every next reference before proving absence', () => {
    const steps = createLinkedTraversalSteps([10, 20, 30], 99)
    expect(steps.filter((step) => step.phase === 'inspect').map((step) => step.activeIds[0])).toEqual(['node-0', 'node-1', 'node-2'])
    expect(steps.at(-1)).toMatchObject({
      phase: 'not-found', activeIds: [], currentId: null,
      visitedIds: ['node-0', 'node-1', 'node-2'], comparisonCount: 3,
      followedEdge: { fromId: 'node-2', toId: null },
    })
  })
  it('finds the head in one comparison', () => {
    const steps = createLinkedTraversalSteps([10, 20], 10)
    expect(steps.at(-1)?.explanation).toContain('1 comparison')
  })
  it('keeps every event immutable', () => {
    const steps = createLinkedTraversalSteps([10, 20], 20)
    expect(steps.every((step) => step.nodes[0].nextId === 'node-1')).toBe(true)
    expect(steps[0].visitedIds).not.toBe(steps[1].visitedIds)
  })
  it('rejects invalid searches', () => {
    expect(() => createLinkedTraversalSteps([], 1)).toThrow(RangeError)
    expect(() => createLinkedTraversalSteps([1], 1.5)).toThrow(RangeError)
  })
})
