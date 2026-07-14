// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PredictionCheckpoint, type PredictionCheckpointDefinition } from './PredictionCheckpoint'

const definition: PredictionCheckpointDefinition = {
  question: 'What is guaranteed after a complete Bubble Sort pass?',
  options: [
    { id: 'all', label: 'The entire array is sorted.' },
    { id: 'largest', label: 'The largest unsorted value reaches the right boundary.' },
    { id: 'smallest', label: 'The smallest value reaches index zero.' },
  ],
  correctOptionId: 'largest',
  hint: 'Follow the larger value in each adjacent comparison.',
  explanation: 'Each comparison moves the larger neighbor right, so the pass carries its maximum to the boundary.',
}

afterEach(cleanup)

describe('PredictionCheckpoint', () => {
  it('offers a hint after an incorrect answer and allows another attempt', async () => {
    const user = userEvent.setup()
    render(<PredictionCheckpoint definition={definition} />)

    const wrongAnswer = screen.getByRole('button', { name: 'The entire array is sorted.' })
    await user.click(wrongAnswer)

    expect(screen.getByRole('status').textContent).toContain('Not quite')
    expect(screen.getByRole('status').textContent).toContain(definition.hint)
    expect((wrongAnswer as HTMLButtonElement).disabled).toBe(false)
    expect(wrongAnswer.getAttribute('aria-pressed')).toBe('true')
  })

  it('explains a correct answer and locks the options', async () => {
    const user = userEvent.setup()
    render(<PredictionCheckpoint definition={definition} />)

    await user.click(screen.getByRole('button', { name: 'The largest unsorted value reaches the right boundary.' }))

    expect(screen.getByRole('status').textContent).toContain('That reasoning holds')
    expect(screen.getByRole('status').textContent).toContain(definition.explanation)
    for (const option of definition.options) {
      expect((screen.getByRole('button', { name: option.label }) as HTMLButtonElement).disabled).toBe(true)
    }
  })

  it('can reset a completed checkpoint', async () => {
    const user = userEvent.setup()
    render(<PredictionCheckpoint definition={definition} />)

    await user.click(screen.getByRole('button', { name: 'The largest unsorted value reaches the right boundary.' }))
    await user.click(screen.getByRole('button', { name: 'Reset checkpoint' }))

    expect(screen.queryByRole('status')).toBeNull()
    for (const option of definition.options) {
      expect((screen.getByRole('button', { name: option.label }) as HTMLButtonElement).disabled).toBe(false)
    }
  })
})
