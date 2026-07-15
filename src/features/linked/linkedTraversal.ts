import type { LinkedNode } from './linkedInsertion'

export type LinkedTraversalPhase = 'ready' | 'inspect' | 'advance' | 'found' | 'not-found'
export type LinkedTraversalStep = {
  nodes: LinkedNode[]
  headId: string
  activeIds: string[]
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
  const steps = [snapshot(nodes, { activeIds: [], phase: 'ready', title: `Search for ${target}`, explanation: 'Only head is known. Begin there and follow one next reference at a time.' })]

  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index]
    steps.push(snapshot(nodes, { activeIds: [node.id], phase: 'inspect', title: `Inspect ${node.value}`, explanation: `${node.value} ${node.value === target ? 'matches' : 'does not match'} the target ${target}.` }))
    if (node.value === target) {
      steps.push(snapshot(nodes, { activeIds: [node.id], phase: 'found', title: `${target} found`, explanation: `The target was found after ${index + 1} ${index === 0 ? 'comparison' : 'comparisons'}. Traversal can stop.` }))
      return steps
    }
    if (node.nextId) {
      steps.push(snapshot(nodes, { activeIds: [node.id, node.nextId], phase: 'advance', title: 'Follow next', explanation: 'The current node is not the target. Its next reference is the only route to the remaining candidates.' }))
    }
  }

  steps.push(snapshot(nodes, { activeIds: [], phase: 'not-found', title: `${target} is not in the list`, explanation: `Traversal reached null after ${nodes.length} comparisons. Every reachable node was inspected.` }))
  return steps
}
