// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchInputControls } from './SearchInputControls'

afterEach(cleanup)

describe('SearchInputControls', () => {
  it('sorts valid values before applying the search setup', async () => {
    const user = userEvent.setup()
    const onApply = vi.fn()
    render(<SearchInputControls values={[1, 3, 5]} target={3} onApply={onApply} onNewExample={() => undefined} />)

    await user.click(screen.getByRole('button', { name: 'Set search' }))
    await user.clear(screen.getByRole('textbox', { name: 'Values' }))
    await user.type(screen.getByRole('textbox', { name: 'Values' }), '9, 2, 6, 2')
    await user.clear(screen.getByRole('textbox', { name: 'Target' }))
    await user.type(screen.getByRole('textbox', { name: 'Target' }), '6')
    await user.click(screen.getByRole('button', { name: 'Apply' }))

    expect(onApply).toHaveBeenCalledWith([2, 2, 6, 9], 6)
    expect(screen.queryByRole('textbox', { name: 'Values' })).toBeNull()
  })

  it('shows target validation without applying', async () => {
    const user = userEvent.setup()
    const onApply = vi.fn()
    render(<SearchInputControls values={[1, 3, 5]} target={3} onApply={onApply} onNewExample={() => undefined} />)

    await user.click(screen.getByRole('button', { name: 'Set search' }))
    await user.clear(screen.getByRole('textbox', { name: 'Target' }))
    await user.type(screen.getByRole('textbox', { name: 'Target' }), '100')
    await user.click(screen.getByRole('button', { name: 'Apply' }))

    expect(screen.getByRole('alert').textContent).toBe('The target must be between 1 and 99.')
    expect(onApply).not.toHaveBeenCalled()
  })

  it('delegates generation of a new example', async () => {
    const user = userEvent.setup()
    const onNewExample = vi.fn()
    render(<SearchInputControls values={[1, 3, 5]} target={3} onApply={() => undefined} onNewExample={onNewExample} />)

    await user.click(screen.getByRole('button', { name: 'New example' }))
    expect(onNewExample).toHaveBeenCalledOnce()
  })
})
