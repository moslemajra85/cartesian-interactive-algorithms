// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { createLinkedDeletionSteps } from './linkedDeletion'
import { createLinkedInsertionSteps, type LinkedNode } from './linkedInsertion'
import { LinkedListVisualizer } from './LinkedListVisualizer'
import { createLinkedTraversalSteps } from './linkedTraversal'

afterEach(cleanup)

function Visualizer({ step, emphasizedIds = [] }: {
  step: { nodes: LinkedNode[]; headId: string; activeIds: string[] }
  emphasizedIds?: string[]
}) {
  return <LinkedListVisualizer nodes={step.nodes} headId={step.headId} activeIds={step.activeIds} emphasizedIds={emphasizedIds} />
}

describe('LinkedListVisualizer motion semantics', () => {
  it('keeps a stable node identity while it moves from detached to reachable', () => {
    const steps = createLinkedInsertionSteps([10, 20, 30], 25, 1)
    const { container, rerender } = render(<Visualizer step={steps[1]} emphasizedIds={['node-new']} />)

    expect(container.querySelector('[data-node-id="node-new"]')?.getAttribute('data-reachability')).toBe('detached')

    rerender(<Visualizer step={steps[3]} emphasizedIds={['node-new']} />)
    expect(container.querySelector('[data-node-id="node-new"]')?.getAttribute('data-reachability')).toBe('reachable')
    expect(container.querySelector('[data-pointer="node-1->node-new"]')).toBeTruthy()
    expect(container.querySelector('[data-pointer="node-new->node-2"]')).toBeTruthy()
  })

  it('shows a bypassed node as detached before its exit', async () => {
    const steps = createLinkedDeletionSteps([10, 20, 30], 1)
    const { container, rerender } = render(<Visualizer step={steps[2]} emphasizedIds={['node-1']} />)

    expect(screen.getByRole('img').getAttribute('aria-label')).toContain('1 detached nodes')
    expect(container.querySelector('[data-node-id="node-1"]')?.getAttribute('data-reachability')).toBe('detached')
    expect(container.querySelector('[data-pointer="node-0->node-2"]')).toBeTruthy()

    rerender(<Visualizer step={steps[3]} emphasizedIds={['node-1']} />)
    await waitFor(() => expect(container.querySelector('[data-node-id="node-1"]')).toBeNull())
  })

  it('marks the pointer currently followed during traversal', () => {
    const step = createLinkedInsertionSteps([10, 20], 15, 0)[0]
    render(<LinkedListVisualizer nodes={step.nodes} headId={step.headId} activeIds={['node-0', 'node-1']} />)

    expect(document.querySelector('[data-pointer="node-0->node-1"]')?.classList.contains('is-active')).toBe(true)
  })

  it('moves the named current pointer while preserving its variable identity', () => {
    const steps = createLinkedTraversalSteps([10, 20, 30], 30)
    const { container, rerender } = render(
      <LinkedListVisualizer nodes={steps[1].nodes} headId={steps[1].headId} activeIds={steps[1].activeIds} pointers={[{ id: 'current', label: 'current', nodeId: steps[1].currentId }]} />,
    )
    expect(container.querySelector('[data-variable-pointer="current"]')?.getAttribute('data-pointer-node')).toBe('node-0')

    rerender(<LinkedListVisualizer nodes={steps[2].nodes} headId={steps[2].headId} activeIds={steps[2].activeIds} pointers={[{ id: 'current', label: 'current', nodeId: steps[2].currentId }]} visitedIds={steps[2].visitedIds} followedEdge={steps[2].followedEdge} />)
    expect(container.querySelector('[data-variable-pointer="current"]')?.getAttribute('data-pointer-node')).toBe('node-1')
    expect(container.querySelector('[data-node-id="node-0"]')?.textContent).toContain('VISITED')
    expect(container.querySelector('[data-pointer="node-0->node-1"]')?.classList.contains('is-active')).toBe(true)
    expect(screen.getByRole('img').getAttribute('aria-label')).toContain('current points to 20')
  })

  it('shows current at null after an unsuccessful traversal', () => {
    const step = createLinkedTraversalSteps([10, 20], 99).at(-1)!
    const { container } = render(
      <LinkedListVisualizer nodes={step.nodes} headId={step.headId} activeIds={step.activeIds} pointers={[{ id: 'current', label: 'current', nodeId: step.currentId }]} visitedIds={step.visitedIds} followedEdge={step.followedEdge} />,
    )

    expect(container.querySelector('[data-variable-pointer="current"]')?.getAttribute('data-pointer-node')).toBe('null')
    expect(container.querySelector('[data-pointer="node-1->null"]')?.classList.contains('is-active')).toBe(true)
    expect(screen.getByRole('img').getAttribute('aria-label')).toContain('current is null')
  })

  it('renders several named references and narrates a rewritten edge', () => {
    const step = createLinkedInsertionSteps([10, 20, 30], 25, 1).find(({ phase }) => phase === 'link-predecessor')!
    const { container } = render(
      <LinkedListVisualizer
        nodes={step.nodes}
        headId={step.headId}
        activeIds={step.activeIds}
        pointers={[
          { id: 'predecessor', label: 'predecessor', nodeId: step.predecessorId, tone: 'reference' },
          { id: 'new', label: 'new', nodeId: step.newId, tone: 'new' },
          { id: 'successor', label: 'successor', nodeId: step.successorId },
        ]}
        followedEdge={step.followedEdge}
        edgeAction="write"
      />,
    )

    expect(container.querySelectorAll('[data-variable-pointer]')).toHaveLength(3)
    expect(container.querySelector('[data-pointer="node-1->node-new"]')?.classList.contains('is-active')).toBe(true)
    expect(container.querySelector('[data-node-id="node-1"]')?.classList.contains('is-edge-source')).toBe(true)
    expect(screen.getByText('REFERENCE WRITE')).toBeTruthy()
    expect(screen.getByText('20.next')).toBeTruthy()
    expect(screen.getByRole('img').getAttribute('aria-label')).toContain('predecessor points to 20')
  })
})
