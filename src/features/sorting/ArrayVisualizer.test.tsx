// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { ArrayVisualizer } from './ArrayVisualizer'
import { describeArrayStep } from './describeArrayStep'
import type { SortStep } from './sortStep'

afterEach(cleanup)

function createStep(overrides: Partial<SortStep> = {}): SortStep {
  return {
    values: [8, 3, 5],
    compared: null,
    swapped: null,
    sortedIndices: [],
    line: 0,
    pass: 0,
    title: 'Test step',
    explanation: 'Test explanation',
    ...overrides,
  }
}

describe('describeArrayStep', () => {
  it('describes comparisons and ordered positions with their values', () => {
    const description = describeArrayStep(createStep({
      compared: [0, 1],
      sortedIndices: [2],
    }))

    expect(description).toBe(
      'Values by index: 0: 8, 1: 3, 2: 5. Comparing indices 0 and 1, values 8 and 3. Ordered indices: 2.',
    )
  })

  it('distinguishes a search midpoint from a pair comparison', () => {
    const description = describeArrayStep(createStep({
      compared: [1, 1],
      activeRange: [1, 2],
    }))

    expect(description).toContain('Active indices 1 through 2.')
    expect(description).toContain('Inspecting index 1, value 3.')
  })

  it('announces an exhausted search interval', () => {
    expect(describeArrayStep(createStep({ activeRange: [0, -1] })))
      .toContain('No active indices remain.')
  })
})

describe('ArrayVisualizer', () => {
  it('exposes one semantic description while hiding decorative bars', () => {
    const step = createStep({ swapped: [0, 1] })
    const { container } = render(<ArrayVisualizer step={step} playing={false} />)

    expect(screen.getByRole('img').getAttribute('aria-label')).toContain('Indices 0 and 1 were swapped.')
    expect(container.querySelectorAll('.bar-slot[aria-hidden="true"]')).toHaveLength(step.values.length)
  })

  it('renders visible state labels instead of relying on color alone', () => {
    const { rerender } = render(<ArrayVisualizer step={createStep({ compared: [0, 1] })} playing={false} />)

    expect(screen.getAllByText('CHECK')).toHaveLength(2)

    rerender(<ArrayVisualizer step={createStep({ swapped: [0, 1] })} playing={false} />)
    expect(screen.getAllByText('MOVED')).toHaveLength(2)

    rerender(<ArrayVisualizer step={createStep({ sortedIndices: [2] })} playing={false} />)
    expect(screen.getByText('ORDERED')).toBeTruthy()
  })

  it('uses search-specific labels for midpoint, discarded, and found states', () => {
    const { rerender } = render(
      <ArrayVisualizer
        step={createStep({ compared: [1, 1], activeRange: [1, 2] })}
        playing={false}
        mode="search"
      />,
    )

    expect(screen.getByText('MID')).toBeTruthy()
    expect(screen.getByText('OUT')).toBeTruthy()

    rerender(
      <ArrayVisualizer
        step={createStep({ compared: [1, 1], sortedIndices: [1], activeRange: [0, 2] })}
        playing={false}
        mode="search"
      />,
    )
    expect(screen.getByText('FOUND')).toBeTruthy()
  })
})
