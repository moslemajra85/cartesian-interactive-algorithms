import { useCallback, useEffect, useState } from 'react'
import { getPlaybackCommand } from '../sorting/playbackShortcuts'

const SPEEDS = [1200, 750, 380]

export function useStepPlayback(stepCount: number) {
  const [stepIndex, setStepIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speedIndex, setSpeedIndex] = useState(1)
  const isComplete = stepIndex === stepCount - 1

  useEffect(() => {
    setStepIndex((current) => Math.min(current, stepCount - 1))
  }, [stepCount])

  useEffect(() => {
    if (!playing) return
    if (isComplete) {
      setPlaying(false)
      return
    }

    const timeout = window.setTimeout(() => {
      setStepIndex((current) => Math.min(current + 1, stepCount - 1))
    }, SPEEDS[speedIndex])

    return () => window.clearTimeout(timeout)
  }, [isComplete, playing, speedIndex, stepCount, stepIndex])

  const moveTo = useCallback((nextStep: number) => {
    setPlaying(false)
    setStepIndex(Math.max(0, Math.min(nextStep, stepCount - 1)))
  }, [stepCount])

  const restart = useCallback(() => {
    setPlaying(false)
    setStepIndex(0)
  }, [])

  const togglePlayback = () => {
    if (isComplete) restart()
    else setPlaying((current) => !current)
  }

  const cycleSpeed = useCallback(() => setSpeedIndex((current) => (current + 1) % SPEEDS.length), [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target
      const hasInteractiveFocus = target instanceof Element
        && target.closest('button, a, input, textarea, select, [contenteditable="true"]') !== null
      if (hasInteractiveFocus) return

      const command = getPlaybackCommand(event)
      if (!command) return
      event.preventDefault()

      switch (command) {
        case 'toggle-playback':
          if (isComplete) restart()
          else setPlaying((current) => !current)
          break
        case 'previous-step':
          moveTo(stepIndex - 1)
          break
        case 'next-step':
          moveTo(stepIndex + 1)
          break
        case 'restart':
          restart()
          break
        case 'change-speed':
          cycleSpeed()
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [cycleSpeed, isComplete, moveTo, restart, stepIndex])

  return {
    stepIndex,
    playing,
    speedIndex,
    isComplete,
    moveTo,
    restart,
    togglePlayback,
    cycleSpeed,
  }
}
