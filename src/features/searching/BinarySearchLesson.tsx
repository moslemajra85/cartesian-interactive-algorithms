import { useEffect, useMemo, useState } from 'react'
import { PredictionCheckpoint } from '../learning/PredictionCheckpoint'
import { useStepPlayback } from '../learning/useStepPlayback'
import { ArrayVisualizer } from '../sorting/ArrayVisualizer'
import type { LessonComponentProps } from '../sorting/SortLesson'
import { createBinarySearchSteps } from './binarySearch'
import { binarySearchLesson as definition } from './binarySearchLessonDefinition'
import { SearchInputControls } from './SearchInputControls'

function randomSearchExample(length: number) {
  const values = Array.from({ length }, () => Math.floor(Math.random() * 40) + 1)
    .sort((left, right) => left - right)
  return { values, target: values[Math.floor(Math.random() * values.length)] }
}

export function BinarySearchLesson({ lessons, onBack, onOpenLesson, onCompleteLesson }: LessonComponentProps) {
  const [values, setValues] = useState<number[]>([...definition.initialValues])
  const [target, setTarget] = useState<number>(definition.initialTarget)
  const steps = useMemo(() => createBinarySearchSteps(values, target), [target, values])
  const playback = useStepPlayback(steps.length)
  const { stepIndex, playing, speedIndex, isComplete } = playback
  const step = steps[stepIndex]

  useEffect(() => {
    if (isComplete) onCompleteLesson(definition.slug)
  }, [isComplete, onCompleteLesson])

  const applySearch = (nextValues: number[], nextTarget: number) => {
    playback.restart()
    setValues(nextValues)
    setTarget(nextTarget)
  }

  const newExample = () => {
    const example = randomSearchExample(values.length)
    applySearch(example.values, example.target)
  }

  return (
    <main className="lesson-page">
      <div className="lesson-crumbs">
        <button type="button" onClick={onBack}>← Lesson catalogue</button>
        <span>/</span><span>Arrays & Sorting</span><span>/</span><strong>{definition.title}</strong>
      </div>

      <nav className="lesson-switcher" aria-label="Array lessons">
        {lessons.map((lesson) => (
          <button
            className={`${lesson.slug === definition.slug ? 'is-current' : ''} ${lesson.completed ? 'is-complete' : ''}`.trim()}
            type="button"
            onClick={() => onOpenLesson(lesson.slug)}
            aria-current={lesson.slug === definition.slug ? 'page' : undefined}
            aria-label={`${lesson.label}${lesson.completed ? ', completed' : ''}`}
            key={lesson.slug}
          >
            {lesson.label}
            {lesson.completed && <span className="lesson-check" aria-hidden="true">✓</span>}
          </button>
        ))}
      </nav>

      <section className="lesson-heading">
        <div>
          <p className="eyebrow"><span /> {definition.lessonLabel} · {definition.duration}</p>
          <h1 data-route-heading tabIndex={-1}>{definition.title}</h1>
          <p>{definition.tagline}</p>
        </div>
        <div className="complexity-stamp" aria-label={`${definition.title} time complexity`}>
          <small>TIME</small><strong className="is-long">{definition.timeComplexity}</strong><span>SPACE {definition.spaceComplexity}</span>
        </div>
      </section>

      <section className="lesson-workspace">
        <div className="visualizer-panel">
          <SearchInputControls values={values} target={target} onApply={applySearch} onNewExample={newExample} />
          <ArrayVisualizer step={step} playing={playing} mode="search" />

          <div className="step-narration" aria-live="polite" key={`${definition.slug}-${stepIndex}`}>
            <span>{String(stepIndex).padStart(2, '0')}</span>
            <div><strong>{step.title}</strong><p>{step.explanation}</p></div>
          </div>

          <div className="player-controls">
            <button className="control-button" type="button" onClick={playback.restart} aria-label="Restart">↺</button>
            <button className="control-button" type="button" onClick={() => playback.moveTo(stepIndex - 1)} disabled={stepIndex === 0} aria-label="Previous step">←</button>
            <button className={`play-button ${playing ? 'is-playing' : ''}`} type="button" onClick={playback.togglePlayback}>
              <span aria-hidden="true">{isComplete ? '↺' : playing ? 'Ⅱ' : '▶'}</span>
              {isComplete ? 'Replay' : playing ? 'Pause' : 'Play'}
            </button>
            <button className="control-button" type="button" onClick={() => playback.moveTo(stepIndex + 1)} disabled={isComplete} aria-label="Next step">→</button>
            <button className="speed-button" type="button" onClick={playback.cycleSpeed}>{speedIndex + 1}× speed</button>
          </div>
          <div className="timeline" aria-label={`Step ${stepIndex + 1} of ${steps.length}`}><span style={{ width: `${(stepIndex / (steps.length - 1)) * 100}%` }} /></div>
          <div className="shortcut-strip" aria-label="Keyboard shortcuts">
            <span><kbd>Space</kbd> Play / pause</span><span><kbd>←</kbd><kbd>→</kbd> Step</span>
            <span><kbd>R</kbd> Restart</span><span><kbd>S</kbd> Speed</span>
          </div>
        </div>

        <aside className="code-panel">
          <div className="panel-label"><span>PSEUDOCODE</span><i>Watch the interval shrink</i></div>
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

      <PredictionCheckpoint definition={definition.prediction} />
    </main>
  )
}
