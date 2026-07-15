import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { PlaybackControls } from '../learning/PlaybackControls'
import { PredictionCheckpoint } from '../learning/PredictionCheckpoint'
import { ProblemBrief } from '../learning/ProblemBrief'
import { useStepPlayback } from '../learning/useStepPlayback'
import type { LessonComponentProps } from '../sorting/SortLesson'
import { LinkedLessonNavigation } from './LinkedLessonNavigation'
import { LinkedListVisualizer } from './LinkedListVisualizer'
import { createLinkedTraversalSteps } from './linkedTraversal'
import { linkedTraversalLesson as definition } from './linkedTraversalLessonDefinition'

const values = [14, 31, 47, 62]

export function LinkedTraversalLesson({ lessons, onBack, onOpenLesson, onCompleteLesson }: LessonComponentProps) {
  const [target, setTarget] = useState(47)
  const [draftTarget, setDraftTarget] = useState('47')
  const [error, setError] = useState<string | null>(null)
  const steps = useMemo(() => createLinkedTraversalSteps(values, target), [target])
  const playback = useStepPlayback(steps.length)
  const { stepIndex, playing, speedIndex, isComplete } = playback
  const step = steps[stepIndex]
  const currentNode = step.nodes.find((node) => node.id === step.currentId)

  useEffect(() => { if (isComplete) onCompleteLesson(definition.slug) }, [isComplete, onCompleteLesson])

  const applyTargetValue = (nextTarget: number) => {
    playback.restart()
    setError(null)
    setDraftTarget(String(nextTarget))
    setTarget(nextTarget)
  }

  const applyTarget = (event: FormEvent) => {
    event.preventDefault()
    const nextTarget = Number(draftTarget)
    if (!Number.isInteger(nextTarget) || nextTarget < 1 || nextTarget > 99) { setError('Use a whole-number stop code from 1 to 99.'); return }
    applyTargetValue(nextTarget)
  }

  const codeLines = ['current = head', 'while current != null', '  if current.value == target: return current', '  current = current.next', 'return not found']
  const activeLine = step.phase === 'ready' ? 0 : step.phase === 'inspect' ? 2 : step.phase === 'advance' ? 3 : step.phase === 'found' ? 2 : 4

  return (
    <main className="lesson-page linked-lesson">
      <LinkedLessonNavigation currentSlug={definition.slug} title={definition.title} lessons={lessons} onBack={onBack} onOpenLesson={onOpenLesson} />
      <section className="lesson-heading"><div><p className="eyebrow"><span /> {definition.lessonLabel} · {definition.duration}</p><h1 data-route-heading tabIndex={-1}>{definition.title}</h1><p>{definition.tagline}</p></div><div className="complexity-stamp" aria-label="Linear search time and constant space"><small>WORST CASE</small><strong>O(n)</strong><span>FOLLOW NEXT</span></div></section>
      <ProblemBrief definition={definition.problem} headingId={`${definition.slug}-problem`} />
      <section className="lesson-workspace linked-workspace">
        <div className="visualizer-panel">
          <form className="linked-experiment linked-search-experiment" onSubmit={applyTarget}>
            <div><strong>Try a search</strong><span>Use a present or missing stop code.</span></div>
            <label>Target value<input type="number" min="1" max="99" value={draftTarget} onChange={(event) => setDraftTarget(event.target.value)} aria-invalid={Boolean(error)} /></label>
            <button className="secondary-experiment" type="button" onClick={() => applyTargetValue(99)}>Try missing</button>
            <button type="submit">Apply</button>
            {error && <p role="alert">{error}</p>}
          </form>
          <div className="traversal-registers" aria-label={`Target ${target}. Current ${currentNode?.value ?? 'null'}. ${step.comparisonCount} comparisons.`}>
            <span><small>TARGET</small><strong>{target}</strong></span>
            <span className={step.currentId === null ? 'is-null' : ''}><small>CURRENT</small><strong>{currentNode?.value ?? 'null'}</strong></span>
            <span><small>COMPARISONS</small><strong>{step.comparisonCount} / {values.length}</strong></span>
          </div>
          <LinkedListVisualizer
            nodes={step.nodes}
            headId={step.headId}
            activeIds={step.activeIds}
            pointers={[{ id: 'current', label: 'current', nodeId: step.currentId, tone: step.phase === 'found' ? 'found' : 'current' }]}
            visitedIds={step.visitedIds}
            followedEdge={step.followedEdge}
            foundId={step.phase === 'found' ? step.currentId : null}
          />
          <div className="step-narration" aria-live="polite" key={`${target}-${stepIndex}`}><span>{String(stepIndex + 1).padStart(2, '0')}</span><div><strong>{step.title}</strong><p>{step.explanation}</p></div></div>
          <PlaybackControls stepIndex={stepIndex} stepCount={steps.length} playing={playing} speedIndex={speedIndex} isComplete={isComplete} onRestart={playback.restart} onMoveTo={playback.moveTo} onTogglePlayback={playback.togglePlayback} onCycleSpeed={playback.cycleSpeed} />
        </div>
        <aside className="code-panel linked-code"><div className="panel-label"><span>POINTER WALK</span><i>No random access</i></div><ol>{codeLines.map((line, index) => <li className={activeLine === index ? 'is-active' : ''} key={line}><span>{index + 1}</span><code>{line}</code></li>)}</ol><div className="insight-note"><span>KEY INSIGHT</span><p>A linked list makes local insertion cheap, but reaching an arbitrary value still requires walking from a known reference.</p></div></aside>
      </section>
      <section className="lesson-concept"><span className="concept-number">03</span><div><p className="eyebrow"><span /> WHY IT WORKS</p><h2>Null is the proof of exhaustion.</h2></div><p>Every reachable node lies on the next-reference path from head. Finding the target proves presence; reaching null after checking each node proves absence.</p></section>
      <PredictionCheckpoint definition={definition.prediction} />
    </main>
  )
}
