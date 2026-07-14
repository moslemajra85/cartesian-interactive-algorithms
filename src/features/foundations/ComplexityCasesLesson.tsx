import { useEffect, useMemo } from 'react'
import { PlaybackControls } from '../learning/PlaybackControls'
import { PredictionCheckpoint } from '../learning/PredictionCheckpoint'
import { useStepPlayback } from '../learning/useStepPlayback'
import type { LessonComponentProps } from '../sorting/SortLesson'
import { createComplexityCaseSteps } from './complexityCases'
import { complexityCasesLesson as definition } from './complexityCasesLessonDefinition'
import { FoundationLessonNavigation } from './FoundationLessonNavigation'

const cases = [
  { id: 'best', label: 'Best case', detail: 'Target is first', notation: 'Ω(1)' },
  { id: 'average', label: 'Average case', detail: 'Target position is uniformly likely', notation: 'Θ(n)' },
  { id: 'worst', label: 'Worst case', detail: 'Target is last or missing', notation: 'O(n)' },
] as const

function formatCount(count: number) {
  return Number.isInteger(count) ? String(count) : count.toFixed(1)
}

export function ComplexityCasesLesson({ lessons, onBack, onOpenLesson, onCompleteLesson }: LessonComponentProps) {
  const steps = useMemo(() => createComplexityCaseSteps(), [])
  const playback = useStepPlayback(steps.length)
  const { stepIndex, playing, speedIndex, isComplete } = playback
  const step = steps[stepIndex]

  useEffect(() => {
    if (isComplete) onCompleteLesson(definition.slug)
  }, [isComplete, onCompleteLesson])

  return (
    <main className="lesson-page foundation-lesson">
      <FoundationLessonNavigation
        currentSlug={definition.slug} title={definition.title} lessons={lessons} onBack={onBack} onOpenLesson={onOpenLesson}
      />

      <section className="lesson-heading">
        <div>
          <p className="eyebrow"><span /> {definition.lessonLabel} · {definition.duration}</p>
          <h1 data-route-heading tabIndex={-1}>{definition.title}</h1>
          <p>{definition.tagline}</p>
        </div>
        <div className="complexity-stamp" aria-label="Worst-case linear time and constant space">
          <small>WORST CASE</small><strong>O(n)</strong><span>NOT EVERY RUN</span>
        </div>
      </section>

      <section className="growth-workspace case-workspace">
        <div className="growth-panel">
          <div className="panel-label"><span>LINEAR SEARCH · n = {step.inputSize}</span><i>Comparison count</i></div>
          <div
            className="growth-bars case-bars"
            aria-label={`At input ${step.inputSize}: best case ${step.best}, average case ${formatCount(step.average)}, worst case ${step.worst} comparisons`}
          >
            {cases.map((caseDefinition) => {
              const count = step[caseDefinition.id]
              return (
                <div className={`growth-row case-${caseDefinition.id}`} key={caseDefinition.id}>
                  <div><strong>{caseDefinition.label}</strong><code>{caseDefinition.notation}</code></div>
                  <div className="growth-track" aria-hidden="true"><span style={{ width: `${(count / step.worst) * 100}%` }} /></div>
                  <b>{formatCount(count)}</b>
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

        <aside className="growth-guide case-guide">
          <div className="panel-label"><span>THREE QUESTIONS</span><i>One algorithm</i></div>
          <ol>
            {cases.map((caseDefinition) => (
              <li key={caseDefinition.id}><code>{caseDefinition.notation}</code><div><strong>{caseDefinition.label}</strong><p>{caseDefinition.detail}</p></div></li>
            ))}
          </ol>
          <div className="insight-note"><span>KEY INSIGHT</span><p>Worst case is a ceiling, not a prediction. It tells you the most work the algorithm may require for an input of size n.</p></div>
        </aside>
      </section>

      <section className="lesson-concept">
        <span className="concept-number">04</span>
        <div><p className="eyebrow"><span /> THE GUARANTEE</p><h2>A bound describes growth, not destiny.</h2></div>
        <p>One execution can be lucky. Production engineering still needs a ceiling for latency and capacity planning. Worst-case analysis provides that guarantee while average-case analysis describes expected work under explicit assumptions.</p>
      </section>

      <PredictionCheckpoint definition={definition.prediction} />
    </main>
  )
}
