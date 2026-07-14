import { useEffect, useMemo } from 'react'
import { PredictionCheckpoint } from '../learning/PredictionCheckpoint'
import { PlaybackControls } from '../learning/PlaybackControls'
import { useStepPlayback } from '../learning/useStepPlayback'
import type { LessonComponentProps } from '../sorting/SortLesson'
import { createComplexityGrowthSteps, type GrowthRateId } from './complexityGrowth'
import { complexityGrowthLesson as definition } from './complexityGrowthLessonDefinition'

const growthRates: readonly { id: GrowthRateId; label: string; notation: string; detail: string }[] = [
  { id: 'constant', label: 'Constant', notation: 'O(1)', detail: 'One action regardless of input size' },
  { id: 'logarithmic', label: 'Logarithmic', notation: 'O(log n)', detail: 'Discard a fixed fraction each time' },
  { id: 'linear', label: 'Linear', notation: 'O(n)', detail: 'Visit every input once' },
  { id: 'quadratic', label: 'Quadratic', notation: 'O(n²)', detail: 'Compare every input with every input' },
]

export function ComplexityGrowthLesson({ lessons, onBack, onOpenLesson, onCompleteLesson }: LessonComponentProps) {
  const steps = useMemo(() => createComplexityGrowthSteps(), [])
  const playback = useStepPlayback(steps.length)
  const { stepIndex, playing, speedIndex, isComplete } = playback
  const step = steps[stepIndex]
  const largestCount = step.operations.quadratic

  useEffect(() => {
    if (isComplete) onCompleteLesson(definition.slug)
  }, [isComplete, onCompleteLesson])

  return (
    <main className="lesson-page foundation-lesson">
      <div className="lesson-crumbs">
        <button type="button" onClick={onBack}>← Lesson catalogue</button>
        <span>/</span><span>The Foundations</span><span>/</span><strong>{definition.title}</strong>
      </div>

      <nav className="lesson-switcher" aria-label="Foundation lessons">
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
        <div className="complexity-stamp" aria-label="Comparing growth from constant through quadratic">
          <small>COMPARE</small><strong className="is-long">O(1)…O(n²)</strong><span>INPUT → WORK</span>
        </div>
      </section>

      <section className="growth-workspace">
        <div className="growth-panel">
          <div className="panel-label"><span>WORK UNITS AT INPUT n = {step.inputSize}</span><i>Relative scale</i></div>
          <div className="growth-bars" aria-label={`Operation counts for input size ${step.inputSize}`}>
            {growthRates.map((rate) => {
              const count = step.operations[rate.id]
              const width = Math.max((count / largestCount) * 100, 3)
              return (
                <div className={`growth-row rate-${rate.id}`} key={rate.id}>
                  <div><strong>{rate.label}</strong><code>{rate.notation}</code></div>
                  <div className="growth-track"><span style={{ width: `${width}%` }} /></div>
                  <b>{count}</b>
                </div>
              )
            })}
          </div>

          <div className="step-narration" aria-live="polite" key={stepIndex}>
            <span>{String(stepIndex + 1).padStart(2, '0')}</span>
            <div><strong>{step.title}</strong><p>{step.explanation}</p></div>
          </div>

          <PlaybackControls
            stepIndex={stepIndex} stepCount={steps.length} playing={playing} speedIndex={speedIndex} isComplete={isComplete}
            onRestart={playback.restart} onMoveTo={playback.moveTo} onTogglePlayback={playback.togglePlayback} onCycleSpeed={playback.cycleSpeed}
            timelineLabel={`Input ${step.inputSize} of ${steps.length}`}
          />
        </div>

        <aside className="growth-guide">
          <div className="panel-label"><span>HOW TO READ IT</span><i>Growth, not seconds</i></div>
          <ol>
            {growthRates.map((rate) => (
              <li key={rate.id}><code>{rate.notation}</code><div><strong>{rate.label}</strong><p>{rate.detail}</p></div></li>
            ))}
          </ol>
          <div className="insight-note"><span>KEY INSIGHT</span><p>Big O ignores machine speed and small fixed costs. It asks which term controls the work as the input becomes large.</p></div>
        </aside>
      </section>

      <section className="lesson-concept">
        <span className="concept-number">01</span>
        <div><p className="eyebrow"><span /> WHY IT MATTERS</p><h2>Scale changes which solution is practical.</h2></div>
        <p>For ten items, many approaches feel fast. For ten million, a strategy that doubles its work behaves very differently from one that quadruples it. Growth rates let us reason about that future before production traffic discovers it for us.</p>
      </section>

      <PredictionCheckpoint definition={definition.prediction} />
    </main>
  )
}
