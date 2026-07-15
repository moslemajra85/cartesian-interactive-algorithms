// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { createLinkedDeletionSteps } from './linkedDeletion'
import { createLinkedInsertionSteps, type LinkedNode } from './linkedInsertion'
import { LinkedListVisualizer } from './LinkedListVisualizer'

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
})
