import { useEffect, useMemo, useState } from 'react'
import { getPlaybackCommand } from './playbackShortcuts'
import type { SortStep } from './sortStep'

const SPEEDS = [1200, 750, 380]

export type SortLessonDefinition = {
  slug: string
  title: string
  lessonLabel: string
  duration: string
  tagline: string
  timeComplexity: string
  spaceComplexity: string
  initialValues: number[]
  createSteps: (values: number[]) => SortStep[]
  codeLines: string[]
  insight: string
  conceptTitle: string
  conceptExplanation: string
}

export type LessonLink = {
  slug: string
  label: string
}

type SortLessonProps = {
  definition: SortLessonDefinition
  lessons: LessonLink[]
  onBack: () => void
  onOpenLesson: (slug: string) => void
}

function randomValues(length: number) {
  return Array.from({ length }, () => Math.floor(Math.random() * 9) + 1)
}

export function SortLesson({ definition, lessons, onBack, onOpenLesson }: SortLessonProps) {
  const [values, setValues] = useState(definition.initialValues)
  const [stepIndex, setStepIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speedIndex, setSpeedIndex] = useState(1)
  const steps = useMemo(() => definition.createSteps(values), [definition, values])
  const step = steps[stepIndex]
  const isComplete = stepIndex === steps.length - 1
  const maxValue = Math.max(...step.values, 1)

  useEffect(() => {
    if (!playing) return
    if (isComplete) {
      setPlaying(false)
      return
    }

    const timeout = window.setTimeout(() => {
      setStepIndex((current) => Math.min(current + 1, steps.length - 1))
    }, SPEEDS[speedIndex])

    return () => window.clearTimeout(timeout)
  }, [isComplete, playing, speedIndex, stepIndex, steps.length])

  const moveTo = (nextStep: number) => {
    setPlaying(false)
    setStepIndex(Math.max(0, Math.min(nextStep, steps.length - 1)))
  }

  const restart = () => {
    setPlaying(false)
    setStepIndex(0)
  }

  const shuffle = () => {
    setPlaying(false)
    setStepIndex(0)
    setValues(randomValues(definition.initialValues.length))
  }

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
          if (isComplete) {
            setPlaying(false)
            setStepIndex(0)
          } else {
            setPlaying((current) => !current)
          }
          break
        case 'previous-step':
          setPlaying(false)
          setStepIndex((current) => Math.max(0, current - 1))
          break
        case 'next-step':
          setPlaying(false)
          setStepIndex((current) => Math.min(steps.length - 1, current + 1))
          break
        case 'restart':
          setPlaying(false)
          setStepIndex(0)
          break
        case 'change-speed':
          setSpeedIndex((current) => (current + 1) % SPEEDS.length)
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isComplete, steps.length])

  return (
    <main className="lesson-page">
      <div className="lesson-crumbs">
        <button type="button" onClick={onBack}>← Learning path</button>
        <span>/</span><span>Arrays & Sorting</span><span>/</span><strong>{definition.title}</strong>
      </div>

      <nav className="lesson-switcher" aria-label="Sorting lessons">
        {lessons.map((lesson) => (
          <button
            className={lesson.slug === definition.slug ? 'is-current' : ''}
            type="button"
            onClick={() => onOpenLesson(lesson.slug)}
            aria-current={lesson.slug === definition.slug ? 'page' : undefined}
            key={lesson.slug}
          >
            {lesson.label}
          </button>
        ))}
      </nav>

      <section className="lesson-heading">
        <div>
          <p className="eyebrow"><span /> {definition.lessonLabel} · {definition.duration}</p>
          <h1>{definition.title}</h1>
          <p>{definition.tagline}</p>
        </div>
        <div className="complexity-stamp" aria-label={`${definition.title} time complexity`}>
          <small>TIME</small><strong>{definition.timeComplexity}</strong><span>SPACE {definition.spaceComplexity}</span>
        </div>
      </section>

      <section className="lesson-workspace">
        <div className="visualizer-panel">
          <div className="panel-label"><span>LIVE VISUALIZATION</span><button type="button" onClick={shuffle}>Shuffle values</button></div>
          <div className="sort-stage">
            <div className="pass-indicator">{step.pass ? `PASS ${step.pass}` : 'READY'}</div>
            <div className="sort-bars" aria-label={`Current array: ${step.values.join(', ')}`}>
              {step.values.map((value, index) => {
                const compared = step.compared?.includes(index)
                const swapped = step.swapped?.includes(index)
                const sorted = step.sortedIndices.includes(index)
                const classNames = ['sort-bar', compared && 'is-compared', swapped && 'is-swapped', sorted && 'is-sorted'].filter(Boolean).join(' ')

                return (
                  <div className="bar-slot" key={index}>
                    <div className={classNames} style={{ height: `${30 + (value / maxValue) * 68}%` }}><strong>{value}</strong></div>
                    <span>{index}</span>
                  </div>
                )
              })}
            </div>
            <div className="visual-legend">
              <span><i className="legend-compare" /> Inspecting</span>
              <span><i className="legend-swap" /> Swapped</span>
              <span><i className="legend-sorted" /> Ordered</span>
            </div>
          </div>

          <div className="step-narration" aria-live="polite">
            <span>{String(stepIndex).padStart(2, '0')}</span>
            <div><strong>{step.title}</strong><p>{step.explanation}</p></div>
          </div>

          <div className="player-controls">
            <button className="control-button" type="button" onClick={restart} aria-label="Restart">↺</button>
            <button className="control-button" type="button" onClick={() => moveTo(stepIndex - 1)} disabled={stepIndex === 0} aria-label="Previous step">←</button>
            <button className="play-button" type="button" onClick={() => isComplete ? restart() : setPlaying((current) => !current)}>
              <span aria-hidden="true">{isComplete ? '↺' : playing ? 'Ⅱ' : '▶'}</span>
              {isComplete ? 'Replay' : playing ? 'Pause' : 'Play'}
            </button>
            <button className="control-button" type="button" onClick={() => moveTo(stepIndex + 1)} disabled={isComplete} aria-label="Next step">→</button>
            <button className="speed-button" type="button" onClick={() => setSpeedIndex((current) => (current + 1) % SPEEDS.length)}>{speedIndex + 1}× speed</button>
          </div>
          <div className="timeline" aria-label={`Step ${stepIndex + 1} of ${steps.length}`}><span style={{ width: `${(stepIndex / (steps.length - 1)) * 100}%` }} /></div>
          <div className="shortcut-strip" aria-label="Keyboard shortcuts">
            <span><kbd>Space</kbd> Play / pause</span>
            <span><kbd>←</kbd><kbd>→</kbd> Step</span>
            <span><kbd>R</kbd> Restart</span>
            <span><kbd>S</kbd> Speed</span>
          </div>
        </div>

        <aside className="code-panel">
          <div className="panel-label"><span>PSEUDOCODE</span><i>Read with the animation</i></div>
          <ol>
            {definition.codeLines.map((line, index) => (
              <li className={step.line === index ? 'is-active' : ''} key={line}><span>{index + 1}</span><code>{line}</code></li>
            ))}
          </ol>
          <div className="insight-note"><span>KEY INSIGHT</span><p>{definition.insight}</p></div>
        </aside>
      </section>

      <section className="lesson-concept">
        <span className="concept-number">01</span>
        <div><p className="eyebrow"><span /> WHY IT WORKS</p><h2>{definition.conceptTitle}</h2></div>
        <p>{definition.conceptExplanation}</p>
      </section>
    </main>
  )
}
