import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { PlaybackControls } from '../learning/PlaybackControls'
import { PredictionCheckpoint } from '../learning/PredictionCheckpoint'
import { ProblemBrief } from '../learning/ProblemBrief'
import { useStepPlayback } from '../learning/useStepPlayback'
import type { LessonComponentProps } from '../sorting/SortLesson'
import { LinkedLessonNavigation } from './LinkedLessonNavigation'
import { LinkedListVisualizer } from './LinkedListVisualizer'
import { traversalIds } from './linkedInsertion'
import { createQueueSteps, type QueueOperation } from './linkedQueue'
import { linkedQueueLesson as definition } from './linkedQueueLessonDefinition'

const initialValues = [14, 31, 47]

export function LinkedQueueLesson({ lessons, onBack, onOpenLesson, onCompleteLesson }: LessonComponentProps) {
  const [scenario, setScenario] = useState<{ operation: QueueOperation; value: number; values: number[] }>({ operation: 'enqueue', value: 62, values: initialValues })
  const [draftOperation, setDraftOperation] = useState<QueueOperation>('enqueue')
  const [draftValue, setDraftValue] = useState('62')
  const [error, setError] = useState<string | null>(null)
  const steps = useMemo(() => createQueueSteps(scenario.values, scenario.operation, scenario.value), [scenario])
  const playback = useStepPlayback(steps.length)
  const { stepIndex, playing, speedIndex, isComplete } = playback
  const step = steps[stepIndex]
  const reachableCount = traversalIds(step).length
  const pointers = [
    { id: 'front', label: 'front', nodeId: step.frontId, tone: 'reference' as const },
    { id: 'rear', label: 'rear', nodeId: step.rearId, tone: 'current' as const },
    ...(step.newId ? [{ id: 'new', label: 'new', nodeId: step.newId, tone: 'new' as const }] : []),
    ...(step.removedId ? [{ id: 'old-front', label: 'oldFront', nodeId: step.removedId, tone: 'danger' as const }] : []),
  ]
  const valueFor = (id: string | null) => id === null ? 'null' : step.nodes.find((node) => node.id === id)?.value ?? 'released'

  useEffect(() => { if (isComplete) onCompleteLesson(definition.slug) }, [isComplete, onCompleteLesson])

  const applyScenario = (event: FormEvent) => {
    event.preventDefault()
    const value = Number(draftValue)
    if (draftOperation === 'enqueue' && (!Number.isInteger(value) || value < 1 || value > 99)) {
      setError('Use a whole-number ticket code from 1 to 99.')
      return
    }
    setError(null)
    playback.restart()
    setScenario({ operation: draftOperation, value, values: initialValues })
  }

  const tryFinalDequeue = () => {
    setError(null)
    setDraftOperation('dequeue')
    playback.restart()
    setScenario({ operation: 'dequeue', value: scenario.value, values: [initialValues[0]] })
  }

  const enqueueCode = ['new = Node(value)', 'rear.next = new', 'rear = new', 'return rear']
  const dequeueCode = ['oldFront = front', 'value = oldFront.value', 'front = oldFront.next', 'if front == null: rear = null', 'release(oldFront)', 'return value']
  const codeLines = scenario.operation === 'enqueue' ? enqueueCode : dequeueCode
  const activeLine = scenario.operation === 'enqueue'
    ? Math.max(0, ['allocate', 'link', 'move-boundary', 'complete'].indexOf(step.phase))
    : Math.max(0, ['ready', 'read', 'move-boundary', 'clear-rear', 'release', 'complete'].indexOf(step.phase))

  return (
    <main className="lesson-page linked-lesson">
      <LinkedLessonNavigation currentSlug={definition.slug} title={definition.title} lessons={lessons} onBack={onBack} onOpenLesson={onOpenLesson} />
      <section className="lesson-heading">
        <div><p className="eyebrow"><span /> {definition.lessonLabel} · {definition.duration}</p><h1 data-route-heading tabIndex={-1}>{definition.title}</h1><p>{definition.tagline}</p></div>
        <div className="complexity-stamp" aria-label="Constant enqueue and dequeue time"><small>TWO BOUNDARIES</small><strong>O(1)</strong><span>FIFO ORDER</span></div>
      </section>
      <ProblemBrief definition={definition.problem} headingId={`${definition.slug}-problem`} />
      <section className="lesson-workspace linked-workspace">
        <div className="visualizer-panel">
          <form className="linked-experiment queue-experiment" onSubmit={applyScenario}>
            <div><strong>Operate the support queue</strong><span>Compare joining the rear with serving the front.</span></div>
            <label>Operation<select value={draftOperation} onChange={(event) => setDraftOperation(event.target.value as QueueOperation)}><option value="enqueue">Enqueue</option><option value="dequeue">Dequeue</option></select></label>
            <label>Ticket code<input type="number" min="1" max="99" value={draftValue} disabled={draftOperation === 'dequeue'} onChange={(event) => setDraftValue(event.target.value)} aria-invalid={Boolean(error)} /></label>
            <button className="secondary-experiment" type="button" onClick={tryFinalDequeue}>Try final item</button>
            <button type="submit">Apply</button>
            {error && <p role="alert">{error}</p>}
          </form>
          <div className="traversal-registers queue-registers" aria-label={`Front ${valueFor(step.frontId)}. Rear ${valueFor(step.rearId)}. Queue size ${reachableCount}.`}>
            <span className={step.frontId === null ? 'is-null' : ''}><small>FRONT</small><strong>{valueFor(step.frontId)}</strong></span>
            <span className={step.rearId === null ? 'is-null' : ''}><small>REAR</small><strong>{valueFor(step.rearId)}</strong></span>
            <span><small>QUEUE SIZE</small><strong>{reachableCount}</strong></span>
          </div>
          <LinkedListVisualizer nodes={step.nodes} headId={step.headId} headLabel="FRONT ENTRY" activeIds={step.activeIds} emphasizedIds={step.newId ? [step.newId] : []} pointers={pointers} followedEdge={step.followedEdge} edgeAction={step.edgeAction} />
          <div className="step-narration" aria-live="polite" key={`${scenario.operation}-${scenario.value}-${stepIndex}`}><span>{String(stepIndex + 1).padStart(2, '0')}</span><div><strong>{step.title}</strong><p>{step.explanation}</p></div></div>
          <PlaybackControls stepIndex={stepIndex} stepCount={steps.length} playing={playing} speedIndex={speedIndex} isComplete={isComplete} onRestart={playback.restart} onMoveTo={playback.moveTo} onTogglePlayback={playback.togglePlayback} onCycleSpeed={playback.cycleSpeed} />
        </div>
        <aside className="code-panel linked-code queue-code"><div className="panel-label"><span>FIFO OPERATIONS</span><i>Two entry boundaries</i></div><ol>{codeLines.map((line, index) => <li className={activeLine === index ? 'is-active' : ''} key={line}><span>{index + 1}</span><code>{line}</code></li>)}</ol><div className="insight-note"><span>KEY INSIGHT</span><p>Keeping rear avoids an O(n) walk to append. Keeping front makes removal O(1). The extra boundary reference buys constant-time operations.</p></div></aside>
      </section>
      <section className="lesson-concept"><span className="concept-number">05</span><div><p className="eyebrow"><span /> WHY IT WORKS</p><h2>Different boundaries enforce fairness.</h2></div><p>Enqueue changes only the rear boundary; dequeue changes only the front boundary. Because items enter and leave at opposite ends, arrival order becomes first-in, first-out without shifting or scanning nodes.</p></section>
      <PredictionCheckpoint definition={definition.prediction} />
    </main>
  )
}
