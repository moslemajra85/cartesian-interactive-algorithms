export type LinkedNode = { id: string; value: number; nextId: string | null }
export type LinkedInsertionPhase = 'ready' | 'allocate' | 'link-successor' | 'link-predecessor' | 'complete'
export type LinkedInsertionStep = {
  nodes: LinkedNode[]
  headId: string
  activeIds: string[]
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
  const steps = [snapshot(nodes, { activeIds: [], phase: 'ready', title: 'Existing chain', explanation: 'Each node stores a value and the identity of its successor. Physical array positions are not part of the structure.' })]

  nodes.push(inserted)
  steps.push(snapshot(nodes, { activeIds: [inserted.id], phase: 'allocate', title: `Allocate node ${insertedValue}`, explanation: 'Create one detached node. It is not reachable from head yet, so traversing the list cannot see it.' }))
  inserted.nextId = successorId
  steps.push(snapshot(nodes, { activeIds: [inserted.id, ...(successorId ? [successorId] : [])], phase: 'link-successor', title: successorId ? 'Point new node to the successor' : 'Mark new node as the tail', explanation: successorId ? 'Preserve the remainder of the list first by storing the predecessor’s old successor in new.next.' : 'The predecessor was the tail, so the new node correctly points to null.' }))
  predecessor.nextId = inserted.id
  steps.push(snapshot(nodes, { activeIds: [predecessor.id, inserted.id], phase: 'link-predecessor', title: 'Point predecessor to the new node', explanation: 'The new node is now reachable from head. No existing node value moved in memory.' }))
  steps.push(snapshot(nodes, { activeIds: [], phase: 'complete', title: 'Insertion complete', explanation: `The list contains ${nodes.length} nodes. Insertion changed two links and moved zero existing values.` }))
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
