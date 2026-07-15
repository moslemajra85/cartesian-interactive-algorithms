import { describe, expect, it } from 'vitest'
import { createLinkedNodes, snapshotLinkedNodes, traversalIds } from './linkedList'

describe('shared linked-list model', () => {
  it('creates a stable next-reference chain', () => {
    expect(createLinkedNodes([10, 20, 30])).toEqual([
      { id: 'node-0', value: 10, nextId: 'node-1' },
      { id: 'node-1', value: 20, nextId: 'node-2' },
      { id: 'node-2', value: 30, nextId: null },
    ])
  })

  it('clones nodes before an event mutates working state', () => {
    const nodes = createLinkedNodes([10, 20])
    const snapshot = snapshotLinkedNodes(nodes)
    nodes[0].nextId = null

    expect(snapshot[0].nextId).toBe('node-1')
    expect(snapshot[0]).not.toBe(nodes[0])
  })

  it('derives reachability from a nullable entry point', () => {
    const nodes = createLinkedNodes([10, 20])
    expect(traversalIds({ nodes, headId: 'node-0' })).toEqual(['node-0', 'node-1'])
    expect(traversalIds({ nodes, headId: null })).toEqual([])
  })

  it('stops safely at cycles and missing references', () => {
    const cyclic = createLinkedNodes([10, 20])
    cyclic[1].nextId = 'node-0'
    expect(traversalIds({ nodes: cyclic, headId: 'node-0' })).toEqual(['node-0', 'node-1'])

    const broken = createLinkedNodes([10])
    broken[0].nextId = 'missing'
    expect(traversalIds({ nodes: broken, headId: 'node-0' })).toEqual(['node-0'])
  })
})
