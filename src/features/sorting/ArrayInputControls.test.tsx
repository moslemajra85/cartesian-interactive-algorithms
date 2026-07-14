// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ArrayInputControls } from './ArrayInputControls'

afterEach(cleanup)

describe('ArrayInputControls', () => {
  it('applies a valid custom array and closes the editor', async () => {
    const user = userEvent.setup()
    const onApply = vi.fn()
    render(<ArrayInputControls values={[5, 2, 7]} onApply={onApply} onShuffle={() => undefined} />)

    await user.click(screen.getByRole('button', { name: 'Set values' }))
    const input = screen.getByRole('textbox', { name: 'Your array' })
    await user.clear(input)
    await user.type(input, '9, 2, 2, 6')
    await user.click(screen.getByRole('button', { name: 'Apply' }))

    expect(onApply).toHaveBeenCalledWith([9, 2, 2, 6])
    expect(screen.queryByRole('textbox', { name: 'Your array' })).toBeNull()
  })

  it('shows validation feedback without applying invalid values', async () => {
    const user = userEvent.setup()
    const onApply = vi.fn()
    render(<ArrayInputControls values={[5, 2, 7]} onApply={onApply} onShuffle={() => undefined} />)

    await user.click(screen.getByRole('button', { name: 'Set values' }))
    const input = screen.getByRole('textbox', { name: 'Your array' })
    await user.clear(input)
    await user.type(input, '5, nope, 3')
    await user.click(screen.getByRole('button', { name: 'Apply' }))

    expect(screen.getByRole('alert').textContent).toBe('Use whole numbers separated by commas or spaces.')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(onApply).not.toHaveBeenCalled()
  })

  it('cancels edits and delegates shuffling', async () => {
    const user = userEvent.setup()
    const onShuffle = vi.fn()
    render(<ArrayInputControls values={[5, 2, 7]} onApply={() => undefined} onShuffle={onShuffle} />)

    await user.click(screen.getByRole('button', { name: 'Set values' }))
    await user.clear(screen.getByRole('textbox', { name: 'Your array' }))
    await user.type(screen.getByRole('textbox', { name: 'Your array' }), '1, 2')
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    await user.click(screen.getByRole('button', { name: 'Shuffle' }))

    expect(screen.queryByRole('textbox', { name: 'Your array' })).toBeNull()
    expect(onShuffle).toHaveBeenCalledOnce()
  })
})
