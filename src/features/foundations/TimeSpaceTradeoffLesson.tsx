import { useEffect, useMemo } from 'react'
import { PlaybackControls } from '../learning/PlaybackControls'
import { PredictionCheckpoint } from '../learning/PredictionCheckpoint'
import { ProblemBrief } from '../learning/ProblemBrief'
import { useStepPlayback } from '../learning/useStepPlayback'
import type { LessonComponentProps } from '../sorting/SortLesson'
import { FoundationLessonNavigation } from './FoundationLessonNavigation'
import { InputSizeExperiment } from './InputSizeExperiment'
import { createLookupTradeoffSteps } from './timeSpaceTradeoff'
import { timeSpaceTradeoffLesson as definition } from './timeSpaceTradeoffLessonDefinition'

export function TimeSpaceTradeoffLesson({ lessons, onBack, onOpenLesson, onCompleteLesson }: LessonComponentProps) {
  const steps = useMemo(() => createLookupTradeoffSteps(), [])
  const playback = useStepPlayback(steps.length)
  const { stepIndex, playing, speedIndex, isComplete } = playback
  const step = steps[stepIndex]
  useEffect(() => { if (isComplete) onCompleteLesson(definition.slug) }, [isComplete, onCompleteLesson])

  return <main className="lesson-page foundation-lesson">
    <FoundationLessonNavigation currentSlug={definition.slug} title={definition.title} lessons={lessons} onBack={onBack} onOpenLesson={onOpenLesson} />
    <section className="lesson-heading"><div><p className="eyebrow"><span /> {definition.lessonLabel} · {definition.duration}</p><h1 data-route-heading tabIndex={-1}>{definition.title}</h1><p>{definition.tagline}</p></div><div className="complexity-stamp" aria-label="The best strategy depends on workload"><small>DECISION</small><strong className="is-long">TIME ↔ SPACE</strong><span>WORKLOAD FIRST</span></div></section>
    <ProblemBrief definition={definition.problem} headingId={`${definition.slug}-problem`} />
    <section className="growth-workspace tradeoff-workspace"><div className="growth-panel">
      <div className="panel-label"><span>TOTAL WORK · {step.queries} QUERIES</span><i>10 inventory records</i></div>
      <InputSizeExperiment value={step.queries} min={1} max={steps.length} onChange={(value) => playback.moveTo(value - 1)} label="Experiment with request volume" description="Increase repeated lookups and watch the preferred strategy change." singularUnit="query" pluralUnit="queries" />
      <div className="tradeoff-stage" aria-label={`Scan costs ${step.scanWork} work and ${step.scanExtraSpace} extra space. Index costs ${step.indexWork} work and ${step.indexExtraSpace} extra space. Recommended: ${step.recommendation}.`}>
        <article className={step.recommendation === 'scan' ? 'is-recommended' : ''}><span>NO INDEX</span><h3>Scan every request</h3><strong>{step.scanWork}<small>work units</small></strong><p>Extra memory: O(1) · {step.scanExtraSpace} cell</p></article>
        <b>VS</b>
        <article className={step.recommendation === 'index' ? 'is-recommended' : ''}><span>BUILD ONCE</span><h3>Reuse an index</h3><strong>{step.indexWork}<small>work units</small></strong><p>Extra memory: O(n) · {step.indexExtraSpace} cells</p></article>
      </div>
      <div className="step-narration" aria-live="polite" key={stepIndex}><span>{String(stepIndex + 1).padStart(2, '0')}</span><div><strong>{step.title}</strong><p>{step.explanation}</p></div></div>
      <PlaybackControls stepIndex={stepIndex} stepCount={steps.length} playing={playing} speedIndex={speedIndex} isComplete={isComplete} onRestart={playback.restart} onMoveTo={playback.moveTo} onTogglePlayback={playback.togglePlayback} onCycleSpeed={playback.cycleSpeed} timelineLabel={`${step.queries} of ${steps.length} queries`} />
    </div><aside className="growth-guide tradeoff-guide"><div className="panel-label"><span>DECISION FRAME</span><i>Total cost</i></div><ol><li><code>LOAD</code><div><strong>Count setup</strong><p>An index must be built before it helps.</p></div></li><li><code>REUSE</code><div><strong>Count repetitions</strong><p>Per-request savings compound with traffic.</p></div></li><li><code>MEM</code><div><strong>Respect capacity</strong><p>Faster lookup consumes persistent space.</p></div></li></ol><div className="insight-note"><span>KEY INSIGHT</span><p>Complexity informs a decision; workload and constraints choose the winner.</p></div></aside></section>
    <section className="lesson-concept"><span className="concept-number">06</span><div><p className="eyebrow"><span /> SYNTHESIS</p><h2>Optimize the workload, not an isolated operation.</h2></div><p>A one-time cost can be wasteful for a single request and valuable when reused. Production decisions combine growth rates with traffic, memory limits, latency goals, and lifecycle.</p></section>
    <PredictionCheckpoint definition={definition.prediction} />
  </main>
}
