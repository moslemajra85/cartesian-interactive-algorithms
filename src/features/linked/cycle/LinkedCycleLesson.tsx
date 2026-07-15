import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { PlaybackControls } from '../../learning/PlaybackControls'
import { PredictionCheckpoint } from '../../learning/PredictionCheckpoint'
import { ProblemBrief } from '../../learning/ProblemBrief'
import { useStepPlayback } from '../../learning/useStepPlayback'
import type { LessonComponentProps } from '../../sorting/SortLesson'
import { LinkedLessonNavigation } from '../components/LinkedLessonNavigation'
import { LinkedListVisualizer } from '../components/LinkedListVisualizer'
import { createCycleDetectionSteps } from './linkedCycle'
import { linkedCycleLesson as definition } from './linkedCycleLessonDefinition'

const values = [14, 31, 47, 62, 78]

export function LinkedCycleLesson({ lessons, onBack, onOpenLesson, onCompleteLesson }: LessonComponentProps) {
  const [cycleEntry, setCycleEntry] = useState<number | null>(2)
  const [draftEntry, setDraftEntry] = useState('2')
  const steps = useMemo(() => createCycleDetectionSteps(values, cycleEntry), [cycleEntry])
  const playback = useStepPlayback(steps.length)
  const { stepIndex, playing, speedIndex, isComplete } = playback
  const step = steps[stepIndex]
  const valueFor = (id: string | null) => id ? step.nodes.find((node) => node.id === id)?.value ?? '—' : 'null'

  useEffect(() => { if (isComplete) onCompleteLesson(definition.slug) }, [isComplete, onCompleteLesson])

  const applyScenario = (event: FormEvent) => {
    event.preventDefault()
    playback.restart()
    setCycleEntry(draftEntry === 'none' ? null : Number(draftEntry))
  }

  const tryNoCycle = () => {
    setDraftEntry('none')
    playback.restart()
    setCycleEntry(null)
  }

  const codeLines = ['slow = head; fast = head', 'while fast != null and fast.next != null', '  slow = slow.next', '  fast = fast.next.next', '  if slow == fast: return cycle', 'return no cycle']
  const activeLine = step.phase === 'ready' ? 0 : step.phase === 'advance' ? 3 : step.phase === 'compare' || step.phase === 'found' ? 4 : 5

  return <main className="lesson-page linked-lesson">
    <LinkedLessonNavigation currentSlug={definition.slug} title={definition.title} lessons={lessons} onBack={onBack} onOpenLesson={onOpenLesson} />
    <section className="lesson-heading"><div><p className="eyebrow"><span /> {definition.lessonLabel} · {definition.duration}</p><h1 data-route-heading tabIndex={-1}>{definition.title}</h1><p>{definition.tagline}</p></div><div className="complexity-stamp" aria-label="Linear time and constant extra space"><small>TWO POINTERS</small><strong>O(n)</strong><span>O(1) SPACE</span></div></section>
    <ProblemBrief definition={definition.problem} headingId={`${definition.slug}-problem`} />
    <section className="lesson-workspace linked-workspace"><div className="visualizer-panel">
      <form className="linked-experiment linked-cycle-experiment" onSubmit={applyScenario}><div><strong>Corrupt or repair the route</strong><span>Choose where the tail points.</span></div><label>Tail next<select value={draftEntry} onChange={(event) => setDraftEntry(event.target.value)}><option value="2">Loops to 47</option><option value="1">Loops to 31</option><option value="none">null (no cycle)</option></select></label><button className="secondary-experiment" type="button" onClick={tryNoCycle}>Try no cycle</button><button type="submit">Apply</button></form>
      <div className="traversal-registers cycle-registers" aria-label={`Slow ${valueFor(step.slowId)}. Fast ${valueFor(step.fastId)}. ${step.comparisonCount} comparisons.`}><span><small>SLOW · 1 HOP</small><strong>{valueFor(step.slowId)}</strong></span><span className={step.fastId === null ? 'is-null' : ''}><small>FAST · 2 HOPS</small><strong>{valueFor(step.fastId)}</strong></span><span><small>COMPARISONS</small><strong>{step.comparisonCount}</strong></span></div>
      <LinkedListVisualizer nodes={step.nodes} headId={step.headId} activeIds={step.activeIds} pointers={[{ id: 'slow', label: 'slow', nodeId: step.slowId, tone: 'reference' }, { id: 'fast', label: 'fast', nodeId: step.fastId, tone: step.phase === 'found' ? 'found' : 'current' }]} foundId={step.phase === 'found' ? step.slowId : null} />
      {step.movements.length > 0 && <div className="cycle-movements" aria-label={step.movements.map((movement) => `${movement.pointerId} moved ${movement.hops} hops`).join('. ')}>{step.movements.map((movement) => <span key={movement.pointerId}><b>{movement.pointerId}</b><i>{movement.hops} {movement.hops === 1 ? 'hop' : 'hops'}</i><strong>{valueFor(movement.toId)}</strong></span>)}</div>}
      <div className="step-narration" aria-live="polite" key={`${cycleEntry}-${stepIndex}`}><span>{String(stepIndex + 1).padStart(2, '0')}</span><div><strong>{step.title}</strong><p>{step.explanation}</p></div></div>
      <PlaybackControls stepIndex={stepIndex} stepCount={steps.length} playing={playing} speedIndex={speedIndex} isComplete={isComplete} onRestart={playback.restart} onMoveTo={playback.moveTo} onTogglePlayback={playback.togglePlayback} onCycleSpeed={playback.cycleSpeed} />
    </div><aside className="code-panel linked-code"><div className="panel-label"><span>FLOYD'S ALGORITHM</span><i>No visited set</i></div><ol>{codeLines.map((line, index) => <li className={activeLine === index ? 'is-active' : ''} key={line}><span>{index + 1}</span><code>{line}</code></li>)}</ol><div className="insight-note"><span>KEY INSIGHT</span><p>Different speeds turn repetition into evidence. On an acyclic route fast escapes to null; inside a cycle it must eventually lap slow.</p></div></aside></section>
    <section className="lesson-concept"><span className="concept-number">06</span><div><p className="eyebrow"><span /> WHY IT WORKS</p><h2>A loop converts speed into proof.</h2></div><p>Inside a finite cycle, fast closes one position of distance per iteration. The pointers must meet. Without a cycle, fast reaches null first, providing a finite proof that the route terminates.</p></section>
    <PredictionCheckpoint definition={definition.prediction} />
  </main>
}
