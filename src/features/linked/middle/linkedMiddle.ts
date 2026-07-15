import { createLinkedNodes, snapshotLinkedNodes, type LinkedNode, type LinkedPointerMovement } from '../model/linkedList'

export type MiddlePhase = 'ready' | 'advance' | 'found'
export type MiddleStep = { nodes: LinkedNode[]; headId: string; activeIds: string[]; slowId: string; fastId: string | null; movements: LinkedPointerMovement[]; round: number; phase: MiddlePhase; title: string; explanation: string }

function snapshot(nodes: LinkedNode[], details: Omit<MiddleStep, 'nodes' | 'headId'>): MiddleStep {
  return { nodes: snapshotLinkedNodes(nodes), headId: 'node-0', ...details }
}

export function createMiddleSteps(values: number[]): MiddleStep[] {
  if (values.length < 1) throw new RangeError('Finding a middle requires at least one node.')
  const nodes = createLinkedNodes(values)
  const byId = new Map(nodes.map((node) => [node.id, node]))
  let slowId = nodes[0].id
  let fastId: string | null = nodes[0].id
  let round = 0
  const steps = [snapshot(nodes, { activeIds: [slowId], slowId, fastId, movements: [], round, phase: 'ready', title: 'Place slow and fast at head', explanation: 'The list length is unknown. slow will measure one step while fast tests two steps of remaining path.' })]

  while (fastId && byId.get(fastId)?.nextId) {
    const slowFromId = slowId
    const fastFromId = fastId
    slowId = byId.get(slowId)!.nextId!
    const fastNextId: string | null = byId.get(fastId)!.nextId
    fastId = fastNextId ? byId.get(fastNextId)?.nextId ?? null : null
    round += 1
    const movements: LinkedPointerMovement[] = [{ pointerId: 'slow', fromId: slowFromId, toId: slowId, hops: 1 }, { pointerId: 'fast', fromId: fastFromId, toId: fastId, hops: 2 }]
    steps.push(snapshot(nodes, { activeIds: [slowId, fastId].filter((id): id is string => id !== null), slowId, fastId, movements, round, phase: 'advance', title: `Advance round ${round}`, explanation: `slow moves to ${byId.get(slowId)?.value}; fast ${fastId ? `moves to ${byId.get(fastId)?.value}` : 'passes the tail and becomes null'}.` }))
  }

  steps.push(snapshot(nodes, { activeIds: [slowId], slowId, fastId, movements: [], round, phase: 'found', title: `Middle is ${byId.get(slowId)?.value}`, explanation: `${fastId ? 'fast cannot take another step' : 'fast reached null'}. slow has traveled half as many links, so it identifies ${values.length % 2 === 0 ? 'the second of the two middle nodes' : 'the single middle node'}.` }))
  return steps
}
