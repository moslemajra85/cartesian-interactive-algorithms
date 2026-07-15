// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

beforeEach(() => {
  window.history.replaceState(null, '', '/')
  window.localStorage.clear()
  Object.defineProperty(window, 'scrollTo', { value: vi.fn(), configurable: true })
})

afterEach(cleanup)

describe('application routing', () => {
  it('opens the Foundations catalogue and its first lesson', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Start chapter: The Foundations' }))
    expect(window.location.hash).toBe('#foundations')
    expect(screen.getByRole('heading', { level: 1, name: 'The Foundations' })).toBeTruthy()

    await user.click(screen.getByRole('button', { name: 'Start Growth of Work' }))
    expect(window.location.hash).toBe('#complexity-growth')
    expect(screen.getByRole('heading', { level: 1, name: 'Growth of Work' })).toBeTruthy()

    await user.click(screen.getByRole('button', { name: '02 · Counting Operations' }))
    expect(window.location.hash).toBe('#counting-operations')
    expect(screen.getByRole('heading', { level: 1, name: 'Counting Operations' })).toBeTruthy()

    await user.click(screen.getByRole('button', { name: '03 · Space Complexity' }))
    expect(window.location.hash).toBe('#space-complexity')
    expect(screen.getByRole('heading', { level: 1, name: 'Space Complexity' })).toBeTruthy()

    await user.click(screen.getByRole('button', { name: '04 · Cases & Guarantees' }))
    expect(window.location.hash).toBe('#complexity-cases')
    expect(screen.getByRole('heading', { level: 1, name: 'Cases & Guarantees' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: 'Set a latency budget for customer lookup' })).toBeTruthy()
    expect(screen.getByText('The on-call team needs a defensible response-time ceiling.')).toBeTruthy()

    fireEvent.change(screen.getByRole('slider', { name: 'Experiment with input size' }), { target: { value: '8' } })
    expect(screen.getByText('LINEAR SEARCH · n = 8')).toBeTruthy()
    expect(screen.getByRole('slider').getAttribute('aria-valuetext')).toBe('8 items')

    await user.click(screen.getByRole('button', { name: '05 · Recursion & the Stack' }))
    expect(window.location.hash).toBe('#recursion-stack')
    expect(screen.getByRole('heading', { level: 1, name: 'Recursion & the Stack' })).toBeTruthy()
    fireEvent.change(screen.getByRole('slider', { name: 'Experiment with recursion depth' }), { target: { value: '6' } })
    expect(screen.getByText('CALL STACK · DEPTH 6')).toBeTruthy()
    await user.click(screen.getByRole('button', { name: '06 · Time–Space Trade-offs' }))
    expect(window.location.hash).toBe('#time-space-tradeoff')
    expect(screen.getByRole('heading', { level: 1, name: 'Time–Space Trade-offs' })).toBeTruthy()
  })

  it('opens the catalogue and lesson from registry-derived navigation', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Start chapter: Arrays & Sorting' }))
    const catalogueHeading = screen.getByRole('heading', { level: 1, name: 'Arrays & Sorting' })
    expect(window.location.hash).toBe('#arrays')
    expect(document.title).toBe('Arrays & Sorting — Cartesian')
    expect(document.activeElement).toBe(catalogueHeading)

    await user.click(screen.getByRole('button', { name: 'Start Bubble Sort' }))
    const lessonHeading = screen.getByRole('heading', { level: 1, name: 'Bubble Sort' })
    expect(window.location.hash).toBe('#bubble-sort')
    expect(document.title).toBe('Bubble Sort — Cartesian')
    expect(document.activeElement).toBe(lessonHeading)
    expect(screen.getByRole('heading', { level: 2, name: 'Reorder a physical queue with adjacent moves' })).toBeTruthy()
  })

  it('responds to browser history route events', async () => {
    render(<App />)

    window.history.pushState(null, '', '#selection-sort')
    window.dispatchEvent(new PopStateEvent('popstate'))

    const heading = await screen.findByRole('heading', { level: 1, name: 'Selection Sort' })
    await waitFor(() => expect(document.activeElement).toBe(heading))
    expect(document.title).toBe('Selection Sort — Cartesian')
  })

  it('renders an explicit not-found route without corrupting progress', async () => {
    window.history.replaceState(null, '', '#unknown-lesson')
    render(<App />)

    expect(screen.getByRole('heading', { level: 1, name: 'This page is outside the map.' })).toBeTruthy()
    expect(screen.getByText('#unknown-lesson')).toBeTruthy()
    await waitFor(() => expect(document.title).toBe('Page not found — Cartesian'))
    expect(window.localStorage.getItem('cartesian.learning-progress.v1')).toContain('"lastLessonSlug":null')
  })
})

describe('lesson search', () => {
  it('filters lessons and opens the selected result', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Search lessons' }))
    const searchInput = screen.getByRole('searchbox', { name: 'Search by algorithm or idea' })
    expect(document.activeElement).toBe(searchInput)

    await user.type(searchInput, 'merge')
    expect(screen.getByRole('button', { name: /Merge Sort/ })).toBeTruthy()
    expect(screen.queryByRole('button', { name: /Bubble Sort/ })).toBeNull()

    await user.click(screen.getByRole('button', { name: /Merge Sort/ }))
    expect(window.location.hash).toBe('#merge-sort')
    expect(screen.getByRole('heading', { level: 1, name: 'Merge Sort' })).toBeTruthy()
    expect(screen.queryByRole('searchbox')).toBeNull()
  })

  it('closes with Escape and restores focus without triggering the menu shortcut while typing', async () => {
    const user = userEvent.setup()
    render(<App />)

    const searchButton = screen.getByRole('button', { name: 'Search lessons' })
    await user.click(searchButton)
    await user.type(screen.getByRole('searchbox'), 'm')
    expect(screen.getByRole('button', { name: 'Chapters' }).getAttribute('aria-expanded')).toBe('false')

    await user.keyboard('{Escape}')
    await waitFor(() => expect(document.activeElement).toBe(searchButton))
    expect(screen.queryByRole('searchbox')).toBeNull()
  })
})

describe('Linked Structures chapter', () => {
  it('opens the chapter and lets a learner configure an insertion', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Start chapter: Linked Structures' }))
    expect(window.location.hash).toBe('#linked-lists')
    await user.click(screen.getByRole('button', { name: 'Start Linked List Insertion' }))
    expect(window.location.hash).toBe('#linked-insertion')

    await user.selectOptions(screen.getByLabelText('Insert after'), '2')
    const valueInput = screen.getByLabelText('New value')
    await user.clear(valueInput)
    await user.type(valueInput, '88')
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    await user.click(screen.getByRole('button', { name: 'Next step' }))

    expect(screen.getByRole('img').getAttribute('aria-label')).toContain('1 detached nodes')
    expect(screen.getByText('Allocate node 88')).toBeTruthy()

    await user.click(screen.getByRole('button', { name: '02 · Linked List Deletion' }))
    expect(window.location.hash).toBe('#linked-deletion')
    await user.selectOptions(screen.getByLabelText('Remove stop'), '3')
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    await user.click(screen.getByRole('button', { name: 'Next step' }))
    await user.click(screen.getByRole('button', { name: 'Next step' }))
    expect(screen.getByText('Bypass 62')).toBeTruthy()
    expect(screen.getByRole('img').getAttribute('aria-label')).toContain('1 detached nodes')

    await user.click(screen.getByRole('button', { name: '03 · Traversal & Search' }))
    expect(window.location.hash).toBe('#linked-traversal')
    await user.click(screen.getByRole('button', { name: 'Try missing' }))
    expect(screen.getByText('Search for 99')).toBeTruthy()
    await user.click(screen.getByRole('button', { name: 'Next step' }))
    expect(screen.getByText('Inspect 14')).toBeTruthy()

    await user.click(screen.getByRole('button', { name: '04 · Stack Push & Pop' }))
    expect(window.location.hash).toBe('#stack-push-pop')
    await user.click(screen.getByRole('button', { name: 'Try final item' }))
    expect(screen.getByText('Pop 62')).toBeTruthy()
    await user.click(screen.getByRole('button', { name: 'Next step' }))
    expect(screen.getByText('Read top value 62')).toBeTruthy()
    await user.click(screen.getByRole('button', { name: 'Next step' }))
    expect(screen.getByText('Move top to null')).toBeTruthy()

    await user.click(screen.getByRole('button', { name: '05 · Queue Enqueue & Dequeue' }))
    expect(window.location.hash).toBe('#queue-enqueue-dequeue')
    await user.click(screen.getByRole('button', { name: 'Try final item' }))
    expect(screen.getByText('Dequeue 14')).toBeTruthy()
    await user.click(screen.getByRole('button', { name: 'Next step' }))
    expect(screen.getByText('Read front value 14')).toBeTruthy()
    await user.click(screen.getByRole('button', { name: 'Next step' }))
    expect(screen.getByText('Move front to null')).toBeTruthy()
    await user.click(screen.getByRole('button', { name: 'Next step' }))
    expect(screen.getByText('Clear rear for the empty queue')).toBeTruthy()
  })
})
