import { useEffect, useMemo } from 'react'
import { PlaybackControls } from '../learning/PlaybackControls'
import { PredictionCheckpoint } from '../learning/PredictionCheckpoint'
import { ProblemBrief } from '../learning/ProblemBrief'
import { useStepPlayback } from '../learning/useStepPlayback'
import type { LessonComponentProps } from '../sorting/SortLesson'
import { FoundationLessonNavigation } from './FoundationLessonNavigation'
import { InputSizeExperiment } from './InputSizeExperiment'
import { createSpaceComplexitySteps } from './spaceComplexity'
import { spaceComplexityLesson as definition } from './spaceComplexityLessonDefinition'

function MemoryCells({ count, tone }: { count: number; tone: 'input' | 'constant' | 'linear' }) {
  return (
    <div className={`memory-cells tone-${tone}`} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => <i key={index}>{index}</i>)}
    </div>
  )
}

export function SpaceComplexityLesson({ lessons, onBack, onOpenLesson, onCompleteLesson }: LessonComponentProps) {
  const steps = useMemo(() => createSpaceComplexitySteps(), [])
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
        <div className="complexity-stamp" aria-label="Comparing constant and linear auxiliary space">
          <small>EXTRA SPACE</small><strong className="is-long">O(1)…O(n)</strong><span>INPUT EXCLUDED</span>
        </div>
      </section>

      <ProblemBrief definition={definition.problem} headingId={`${definition.slug}-problem`} />

      <section className="growth-workspace space-workspace">
        <div className="growth-panel">
          <div className="panel-label"><span>MEMORY CELLS · n = {step.inputSize}</span><i>Auxiliary space comparison</i></div>
          <InputSizeExperiment value={step.inputSize} min={1} max={steps.length} onChange={(value) => playback.moveTo(value - 1)} />
          <div
            className="memory-stage"
            aria-label={`Input uses ${step.inputCells} cells. In-place workspace uses ${step.inPlaceExtraCells} extra cell. Copying workspace uses ${step.copiedExtraCells} extra cells.`}
          >
            <div className="memory-row input-memory">
              <div><strong>Given input</strong><code>not counted</code></div>
              <MemoryCells count={step.inputCells} tone="input" />
              <b>{step.inputCells}</b>
            </div>
            <div className="memory-divider"><span>AUXILIARY MEMORY</span></div>
            <div className="memory-row">
              <div><strong>In-place</strong><code>O(1)</code></div>
              <MemoryCells count={step.inPlaceExtraCells} tone="constant" />
              <b>1</b>
            </div>
            <div className="memory-row">
              <div><strong>Input copy</strong><code>O(n)</code></div>
              <MemoryCells count={step.copiedExtraCells} tone="linear" />
              <b>{step.copiedExtraCells}</b>
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

        <aside className="growth-guide space-guide">
          <div className="panel-label"><span>WHAT COUNTS?</span><i>Extra working memory</i></div>
          <ol>
            <li><code>INPUT</code><div><strong>Memory already provided</strong><p>Normally excluded when reporting auxiliary space.</p></div></li>
            <li><code>O(1)</code><div><strong>Fixed workspace</strong><p>A few counters or temporary values, regardless of n.</p></div></li>
            <li><code>O(n)</code><div><strong>Growing workspace</strong><p>A copy, buffer, or result with one cell per input value.</p></div></li>
          </ol>
          <div className="insight-note"><span>KEY INSIGHT</span><p>“In place” does not mean zero memory. It means the extra workspace stays bounded as the input grows.</p></div>
        </aside>
      </section>

      <section className="lesson-concept">
        <span className="concept-number">03</span>
        <div><p className="eyebrow"><span /> THE BOUNDARY</p><h2>Count what the algorithm allocates.</h2></div>
        <p>The caller already owns the input. Auxiliary space measures the additional workspace required to process it. This boundary makes comparisons fair and exposes memory costs hidden behind convenient copies.</p>
      </section>

      <PredictionCheckpoint definition={definition.prediction} />
    </main>
  )
}
