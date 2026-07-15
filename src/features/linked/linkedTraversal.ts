import type { LinkedNode } from './linkedInsertion'

export type LinkedTraversalPhase = 'ready' | 'inspect' | 'advance' | 'found' | 'not-found'
export type LinkedTraversalEdge = { fromId: string; toId: string | null }
export type LinkedTraversalStep = {
  nodes: LinkedNode[]
  headId: string
  activeIds: string[]
  currentId: string | null
  visitedIds: string[]
  followedEdge: LinkedTraversalEdge | null
  comparisonCount: number
  phase: LinkedTraversalPhase
  title: string
  explanation: string
}

function snapshot(nodes: LinkedNode[], details: Omit<LinkedTraversalStep, 'nodes' | 'headId'>): LinkedTraversalStep {
  return { nodes: nodes.map((node) => ({ ...node })), headId: 'node-0', ...details }
}

export function createLinkedTraversalSteps(values: number[], target: number): LinkedTraversalStep[] {
  if (values.length < 1) throw new RangeError('Traversal requires at least one node.')
  if (!Number.isInteger(target)) throw new RangeError('Target must be a whole number.')
  const nodes: LinkedNode[] = values.map((value, index) => ({ id: `node-${index}`, value, nextId: index === values.length - 1 ? null : `node-${index + 1}` }))
  const steps = [snapshot(nodes, {
    activeIds: ['node-0'], currentId: 'node-0', visitedIds: [], followedEdge: null, comparisonCount: 0,
    phase: 'ready', title: `Search for ${target}`,
    explanation: `Set current to head, the node containing ${nodes[0].value}. No values have been compared with target ${target} yet.`,
  })]

  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index]
    const previouslyVisitedIds = nodes.slice(0, index).map(({ id }) => id)
    const visitedIds = nodes.slice(0, index + 1).map(({ id }) => id)
    steps.push(snapshot(nodes, {
      activeIds: [node.id], currentId: node.id, visitedIds: previouslyVisitedIds, followedEdge: null, comparisonCount: index + 1,
      phase: 'inspect', title: `Inspect ${node.value}`,
      explanation: `${node.value} ${node.value === target ? 'matches' : 'does not match'} the target. The current pointer stays here while the comparison runs.`,
    }))
    if (node.value === target) {
      steps.push(snapshot(nodes, {
        activeIds: [node.id], currentId: node.id, visitedIds, followedEdge: null, comparisonCount: index + 1,
        phase: 'found', title: `${target} found at current`,
        explanation: `current.value equals the target after ${index + 1} ${index === 0 ? 'comparison' : 'comparisons'}. Return this node; nodes after it do not need to be inspected.`,
      }))
      return steps
    }
    if (node.nextId) {
      steps.push(snapshot(nodes, {
        activeIds: [node.id, node.nextId], currentId: node.nextId, visitedIds,
        followedEdge: { fromId: node.id, toId: node.nextId }, comparisonCount: index + 1,
        phase: 'advance', title: `Move current to ${nodes[index + 1].value}`,
        explanation: `Execute current = current.next. The pointer follows ${node.id}.next from ${node.value} to ${nodes[index + 1].value}; the checked node remains visited.`,
      }))
    }
  }

  steps.push(snapshot(nodes, {
    activeIds: [], currentId: null, visitedIds: nodes.map(({ id }) => id),
    followedEdge: { fromId: nodes.at(-1)!.id, toId: null }, comparisonCount: nodes.length,
    phase: 'not-found', title: 'current reached null',
    explanation: `The last next reference is null. After ${nodes.length} comparisons, every reachable node is visited, so ${target} is not in the list.`,
  }))
  return steps
}
