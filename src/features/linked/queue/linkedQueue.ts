import { createLinkedNodes, snapshotLinkedNodes, type LinkedNode, type LinkedPointerEdge } from '../model/linkedList'

export type QueueOperation = 'enqueue' | 'dequeue'
export type QueuePhase = 'ready' | 'allocate' | 'link' | 'read' | 'move-boundary' | 'clear-rear' | 'release' | 'complete'

export type QueueStep = {
  nodes: LinkedNode[]
  headId: string | null
  activeIds: string[]
  frontId: string | null
  rearId: string | null
  newId: string | null
  removedId: string | null
  followedEdge: LinkedPointerEdge | null
  edgeAction: 'follow' | 'write'
  phase: QueuePhase
  title: string
  explanation: string
}

function snapshot(nodes: LinkedNode[], headId: string | null, details: Omit<QueueStep, 'nodes' | 'headId'>): QueueStep {
  return { nodes: snapshotLinkedNodes(nodes), headId, ...details }
}

export function createQueueSteps(values: number[], operation: QueueOperation, enqueuedValue = 0): QueueStep[] {
  if (values.length < 1) throw new RangeError('At least one queued item is required.')
  if (operation === 'enqueue' && !Number.isInteger(enqueuedValue)) throw new RangeError('Enqueued value must be a whole number.')

  const nodes = createLinkedNodes(values)
  let frontId: string | null = nodes[0].id
  let rearId: string | null = nodes.at(-1)!.id
  const base = { newId: null, removedId: null, followedEdge: null, edgeAction: 'follow' as const }
  const steps = [snapshot(nodes, frontId, {
    ...base, activeIds: [frontId, rearId], frontId, rearId, phase: 'ready',
    title: operation === 'enqueue' ? `Enqueue ${enqueuedValue}` : `Dequeue ${nodes[0].value}`,
    explanation: `front points to the next item served (${nodes[0].value}); rear points to the newest queued item (${nodes.at(-1)!.value}).`,
  })]

  if (operation === 'enqueue') {
    const inserted: LinkedNode = { id: 'node-new', value: enqueuedValue, nextId: null }
    nodes.push(inserted)
    steps.push(snapshot(nodes, frontId, {
      activeIds: [inserted.id], frontId, rearId, newId: inserted.id, removedId: null, followedEdge: null, edgeAction: 'write',
      phase: 'allocate', title: `Allocate ${enqueuedValue}`, explanation: 'new points to a detached tail candidate whose next reference is null. The existing queue is still unchanged.',
    }))
    const oldRearId = rearId
    nodes.find((node) => node.id === oldRearId)!.nextId = inserted.id
    steps.push(snapshot(nodes, frontId, {
      activeIds: [oldRearId, inserted.id], frontId, rearId, newId: inserted.id, removedId: null,
      followedEdge: { fromId: oldRearId, toId: inserted.id }, edgeAction: 'write', phase: 'link', title: 'Link the old rear to new',
      explanation: 'Execute rear.next = new. The item becomes reachable at the back while rear still identifies the previous boundary.',
    }))
    rearId = inserted.id
    steps.push(snapshot(nodes, frontId, {
      activeIds: [rearId], frontId, rearId, newId: inserted.id, removedId: null, followedEdge: null, edgeAction: 'follow',
      phase: 'move-boundary', title: 'Move rear to new', explanation: `Execute rear = new. ${enqueuedValue} is now the last item, while front and every earlier position remain unchanged.`,
    }))
    steps.push(snapshot(nodes, frontId, {
      activeIds: [], frontId, rearId, newId: inserted.id, removedId: null, followedEdge: null, edgeAction: 'follow',
      phase: 'complete', title: 'Enqueue complete', explanation: `The queue now contains ${nodes.length} items. Enqueue changed one next reference and rear in O(1) time.`,
    }))
    return steps
  }

  const removed = nodes[0]
  const successorId = removed.nextId
  steps.push(snapshot(nodes, frontId, {
    activeIds: [removed.id], frontId, rearId, newId: null, removedId: removed.id, followedEdge: null, edgeAction: 'follow',
    phase: 'read', title: `Read front value ${removed.value}`, explanation: 'Save the front value and old front identity before changing the service boundary.',
  }))
  frontId = successorId
  steps.push(snapshot(nodes, frontId, {
    activeIds: frontId ? [frontId] : [], frontId, rearId, newId: null, removedId: removed.id,
    followedEdge: { fromId: removed.id, toId: successorId }, edgeAction: 'follow', phase: 'move-boundary', title: `Move front to ${successorId ? nodes.find((node) => node.id === successorId)?.value : 'null'}`,
    explanation: successorId ? 'Execute front = oldFront.next. The next waiting item becomes the service boundary while oldFront detaches.' : 'Execute front = oldFront.next, which is null. rear still points to the removed node, so the empty-state invariant needs one repair.',
  }))
  if (frontId === null) {
    rearId = null
    steps.push(snapshot(nodes, frontId, {
      activeIds: [], frontId, rearId, newId: null, removedId: removed.id, followedEdge: null, edgeAction: 'follow',
      phase: 'clear-rear', title: 'Clear rear for the empty queue', explanation: 'Because front is null, execute rear = null. Both boundaries now agree that the queue is empty.',
    }))
  }
  nodes.splice(nodes.indexOf(removed), 1)
  steps.push(snapshot(nodes, frontId, {
    activeIds: [], frontId, rearId, newId: null, removedId: null, followedEdge: null, edgeAction: 'follow',
    phase: 'release', title: `Release old front ${removed.value}`, explanation: 'The detached node can be reclaimed after front safely identifies the remaining queue.',
  }))
  steps.push(snapshot(nodes, frontId, {
    activeIds: [], frontId, rearId, newId: null, removedId: null, followedEdge: null, edgeAction: 'follow',
    phase: 'complete', title: 'Dequeue complete', explanation: `Return ${removed.value}. The queue now contains ${nodes.length} items, and no traversal was required.`,
  }))
  return steps
}
