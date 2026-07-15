import { createLinkedNodes, snapshotLinkedNodes, type LinkedNode, type LinkedPointerEdge } from '../model/linkedList'

export type StackOperation = 'push' | 'pop'
export type StackPhase = 'ready' | 'allocate' | 'link' | 'read' | 'move-top' | 'release' | 'complete'

export type StackStep = {
  nodes: LinkedNode[]
  headId: string | null
  activeIds: string[]
  topId: string | null
  newId: string | null
  removedId: string | null
  followedEdge: LinkedPointerEdge | null
  edgeAction: 'follow' | 'write'
  phase: StackPhase
  title: string
  explanation: string
}

function snapshot(nodes: LinkedNode[], headId: string | null, details: Omit<StackStep, 'nodes' | 'headId'>): StackStep {
  return { nodes: snapshotLinkedNodes(nodes), headId, ...details }
}

export function createStackSteps(values: number[], operation: StackOperation, pushedValue = 0): StackStep[] {
  if (values.length < 1) throw new RangeError('At least one stack item is required.')
  if (operation === 'push' && !Number.isInteger(pushedValue)) throw new RangeError('Pushed value must be a whole number.')

  const nodes = createLinkedNodes(values)
  let topId: string | null = nodes[0].id
  const base = { newId: null, removedId: null, followedEdge: null, edgeAction: 'follow' as const }
  const steps = [snapshot(nodes, topId, {
    ...base, activeIds: [topId], topId, phase: 'ready', title: operation === 'push' ? `Push ${pushedValue}` : `Pop ${nodes[0].value}`,
    explanation: `top is the only stack entry point. It currently points to ${nodes[0].value}; every older item is reached through next.`,
  })]

  if (operation === 'push') {
    const inserted: LinkedNode = { id: 'node-new', value: pushedValue, nextId: null }
    nodes.push(inserted)
    steps.push(snapshot(nodes, topId, {
      activeIds: [inserted.id], topId, newId: inserted.id, removedId: null, followedEdge: null, edgeAction: 'write',
      phase: 'allocate', title: `Allocate ${pushedValue}`, explanation: 'new points to a detached node. The existing stack is unchanged and remains reachable from top.',
    }))
    inserted.nextId = topId
    steps.push(snapshot(nodes, topId, {
      activeIds: [inserted.id, topId], topId, newId: inserted.id, removedId: null,
      followedEdge: { fromId: inserted.id, toId: topId }, edgeAction: 'write', phase: 'link', title: 'Link new to the old top',
      explanation: 'Execute new.next = top before moving top. This preserves the complete older stack beneath the new item.',
    }))
    topId = inserted.id
    steps.push(snapshot(nodes, topId, {
      activeIds: [topId], topId, newId: inserted.id, removedId: null, followedEdge: null, edgeAction: 'follow',
      phase: 'move-top', title: 'Move top to new', explanation: `Execute top = new. ${pushedValue} is now the first item a pop operation will remove.`,
    }))
    steps.push(snapshot(nodes, topId, {
      activeIds: [], topId, newId: inserted.id, removedId: null, followedEdge: null, edgeAction: 'follow',
      phase: 'complete', title: 'Push complete', explanation: `The stack now contains ${nodes.length} items. Push changed one next reference and the top variable in O(1) time.`,
    }))
    return steps
  }

  const removed = nodes[0]
  const successorId = removed.nextId
  steps.push(snapshot(nodes, topId, {
    activeIds: [removed.id], topId, newId: null, removedId: removed.id, followedEdge: null, edgeAction: 'follow',
    phase: 'read', title: `Read top value ${removed.value}`, explanation: 'Save the value and the old top identity before changing the only entry point.',
  }))
  topId = successorId
  steps.push(snapshot(nodes, topId, {
    activeIds: topId ? [topId] : [], topId, newId: null, removedId: removed.id,
    followedEdge: { fromId: removed.id, toId: successorId }, edgeAction: 'follow', phase: 'move-top', title: `Move top to ${successorId ? nodes.find((node) => node.id === successorId)?.value : 'null'}`,
    explanation: 'Execute top = oldTop.next. The remaining stack stays reachable while the removed node becomes detached.',
  }))
  nodes.splice(nodes.indexOf(removed), 1)
  steps.push(snapshot(nodes, topId, {
    activeIds: [], topId, newId: null, removedId: null, followedEdge: null, edgeAction: 'follow',
    phase: 'release', title: `Release old top ${removed.value}`, explanation: 'The detached node can be reclaimed only after top safely reaches the remaining stack.',
  }))
  steps.push(snapshot(nodes, topId, {
    activeIds: [], topId, newId: null, removedId: null, followedEdge: null, edgeAction: 'follow',
    phase: 'complete', title: 'Pop complete', explanation: `Return ${removed.value}. The stack now contains ${nodes.length} items, and no traversal was required.`,
  }))
  return steps
}
