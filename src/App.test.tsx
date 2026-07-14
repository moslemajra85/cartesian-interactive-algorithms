// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

beforeEach(() => {
  window.history.replaceState(null, '', '/')
  window.localStorage.clear()
  Object.defineProperty(window, 'scrollTo', { value: vi.fn(), configurable: true })
})

afterEach(cleanup)

describe('application routing', () => {
  it('opens the catalogue and lesson from registry-derived navigation', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Start chapter' }))
    const catalogueHeading = screen.getByRole('heading', { level: 1, name: 'Arrays & Sorting' })
    expect(window.location.hash).toBe('#arrays')
    expect(document.title).toBe('Arrays & Sorting — Cartesian')
    expect(document.activeElement).toBe(catalogueHeading)

    await user.click(screen.getByRole('button', { name: 'Start Bubble Sort' }))
    const lessonHeading = screen.getByRole('heading', { level: 1, name: 'Bubble Sort' })
    expect(window.location.hash).toBe('#bubble-sort')
    expect(document.title).toBe('Bubble Sort — Cartesian')
    expect(document.activeElement).toBe(lessonHeading)
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
