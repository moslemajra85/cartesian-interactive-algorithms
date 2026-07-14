// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useStepPlayback } from './useStepPlayback'

function PlaybackHarness({ stepCount }: { stepCount: number }) {
  const playback = useStepPlayback(stepCount)

  return (
    <div>
      <output aria-label="step">{playback.stepIndex}</output>
      <output aria-label="state">{playback.playing ? 'playing' : playback.isComplete ? 'complete' : 'paused'}</output>
      <output aria-label="speed">{playback.speedIndex}</output>
      <button type="button" onClick={playback.togglePlayback}>Toggle</button>
      <button type="button" onClick={() => playback.moveTo(playback.stepIndex - 1)}>Previous</button>
      <button type="button" onClick={() => playback.moveTo(playback.stepIndex + 1)}>Next</button>
      <button type="button" onClick={playback.cycleSpeed}>Speed</button>
      <input aria-label="editor" />
    </div>
  )
}

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('useStepPlayback', () => {
  it('advances on the selected interval and stops at the final step', () => {
    render(<PlaybackHarness stepCount={3} />)

    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }))
    expect(screen.getByLabelText('state').textContent).toBe('playing')

    act(() => vi.advanceTimersByTime(750))
    expect(screen.getByLabelText('step').textContent).toBe('1')

    act(() => vi.advanceTimersByTime(750))
    expect(screen.getByLabelText('step').textContent).toBe('2')
    expect(screen.getByLabelText('state').textContent).toBe('complete')
  })

  it('clamps manual movement to the timeline boundaries', () => {
    render(<PlaybackHarness stepCount={2} />)

    fireEvent.click(screen.getByRole('button', { name: 'Previous' }))
    expect(screen.getByLabelText('step').textContent).toBe('0')

    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByLabelText('step').textContent).toBe('1')

    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }))
    expect(screen.getByLabelText('step').textContent).toBe('0')
    expect(screen.getByLabelText('state').textContent).toBe('paused')
  })

  it('supports keyboard stepping and ignores shortcuts in form fields', () => {
    render(<PlaybackHarness stepCount={3} />)

    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(screen.getByLabelText('step').textContent).toBe('1')

    const editor = screen.getByRole('textbox', { name: 'editor' })
    editor.focus()
    fireEvent.keyDown(editor, { key: 'ArrowRight' })
    expect(screen.getByLabelText('step').textContent).toBe('1')
  })

  it('cycles through all playback speeds', () => {
    render(<PlaybackHarness stepCount={3} />)

    const speedButton = screen.getByRole('button', { name: 'Speed' })
    expect(screen.getByLabelText('speed').textContent).toBe('1')
    fireEvent.click(speedButton)
    expect(screen.getByLabelText('speed').textContent).toBe('2')
    fireEvent.click(speedButton)
    expect(screen.getByLabelText('speed').textContent).toBe('0')
  })
})
