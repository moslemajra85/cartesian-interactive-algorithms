import { describe, expect, it } from 'vitest'
import { createLinkedInsertionSteps, traversalIds } from './linkedInsertion'

describe('linked-list insertion', () => {
  it('preserves the successor before redirecting the predecessor', () => {
    const steps = createLinkedInsertionSteps([10, 20, 30], 25, 1)
    const successor = steps.find((step) => step.phase === 'link-successor')!
    const redirected = steps.find((step) => step.phase === 'link-predecessor')!
    expect(successor.nodes.find((node) => node.id === 'node-new')?.nextId).toBe('node-2')
    expect(successor.nodes.find((node) => node.id === 'node-1')?.nextId).toBe('node-2')
    expect(redirected.nodes.find((node) => node.id === 'node-1')?.nextId).toBe('node-new')
  })
  it('produces the expected reachable order without changing existing identities', () => {
    const final = createLinkedInsertionSteps([10, 20, 30], 25, 1).at(-1)!
    expect(traversalIds(final)).toEqual(['node-0', 'node-1', 'node-new', 'node-2'])
    expect(final.nodes.map((node) => node.value)).toEqual([10, 20, 30, 25])
  })
  it('supports insertion after the tail', () => {
    const final = createLinkedInsertionSteps([10, 20], 30, 1).at(-1)!
    expect(traversalIds(final)).toEqual(['node-0', 'node-1', 'node-new'])
    expect(final.nodes.find((node) => node.id === 'node-new')?.nextId).toBeNull()
  })
  it('does not mutate earlier snapshots', () => {
    const steps = createLinkedInsertionSteps([10, 20], 15, 0)
    expect(steps[0].nodes).toHaveLength(2)
    expect(steps[0].nodes[0].nextId).toBe('node-1')
  })
  it('rejects invalid insertion requests', () => {
    expect(() => createLinkedInsertionSteps([], 1, 0)).toThrow(RangeError)
    expect(() => createLinkedInsertionSteps([1], 2, 1)).toThrow(RangeError)
    expect(() => createLinkedInsertionSteps([1], 2.5, 0)).toThrow(RangeError)
  })
})
