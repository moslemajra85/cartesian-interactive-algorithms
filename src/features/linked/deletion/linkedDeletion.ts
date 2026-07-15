import { createLinkedNodes, snapshotLinkedNodes, type LinkedNode, type LinkedPointerEdge } from '../model/linkedList'

export type LinkedDeletionPhase = 'ready' | 'identify' | 'bypass' | 'release' | 'complete'
export type LinkedDeletionStep = {
  nodes: LinkedNode[]
  headId: string
  activeIds: string[]
  predecessorId: string
  targetId: string
  successorId: string | null
  followedEdge: LinkedPointerEdge | null
  phase: LinkedDeletionPhase
  title: string
  explanation: string
}

function snapshot(nodes: LinkedNode[], details: Omit<LinkedDeletionStep, 'nodes' | 'headId'>): LinkedDeletionStep {
  return { nodes: snapshotLinkedNodes(nodes), headId: 'node-0', ...details }
}

export function createLinkedDeletionSteps(values: number[], targetIndex: number): LinkedDeletionStep[] {
  if (values.length < 2) throw new RangeError('Deletion requires a predecessor and target.')
  if (!Number.isInteger(targetIndex) || targetIndex < 1 || targetIndex >= values.length) throw new RangeError('Target must have a predecessor inside the list.')
  const nodes = createLinkedNodes(values)
  const predecessor = nodes[targetIndex - 1]
  const target = nodes[targetIndex]
  const successorId = target.nextId
  const references = { predecessorId: predecessor.id, targetId: target.id, successorId }
  const steps = [snapshot(nodes, {
    activeIds: [predecessor.id, target.id], ...references, followedEdge: null,
    phase: 'ready', title: 'Identify the deletion boundary', explanation: `predecessor points to ${predecessor.value}, and target points to ${target.value}. The target remains reachable through predecessor.next.`,
  })]
  steps.push(snapshot(nodes, {
    activeIds: [predecessor.id, target.id, ...(successorId ? [successorId] : [])], ...references, followedEdge: null,
    phase: 'identify', title: `Save the references around ${target.value}`,
    explanation: `Keep predecessor, target, and ${successorId ? `successor (${nodes.find((node) => node.id === successorId)?.value})` : 'a null successor'} available before changing the chain.`,
  }))
  predecessor.nextId = target.nextId
  steps.push(snapshot(nodes, {
    activeIds: [predecessor.id, ...(successorId ? [successorId] : [])], ...references,
    followedEdge: { fromId: predecessor.id, toId: successorId }, phase: 'bypass', title: `Bypass ${target.value}`,
    explanation: 'Execute predecessor.next = target.next. The rewritten edge preserves the successor chain while target becomes unreachable from head.',
  }))
  nodes.splice(nodes.indexOf(target), 1)
  steps.push(snapshot(nodes, {
    activeIds: [], ...references, followedEdge: null, phase: 'release', title: `Release node ${target.value}`,
    explanation: 'The target variable is no longer used after the detached node is reclaimed. Existing node identities and values did not move.',
  }))
  steps.push(snapshot(nodes, {
    activeIds: [], ...references, followedEdge: null, phase: 'complete', title: 'Deletion complete',
    explanation: `The list now contains ${nodes.length} nodes. One reference changed and one detached node was released.`,
  }))
  return steps
}
