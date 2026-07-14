import { useEffect, useMemo, useState } from 'react'
import { PredictionCheckpoint, type PredictionCheckpointDefinition } from '../learning/PredictionCheckpoint'
import { PlaybackControls } from '../learning/PlaybackControls'
import { useStepPlayback } from '../learning/useStepPlayback'
import { ArrayInputControls } from './ArrayInputControls'
import { ArrayVisualizer, type ArrayVisualizationMode } from './ArrayVisualizer'
import type { SortStep } from './sortStep'

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
  prediction: PredictionCheckpointDefinition
  visualMode?: ArrayVisualizationMode
}

export type LessonLink = {
  slug: string
  label: string
  completed?: boolean
}

export type LessonComponentProps = {
  lessons: LessonLink[]
  onBack: () => void
  onOpenLesson: (slug: string) => void
  onCompleteLesson: (slug: string) => void
}

type SortLessonProps = LessonComponentProps & {
  definition: SortLessonDefinition
}

function randomValues(length: number) {
  return Array.from({ length }, () => Math.floor(Math.random() * 9) + 1)
}

export function SortLesson({ definition, lessons, onBack, onOpenLesson, onCompleteLesson }: SortLessonProps) {
  const [values, setValues] = useState(definition.initialValues)
  const steps = useMemo(() => definition.createSteps(values), [definition, values])
  const playback = useStepPlayback(steps.length)
  const { stepIndex, playing, speedIndex, isComplete } = playback
  const step = steps[stepIndex]

  const shuffle = () => {
    playback.restart()
    setValues(randomValues(values.length))
  }

  const applyValues = (nextValues: number[]) => {
    playback.restart()
    setValues(nextValues)
  }

  useEffect(() => {
    if (isComplete) onCompleteLesson(definition.slug)
  }, [definition.slug, isComplete, onCompleteLesson])

  return (
    <main className="lesson-page">
      <div className="lesson-crumbs">
        <button type="button" onClick={onBack}>← Learning path</button>
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
          <small>TIME</small><strong className={definition.timeComplexity.length > 6 ? 'is-long' : undefined}>{definition.timeComplexity}</strong><span>SPACE {definition.spaceComplexity}</span>
        </div>
      </section>

      <section className="lesson-workspace">
        <div className="visualizer-panel">
          <ArrayInputControls values={values} onApply={applyValues} onShuffle={shuffle} />
          <ArrayVisualizer step={step} playing={playing} mode={definition.visualMode} />

          <div className="step-narration" aria-live="polite" key={`${definition.slug}-${stepIndex}`}>
            <span>{String(stepIndex).padStart(2, '0')}</span>
            <div><strong>{step.title}</strong><p>{step.explanation}</p></div>
          </div>

          <PlaybackControls
            stepIndex={stepIndex} stepCount={steps.length} playing={playing} speedIndex={speedIndex} isComplete={isComplete}
            onRestart={playback.restart} onMoveTo={playback.moveTo} onTogglePlayback={playback.togglePlayback} onCycleSpeed={playback.cycleSpeed}
          />
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

      <PredictionCheckpoint definition={definition.prediction} />
    </main>
  )
}
