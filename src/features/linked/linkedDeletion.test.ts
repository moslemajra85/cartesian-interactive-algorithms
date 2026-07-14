import { describe, expect, it } from 'vitest'
import { createLinkedDeletionSteps } from './linkedDeletion'
import { traversalIds } from './linkedInsertion'

describe('linked-list deletion', () => {
  it('bypasses the target before releasing it', () => {
    const steps = createLinkedDeletionSteps([10, 20, 30, 40], 2)
    const bypass = steps.find((step) => step.phase === 'bypass')!
    const release = steps.find((step) => step.phase === 'release')!
    expect(bypass.nodes.find((node) => node.id === 'node-1')?.nextId).toBe('node-3')
    expect(bypass.nodes.find((node) => node.id === 'node-2')).toBeTruthy()
    expect(release.nodes.find((node) => node.id === 'node-2')).toBeUndefined()
  })
  it('preserves the reachable remainder and stable identities', () => {
    const final = createLinkedDeletionSteps([10, 20, 30, 40], 2).at(-1)!
    expect(traversalIds(final)).toEqual(['node-0', 'node-1', 'node-3'])
    expect(final.nodes.map((node) => node.value)).toEqual([10, 20, 40])
  })
  it('can remove the tail', () => {
    const final = createLinkedDeletionSteps([10, 20, 30], 2).at(-1)!
    expect(final.nodes.find((node) => node.id === 'node-1')?.nextId).toBeNull()
  })
  it('keeps the initial snapshot immutable', () => {
    const steps = createLinkedDeletionSteps([10, 20, 30], 1)
    expect(steps[0].nodes).toHaveLength(3)
    expect(steps[0].nodes[0].nextId).toBe('node-1')
  })
  it('rejects targets without an in-list predecessor', () => {
    expect(() => createLinkedDeletionSteps([10], 0)).toThrow(RangeError)
    expect(() => createLinkedDeletionSteps([10, 20], 0)).toThrow(RangeError)
    expect(() => createLinkedDeletionSteps([10, 20], 2)).toThrow(RangeError)
  })
})
