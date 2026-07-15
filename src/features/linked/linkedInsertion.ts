export type LinkedNode = { id: string; value: number; nextId: string | null }
export type LinkedPointerEdge = { fromId: string; toId: string | null }
export type LinkedInsertionPhase = 'ready' | 'allocate' | 'link-successor' | 'link-predecessor' | 'complete'
export type LinkedInsertionStep = {
  nodes: LinkedNode[]
  headId: string
  activeIds: string[]
  predecessorId: string
  newId: string | null
  successorId: string | null
  followedEdge: LinkedPointerEdge | null
  phase: LinkedInsertionPhase
  title: string
  explanation: string
}

function snapshot(nodes: LinkedNode[], details: Omit<LinkedInsertionStep, 'nodes' | 'headId'>): LinkedInsertionStep {
  return { nodes: nodes.map((node) => ({ ...node })), headId: 'node-0', ...details }
}

export function createLinkedInsertionSteps(values: number[], insertedValue: number, afterIndex: number): LinkedInsertionStep[] {
  if (values.length < 1) throw new RangeError('At least one existing node is required.')
  if (!Number.isInteger(afterIndex) || afterIndex < 0 || afterIndex >= values.length) throw new RangeError('Insertion predecessor is outside the list.')
  if (!Number.isInteger(insertedValue)) throw new RangeError('Inserted value must be a whole number.')

  const nodes: LinkedNode[] = values.map((value, index) => ({ id: `node-${index}`, value, nextId: index === values.length - 1 ? null : `node-${index + 1}` }))
  const predecessor = nodes[afterIndex]
  const successorId = predecessor.nextId
  const inserted: LinkedNode = { id: 'node-new', value: insertedValue, nextId: null }
  const steps = [snapshot(nodes, {
    activeIds: [predecessor.id], predecessorId: predecessor.id, newId: null, successorId, followedEdge: null,
    phase: 'ready', title: 'Identify the insertion boundary',
    explanation: `predecessor points to ${predecessor.value}. Its current next reference ${successorId ? `points to ${nodes.find((node) => node.id === successorId)?.value}` : 'is null at the tail'}.`,
  })]

  nodes.push(inserted)
  steps.push(snapshot(nodes, {
    activeIds: [inserted.id], predecessorId: predecessor.id, newId: inserted.id, successorId, followedEdge: null,
    phase: 'allocate', title: `Allocate node ${insertedValue}`,
    explanation: 'new points to one detached node. Its next field starts at null, so traversing from head still cannot reach it.',
  }))
  inserted.nextId = successorId
  steps.push(snapshot(nodes, {
    activeIds: [inserted.id, ...(successorId ? [successorId] : [])], predecessorId: predecessor.id, newId: inserted.id, successorId,
    followedEdge: { fromId: inserted.id, toId: successorId }, phase: 'link-successor',
    title: successorId ? 'Point new node to the successor' : 'Keep new.next at null',
    explanation: successorId ? 'Execute new.next = predecessor.next. This preserves the only reference to the remainder before predecessor changes.' : 'The predecessor was the tail, so new.next correctly remains null.',
  }))
  predecessor.nextId = inserted.id
  steps.push(snapshot(nodes, {
    activeIds: [predecessor.id, inserted.id], predecessorId: predecessor.id, newId: inserted.id, successorId,
    followedEdge: { fromId: predecessor.id, toId: inserted.id }, phase: 'link-predecessor',
    title: 'Point predecessor to the new node', explanation: 'Execute predecessor.next = new. The new node becomes reachable from head; no existing value moves in memory.',
  }))
  steps.push(snapshot(nodes, {
    activeIds: [], predecessorId: predecessor.id, newId: inserted.id, successorId, followedEdge: null,
    phase: 'complete', title: 'Insertion complete', explanation: `The list contains ${nodes.length} nodes. Two references were assigned and zero existing values moved.`,
  }))
  return steps
}

export function traversalIds(step: Pick<LinkedInsertionStep, 'nodes' | 'headId'>): string[] {
  const byId = new Map(step.nodes.map((node) => [node.id, node]))
  const visited = new Set<string>()
  const ids: string[] = []
  let currentId: string | null = step.headId
  while (currentId && !visited.has(currentId)) {
    const node = byId.get(currentId)
    if (!node) break
    visited.add(currentId)
    ids.push(currentId)
    currentId = node.nextId
  }
  return ids
}
