import { createLinkedNodes, snapshotLinkedNodes, type LinkedNode } from '../model/linkedList'

export type CyclePhase = 'ready' | 'advance' | 'compare' | 'found' | 'not-found'
export type PointerMovement = { pointerId: 'slow' | 'fast'; fromId: string; toId: string | null; hops: number }

export type CycleStep = {
  nodes: LinkedNode[]
  headId: string
  activeIds: string[]
  slowId: string | null
  fastId: string | null
  movements: PointerMovement[]
  comparisonCount: number
  phase: CyclePhase
  title: string
  explanation: string
}

function snapshot(nodes: LinkedNode[], details: Omit<CycleStep, 'nodes' | 'headId'>): CycleStep {
  return { nodes: snapshotLinkedNodes(nodes), headId: 'node-0', ...details }
}

function nextId(nodesById: Map<string, LinkedNode>, id: string | null): string | null {
  return id ? nodesById.get(id)?.nextId ?? null : null
}

export function createCycleDetectionSteps(values: number[], cycleEntryIndex: number | null): CycleStep[] {
  if (values.length < 2) throw new RangeError('Cycle detection requires at least two nodes.')
  if (cycleEntryIndex !== null && (!Number.isInteger(cycleEntryIndex) || cycleEntryIndex < 0 || cycleEntryIndex >= values.length)) {
    throw new RangeError('Cycle entry is outside the list.')
  }

  const nodes = createLinkedNodes(values)
  if (cycleEntryIndex !== null) nodes.at(-1)!.nextId = nodes[cycleEntryIndex].id
  const nodesById = new Map(nodes.map((node) => [node.id, node]))
  let slowId: string | null = nodes[0].id
  let fastId: string | null = nodes[0].id
  let comparisonCount = 0
  const steps = [snapshot(nodes, {
    activeIds: [slowId], slowId, fastId, movements: [], comparisonCount,
    phase: 'ready', title: 'Place slow and fast at head',
    explanation: 'Both pointers begin at the known entry. Equality here is expected, so detection starts only after they move at different speeds.',
  })]

  while (fastId && nextId(nodesById, fastId)) {
    const slowFromId = slowId!
    const fastFromId = fastId
    slowId = nextId(nodesById, slowId)
    fastId = nextId(nodesById, nextId(nodesById, fastId))
    const movements: PointerMovement[] = [
      { pointerId: 'slow', fromId: slowFromId, toId: slowId, hops: 1 },
      { pointerId: 'fast', fromId: fastFromId, toId: fastId, hops: 2 },
    ]
    steps.push(snapshot(nodes, {
      activeIds: [slowId, fastId].filter((id): id is string => id !== null), slowId, fastId, movements, comparisonCount,
      phase: 'advance', title: 'Advance at different speeds',
      explanation: `slow follows one next reference to ${slowId ? nodesById.get(slowId)?.value : 'null'}; fast follows two to ${fastId ? nodesById.get(fastId)?.value : 'null'}.`,
    }))

    if (fastId === null) break
    comparisonCount += 1
    steps.push(snapshot(nodes, {
      activeIds: slowId === fastId ? [slowId!] : [slowId!, fastId], slowId, fastId, movements: [], comparisonCount,
      phase: 'compare', title: slowId === fastId ? `Pointers meet at ${nodesById.get(slowId!)?.value}` : 'Compare slow and fast',
      explanation: slowId === fastId ? 'Both pointer identities reference the same node. A faster pointer can catch a slower pointer only by circling inside a loop.' : 'The pointers reference different nodes, so continue while fast can still take another step.',
    }))
    if (slowId === fastId) {
      steps.push(snapshot(nodes, {
        activeIds: [slowId!], slowId, fastId, movements: [], comparisonCount,
        phase: 'found', title: 'Cycle confirmed', explanation: `slow and fast meet at node ${nodesById.get(slowId!)?.value} after ${comparisonCount} pointer comparisons. No visited-node set was needed.`,
      }))
      return steps
    }
  }

  steps.push(snapshot(nodes, {
    activeIds: [], slowId, fastId, movements: [], comparisonCount,
    phase: 'not-found', title: 'Fast finds a null boundary', explanation: 'Either fast is null or fast.next is null, so another two-hop move is impossible. The chain terminates and therefore has no cycle.',
  }))
  return steps
}
