import { useEffect, useMemo } from 'react'
import { PlaybackControls } from '../learning/PlaybackControls'
import { PredictionCheckpoint } from '../learning/PredictionCheckpoint'
import { useStepPlayback } from '../learning/useStepPlayback'
import type { LessonComponentProps } from '../sorting/SortLesson'
import { createOperationCountingSteps } from './countingOperations'
import { countingOperationsLesson as definition } from './countingOperationsLessonDefinition'
import { FoundationLessonNavigation } from './FoundationLessonNavigation'

export function CountingOperationsLesson({ lessons, onBack, onOpenLesson, onCompleteLesson }: LessonComponentProps) {
  const steps = useMemo(() => createOperationCountingSteps(), [])
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
        <div className="complexity-stamp" aria-label="Linear time and constant space">
          <small>TIME</small><strong>O(n)</strong><span>SPACE O(1)</span>
        </div>
      </section>

      <section className="growth-workspace operation-workspace">
        <div className="growth-panel">
          <div className="panel-label"><span>EXACT WORK · n = {step.inputSize}</span><i>2n + 3 operations</i></div>
          <div className="operation-stage">
            <div className="operation-total" aria-label={`${step.total} total operations: ${step.setup} setup, ${step.firstPass} first pass, ${step.secondPass} second pass`}>
              <div><span>Exact count</span><strong>{step.total}</strong><code>2({step.inputSize}) + 3</code></div>
              <div className="operation-stack" aria-hidden="true">
                <span className="segment-setup" style={{ flex: step.setup }}>SETUP · {step.setup}</span>
                <span className="segment-first" style={{ flex: step.firstPass }}>PASS A · {step.firstPass}</span>
                <span className="segment-second" style={{ flex: step.secondPass }}>PASS B · {step.secondPass}</span>
              </div>
            </div>
            <div className="operation-conclusion">
              <span>3</span><i>+</i><span>n</span><i>+</i><span>n</span><i>=</i><strong>2n + 3</strong><b>→</b><em>O(n)</em>
            </div>
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

        <aside className="growth-guide operation-code">
          <div className="panel-label"><span>COUNT THE CODE</span><i>Sequential work adds</i></div>
          <ol>
            <li><code>3</code><div><strong>setup()</strong><p>Three fixed operations, independent of n.</p></div></li>
            <li><code>n</code><div><strong>for value in values</strong><p>The first loop visits each input once.</p></div></li>
            <li><code>n</code><div><strong>for value in values</strong><p>The second loop also visits each input once.</p></div></li>
          </ol>
          <div className="insight-note"><span>KEY INSIGHT</span><p>Keep exact counts while reasoning. Simplify only when naming the growth class: 2n + 3 becomes O(n) because n is the term that grows.</p></div>
        </aside>
      </section>

      <section className="lesson-concept">
        <span className="concept-number">02</span>
        <div><p className="eyebrow"><span /> THE REASONING RULE</p><h2>Sequential work adds. Nested work multiplies.</h2></div>
        <p>Two full passes cost n + n. One full pass inside another costs n × n. That structural distinction matters more than the programming language or loop syntax.</p>
      </section>

      <PredictionCheckpoint definition={definition.prediction} />
    </main>
  )
}
