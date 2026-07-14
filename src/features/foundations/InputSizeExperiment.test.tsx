// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { InputSizeExperiment } from './InputSizeExperiment'

afterEach(cleanup)

describe('InputSizeExperiment', () => {
  it('reports direct slider experiments as numbers', () => {
    const onChange = vi.fn()
    render(<InputSizeExperiment value={4} min={1} max={10} onChange={onChange} />)

    fireEvent.change(screen.getByRole('slider', { name: 'Experiment with input size' }), { target: { value: '8' } })

    expect(onChange).toHaveBeenCalledWith(8)
  })

  it('supports precise increment and decrement experiments', () => {
    const onChange = vi.fn()
    render(<InputSizeExperiment value={4} min={1} max={10} onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: 'Decrease input size' }))
    fireEvent.click(screen.getByRole('button', { name: 'Increase input size' }))

    expect(onChange).toHaveBeenNthCalledWith(1, 3)
    expect(onChange).toHaveBeenNthCalledWith(2, 5)
  })

  it('disables controls that would leave the supported range', () => {
    const { rerender } = render(<InputSizeExperiment value={1} min={1} max={3} onChange={() => undefined} />)

    expect((screen.getByRole('button', { name: 'Decrease input size' }) as HTMLButtonElement).disabled).toBe(true)
    expect(screen.getByRole('slider').getAttribute('aria-valuetext')).toBe('1 item')

    rerender(<InputSizeExperiment value={3} min={1} max={3} onChange={() => undefined} />)
    expect((screen.getByRole('button', { name: 'Increase input size' }) as HTMLButtonElement).disabled).toBe(true)
    expect(screen.getByRole('slider').getAttribute('aria-valuetext')).toBe('3 items')
  })
})
