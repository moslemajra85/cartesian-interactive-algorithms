import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { PlaybackControls } from '../../learning/PlaybackControls'
import { PredictionCheckpoint } from '../../learning/PredictionCheckpoint'
import { ProblemBrief } from '../../learning/ProblemBrief'
import { useStepPlayback } from '../../learning/useStepPlayback'
import type { LessonComponentProps } from '../../sorting/SortLesson'
import { createLinkedInsertionSteps } from './linkedInsertion'
import { linkedInsertionLesson as definition } from './linkedInsertionLessonDefinition'
import { LinkedLessonNavigation } from '../components/LinkedLessonNavigation'
import { LinkedListVisualizer } from '../components/LinkedListVisualizer'

const initialValues = [14, 31, 47, 62]

export function LinkedInsertionLesson({ lessons, onBack, onOpenLesson, onCompleteLesson }: LessonComponentProps) {
  const [scenario, setScenario] = useState({ value: 25, afterIndex: 1 })
  const [draftValue, setDraftValue] = useState('25')
  const [draftAfter, setDraftAfter] = useState('1')
  const [error, setError] = useState<string | null>(null)
  const steps = useMemo(() => createLinkedInsertionSteps(initialValues, scenario.value, scenario.afterIndex), [scenario])
  const playback = useStepPlayback(steps.length)
  const { stepIndex, playing, speedIndex, isComplete } = playback
  const step = steps[stepIndex]
  const nodeValue = (id: string | null) => id === null ? 'null' : step.nodes.find((node) => node.id === id)?.value ?? '—'
  const pointers = [
    { id: 'predecessor', label: 'predecessor', nodeId: step.predecessorId, tone: 'reference' as const },
    ...(step.newId ? [{ id: 'new', label: 'new', nodeId: step.newId, tone: 'new' as const }] : []),
    { id: 'successor', label: 'successor', nodeId: step.successorId, tone: 'current' as const },
  ]

  useEffect(() => { if (isComplete) onCompleteLesson(definition.slug) }, [isComplete, onCompleteLesson])

  const applyScenario = (event: FormEvent) => {
    event.preventDefault()
    const value = Number(draftValue)
    const afterIndex = Number(draftAfter)
    if (!Number.isInteger(value) || value < 1 || value > 99) { setError('Use a whole-number stop value from 1 to 99.'); return }
    setError(null)
    playback.restart()
    setScenario({ value, afterIndex })
  }

  return <main className="lesson-page linked-lesson">
    <LinkedLessonNavigation currentSlug={definition.slug} title={definition.title} lessons={lessons} onBack={onBack} onOpenLesson={onOpenLesson} />
    <section className="lesson-heading"><div><p className="eyebrow"><span /> {definition.lessonLabel} · {definition.duration}</p><h1 data-route-heading tabIndex={-1}>{definition.title}</h1><p>{definition.tagline}</p></div><div className="complexity-stamp" aria-label="Constant insertion time when predecessor is known"><small>KNOWN NODE</small><strong>O(1)</strong><span>NO SHIFTING</span></div></section>
    <ProblemBrief definition={definition.problem} headingId={`${definition.slug}-problem`} />
    <section className="lesson-workspace linked-workspace"><div className="visualizer-panel">
      <form className="linked-experiment" onSubmit={applyScenario}>
        <div><strong>Try an insertion</strong><span>Choose the predecessor and new value.</span></div>
        <label>Insert after<select value={draftAfter} onChange={(event) => setDraftAfter(event.target.value)}>{initialValues.map((value, index) => <option value={index} key={value}>{value}</option>)}</select></label>
        <label>New value<input type="number" min="1" max="99" value={draftValue} onChange={(event) => setDraftValue(event.target.value)} aria-invalid={Boolean(error)} /></label>
        <button type="submit">Apply</button>{error && <p role="alert">{error}</p>}
      </form>
      <div className="traversal-registers linked-pointer-registers" aria-label={`Predecessor ${nodeValue(step.predecessorId)}. New ${step.newId ? nodeValue(step.newId) : 'not allocated'}. Successor ${nodeValue(step.successorId)}.`}>
        <span><small>PREDECESSOR</small><strong>{nodeValue(step.predecessorId)}</strong></span>
        <span><small>NEW</small><strong>{step.newId ? nodeValue(step.newId) : '—'}</strong></span>
        <span className={step.successorId === null ? 'is-null' : ''}><small>SUCCESSOR</small><strong>{nodeValue(step.successorId)}</strong></span>
      </div>
      <LinkedListVisualizer nodes={step.nodes} headId={step.headId} activeIds={step.activeIds} emphasizedIds={['node-new']} pointers={pointers} followedEdge={step.followedEdge} edgeAction="write" />
      <div className="step-narration" aria-live="polite" key={`${scenario.value}-${scenario.afterIndex}-${stepIndex}`}><span>{String(stepIndex + 1).padStart(2, '0')}</span><div><strong>{step.title}</strong><p>{step.explanation}</p></div></div>
      <PlaybackControls stepIndex={stepIndex} stepCount={steps.length} playing={playing} speedIndex={speedIndex} isComplete={isComplete} onRestart={playback.restart} onMoveTo={playback.moveTo} onTogglePlayback={playback.togglePlayback} onCycleSpeed={playback.cycleSpeed} />
    </div><aside className="code-panel linked-code"><div className="panel-label"><span>POINTER REWRITE</span><i>Preserve before redirect</i></div><ol>{['new = Node(value)', 'new.next = predecessor.next', 'predecessor.next = new', 'return head'].map((line, index) => <li className={Math.max(0, ['allocate', 'link-successor', 'link-predecessor', 'complete'].indexOf(step.phase)) === index ? 'is-active' : ''} key={line}><span>{index + 1}</span><code>{line}</code></li>)}</ol><div className="insight-note"><span>KEY INSIGHT</span><p>O(1) insertion assumes the predecessor is already known. Finding that node from head still costs O(n).</p></div></aside></section>
    <section className="lesson-concept"><span className="concept-number">01</span><div><p className="eyebrow"><span /> WHY IT WORKS</p><h2>Identity stays fixed while relationships change.</h2></div><p>A linked structure stores order in references rather than contiguous positions. Insertion preserves the old successor, then redirects one predecessor link; existing records never shift.</p></section>
    <PredictionCheckpoint definition={definition.prediction} />
  </main>
}
