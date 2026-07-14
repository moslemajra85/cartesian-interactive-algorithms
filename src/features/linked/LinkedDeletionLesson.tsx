import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { PlaybackControls } from '../learning/PlaybackControls'
import { PredictionCheckpoint } from '../learning/PredictionCheckpoint'
import { ProblemBrief } from '../learning/ProblemBrief'
import { useStepPlayback } from '../learning/useStepPlayback'
import type { LessonComponentProps } from '../sorting/SortLesson'
import { createLinkedDeletionSteps } from './linkedDeletion'
import { linkedDeletionLesson as definition } from './linkedDeletionLessonDefinition'
import { LinkedLessonNavigation } from './LinkedLessonNavigation'
import { LinkedListVisualizer } from './LinkedListVisualizer'

const values = [14, 31, 47, 62]

export function LinkedDeletionLesson({ lessons, onBack, onOpenLesson, onCompleteLesson }: LessonComponentProps) {
  const [targetIndex, setTargetIndex] = useState(2)
  const [draftTarget, setDraftTarget] = useState('2')
  const steps = useMemo(() => createLinkedDeletionSteps(values, targetIndex), [targetIndex])
  const playback = useStepPlayback(steps.length)
  const { stepIndex, playing, speedIndex, isComplete } = playback
  const step = steps[stepIndex]
  const targetId = `node-${targetIndex}`

  useEffect(() => { if (isComplete) onCompleteLesson(definition.slug) }, [isComplete, onCompleteLesson])

  const applyTarget = (event: FormEvent) => {
    event.preventDefault()
    playback.restart()
    setTargetIndex(Number(draftTarget))
  }

  const codeLines = ['target = predecessor.next', 'predecessor.next = target.next', 'release(target)', 'return head']
  const activeLine = Math.max(0, ['identify', 'bypass', 'release', 'complete'].indexOf(step.phase))

  return (
    <main className="lesson-page linked-lesson">
      <LinkedLessonNavigation currentSlug={definition.slug} title={definition.title} lessons={lessons} onBack={onBack} onOpenLesson={onOpenLesson} />
      <section className="lesson-heading">
        <div><p className="eyebrow"><span /> {definition.lessonLabel} · {definition.duration}</p><h1 data-route-heading tabIndex={-1}>{definition.title}</h1><p>{definition.tagline}</p></div>
        <div className="complexity-stamp" aria-label="Constant deletion time when predecessor is known"><small>KNOWN NODE</small><strong>O(1)</strong><span>ONE BYPASS</span></div>
      </section>
      <ProblemBrief definition={definition.problem} headingId={`${definition.slug}-problem`} />
      <section className="lesson-workspace linked-workspace">
        <div className="visualizer-panel">
          <form className="linked-experiment linked-delete-experiment" onSubmit={applyTarget}>
            <div><strong>Try a deletion</strong><span>Choose a non-head node to remove.</span></div>
            <label>Remove stop<select value={draftTarget} onChange={(event) => setDraftTarget(event.target.value)}>{values.slice(1).map((value, index) => <option value={index + 1} key={value}>{value}</option>)}</select></label>
            <button type="submit">Apply</button>
          </form>
          <LinkedListVisualizer nodes={step.nodes} headId={step.headId} activeIds={step.activeIds} emphasizedIds={[targetId]} />
          <div className="step-narration" aria-live="polite" key={`${targetIndex}-${stepIndex}`}><span>{String(stepIndex + 1).padStart(2, '0')}</span><div><strong>{step.title}</strong><p>{step.explanation}</p></div></div>
          <PlaybackControls stepIndex={stepIndex} stepCount={steps.length} playing={playing} speedIndex={speedIndex} isComplete={isComplete} onRestart={playback.restart} onMoveTo={playback.moveTo} onTogglePlayback={playback.togglePlayback} onCycleSpeed={playback.cycleSpeed} />
        </div>
        <aside className="code-panel linked-code"><div className="panel-label"><span>POINTER REWRITE</span><i>Bypass before release</i></div><ol>{codeLines.map((line, index) => <li className={activeLine === index ? 'is-active' : ''} key={line}><span>{index + 1}</span><code>{line}</code></li>)}</ol><div className="insight-note"><span>KEY INSIGHT</span><p>O(1) deletion assumes the predecessor is known. Finding a value or its predecessor from head is still O(n).</p></div></aside>
      </section>
      <section className="lesson-concept"><span className="concept-number">02</span><div><p className="eyebrow"><span /> WHY IT WORKS</p><h2>Reachability defines membership.</h2></div><p>A node belongs to the list only when following next references from head can reach it. Redirecting the predecessor preserves the remaining route and removes the target from that reachable chain.</p></section>
      <PredictionCheckpoint definition={definition.prediction} />
    </main>
  )
}
