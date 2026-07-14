import type { LinkedNode } from './linkedInsertion'

export type LinkedDeletionPhase = 'ready' | 'identify' | 'bypass' | 'release' | 'complete'
export type LinkedDeletionStep = { nodes: LinkedNode[]; headId: string; activeIds: string[]; phase: LinkedDeletionPhase; title: string; explanation: string }

function snapshot(nodes: LinkedNode[], details: Omit<LinkedDeletionStep, 'nodes' | 'headId'>): LinkedDeletionStep {
  return { nodes: nodes.map((node) => ({ ...node })), headId: 'node-0', ...details }
}

export function createLinkedDeletionSteps(values: number[], targetIndex: number): LinkedDeletionStep[] {
  if (values.length < 2) throw new RangeError('Deletion requires a predecessor and target.')
  if (!Number.isInteger(targetIndex) || targetIndex < 1 || targetIndex >= values.length) throw new RangeError('Target must have a predecessor inside the list.')
  const nodes: LinkedNode[] = values.map((value, index) => ({ id: `node-${index}`, value, nextId: index === values.length - 1 ? null : `node-${index + 1}` }))
  const predecessor = nodes[targetIndex - 1]
  const target = nodes[targetIndex]
  const steps = [snapshot(nodes, { activeIds: [], phase: 'ready', title: 'Existing chain', explanation: 'The target is reachable only because its predecessor points to it.' })]
  steps.push(snapshot(nodes, { activeIds: [predecessor.id, target.id], phase: 'identify', title: `Identify ${target.value} and its predecessor`, explanation: `Keep both references. The predecessor is ${predecessor.value}; the target’s successor is ${target.nextId ? nodes.find((node) => node.id === target.nextId)?.value : 'null'}.` }))
  predecessor.nextId = target.nextId
  steps.push(snapshot(nodes, { activeIds: [predecessor.id, target.id], phase: 'bypass', title: `Bypass ${target.value}`, explanation: 'Point predecessor.next directly to target.next. The target becomes unreachable from head, while the remaining chain stays connected.' }))
  nodes.splice(nodes.indexOf(target), 1)
  steps.push(snapshot(nodes, { activeIds: [], phase: 'release', title: `Release node ${target.value}`, explanation: 'The detached node can now be reclaimed. Existing node identities and values did not move.' }))
  steps.push(snapshot(nodes, { activeIds: [], phase: 'complete', title: 'Deletion complete', explanation: `The list now contains ${nodes.length} nodes. One link changed and one detached node was released.` }))
  return steps
}
