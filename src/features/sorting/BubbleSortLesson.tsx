import { useEffect, useMemo, useState } from 'react'
import { createBubbleSortSteps } from './bubbleSort'

const INITIAL_VALUES = [7, 3, 9, 2, 6, 4]
const SPEEDS = [1200, 750, 380]

const codeLines = [
  'bubbleSort(values)',
  '  for end from last index down to 1',
  '    for left from 0 up to end - 1',
  '      if values[left] > values[left + 1]',
  '        swap(values[left], values[left + 1])',
  '    mark values[end] as sorted',
  '  return values',
]

type BubbleSortLessonProps = {
  onBack: () => void
}

function randomValues() {
  return Array.from({ length: 6 }, () => Math.floor(Math.random() * 9) + 1)
}

export function BubbleSortLesson({ onBack }: BubbleSortLessonProps) {
  const [values, setValues] = useState(INITIAL_VALUES)
  const [stepIndex, setStepIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speedIndex, setSpeedIndex] = useState(1)
  const steps = useMemo(() => createBubbleSortSteps(values), [values])
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
    setValues(randomValues())
  }

  return (
    <main className="lesson-page">
      <div className="lesson-crumbs">
        <button type="button" onClick={onBack}>← Learning path</button>
        <span>/</span><span>Arrays & Sorting</span><span>/</span><strong>Bubble Sort</strong>
      </div>

      <section className="lesson-heading">
        <div>
          <p className="eyebrow"><span /> LESSON 02.03 · 8 MIN</p>
          <h1>Bubble Sort</h1>
          <p>Compare neighbors. Swap disorder. Repeat until every value finds its place.</p>
        </div>
        <div className="complexity-stamp" aria-label="Bubble Sort time complexity">
          <small>TIME</small><strong>O(n²)</strong><span>SPACE O(1)</span>
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
              <span><i className="legend-compare" /> Comparing</span>
              <span><i className="legend-swap" /> Swapped</span>
              <span><i className="legend-sorted" /> Sorted</span>
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
        </div>

        <aside className="code-panel">
          <div className="panel-label"><span>PSEUDOCODE</span><i>Read with the animation</i></div>
          <ol>
            {codeLines.map((line, index) => (
              <li className={step.line === index ? 'is-active' : ''} key={line}><span>{index + 1}</span><code>{line}</code></li>
            ))}
          </ol>
          <div className="insight-note"><span>KEY INSIGHT</span><p>After every pass, at least one value reaches its final position. That shrinks the unsorted region from the right.</p></div>
        </aside>
      </section>

      <section className="lesson-concept">
        <span className="concept-number">01</span>
        <div><p className="eyebrow"><span /> WHY IT WORKS</p><h2>The largest value has nowhere to hide.</h2></div>
        <p>Every comparison pushes the larger neighbor one position to the right. A complete pass therefore carries the largest unsorted value all the way to the boundary.</p>
      </section>
    </main>
  )
}
