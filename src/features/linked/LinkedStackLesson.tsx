import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { PlaybackControls } from '../learning/PlaybackControls'
import { PredictionCheckpoint } from '../learning/PredictionCheckpoint'
import { ProblemBrief } from '../learning/ProblemBrief'
import { useStepPlayback } from '../learning/useStepPlayback'
import type { LessonComponentProps } from '../sorting/SortLesson'
import { LinkedLessonNavigation } from './LinkedLessonNavigation'
import { LinkedListVisualizer } from './LinkedListVisualizer'
import { traversalIds } from './linkedInsertion'
import { createStackSteps, type StackOperation } from './linkedStack'
import { linkedStackLesson as definition } from './linkedStackLessonDefinition'

const initialValues = [62, 47, 31]

export function LinkedStackLesson({ lessons, onBack, onOpenLesson, onCompleteLesson }: LessonComponentProps) {
  const [scenario, setScenario] = useState<{ operation: StackOperation; value: number }>({ operation: 'push', value: 88 })
  const [draftOperation, setDraftOperation] = useState<StackOperation>('push')
  const [draftValue, setDraftValue] = useState('88')
  const [error, setError] = useState<string | null>(null)
  const steps = useMemo(() => createStackSteps(initialValues, scenario.operation, scenario.value), [scenario])
  const playback = useStepPlayback(steps.length)
  const { stepIndex, playing, speedIndex, isComplete } = playback
  const step = steps[stepIndex]
  const reachableCount = traversalIds(step).length
  const valueFor = (id: string | null) => id === null ? 'null' : step.nodes.find((node) => node.id === id)?.value ?? 'released'
  const pointers = [
    { id: 'top', label: 'top', nodeId: step.topId, tone: 'current' as const },
    ...(step.newId ? [{ id: 'new', label: 'new', nodeId: step.newId, tone: 'new' as const }] : []),
    ...(step.removedId ? [{ id: 'old-top', label: 'oldTop', nodeId: step.removedId, tone: 'danger' as const }] : []),
  ]
  const secondaryId = scenario.operation === 'push' ? step.newId : step.removedId
  const secondaryValue = secondaryId ? valueFor(secondaryId) : scenario.operation === 'pop' && (step.phase === 'release' || step.phase === 'complete') ? 'released' : '—'

  useEffect(() => { if (isComplete) onCompleteLesson(definition.slug) }, [isComplete, onCompleteLesson])

  const applyScenario = (event: FormEvent) => {
    event.preventDefault()
    const value = Number(draftValue)
    if (draftOperation === 'push' && (!Number.isInteger(value) || value < 1 || value > 99)) {
      setError('Use a whole-number command code from 1 to 99.')
      return
    }
    setError(null)
    playback.restart()
    setScenario({ operation: draftOperation, value })
  }

  const tryPop = () => {
    setError(null)
    setDraftOperation('pop')
    playback.restart()
    setScenario({ operation: 'pop', value: scenario.value })
  }

  const pushCode = ['new = Node(value)', 'new.next = top', 'top = new', 'return top']
  const popCode = ['oldTop = top', 'value = oldTop.value', 'top = oldTop.next', 'release(oldTop)', 'return value']
  const codeLines = scenario.operation === 'push' ? pushCode : popCode
  const activeLine = scenario.operation === 'push'
    ? Math.max(0, ['allocate', 'link', 'move-top', 'complete'].indexOf(step.phase))
    : Math.max(0, ['ready', 'read', 'move-top', 'release', 'complete'].indexOf(step.phase))

  return (
    <main className="lesson-page linked-lesson">
      <LinkedLessonNavigation currentSlug={definition.slug} title={definition.title} lessons={lessons} onBack={onBack} onOpenLesson={onOpenLesson} />
      <section className="lesson-heading">
        <div><p className="eyebrow"><span /> {definition.lessonLabel} · {definition.duration}</p><h1 data-route-heading tabIndex={-1}>{definition.title}</h1><p>{definition.tagline}</p></div>
        <div className="complexity-stamp" aria-label="Constant push and pop time"><small>AT THE TOP</small><strong>O(1)</strong><span>LIFO ORDER</span></div>
      </section>
      <ProblemBrief definition={definition.problem} headingId={`${definition.slug}-problem`} />
      <section className="lesson-workspace linked-workspace">
        <div className="visualizer-panel">
          <form className="linked-experiment stack-experiment" onSubmit={applyScenario}>
            <div><strong>Operate the undo stack</strong><span>Compare adding and removing the newest command.</span></div>
            <label>Operation<select value={draftOperation} onChange={(event) => setDraftOperation(event.target.value as StackOperation)}><option value="push">Push</option><option value="pop">Pop</option></select></label>
            <label>Command code<input type="number" min="1" max="99" value={draftValue} disabled={draftOperation === 'pop'} onChange={(event) => setDraftValue(event.target.value)} aria-invalid={Boolean(error)} /></label>
            <button className="secondary-experiment" type="button" onClick={tryPop}>Try pop</button>
            <button type="submit">Apply</button>
            {error && <p role="alert">{error}</p>}
          </form>
          <div className="traversal-registers stack-registers" aria-label={`Top ${valueFor(step.topId)}. Stack size ${reachableCount}.`}>
            <span className={step.topId === null ? 'is-null' : ''}><small>TOP</small><strong>{valueFor(step.topId)}</strong></span>
            <span className={secondaryValue === 'released' ? 'is-released' : ''}><small>{scenario.operation === 'push' ? 'NEW' : 'OLD TOP'}</small><strong>{secondaryValue}</strong></span>
            <span><small>STACK SIZE</small><strong>{reachableCount}</strong></span>
          </div>
          <LinkedListVisualizer nodes={step.nodes} headId={step.headId} headLabel="TOP ENTRY" activeIds={step.activeIds} emphasizedIds={step.newId ? [step.newId] : []} pointers={pointers} followedEdge={step.followedEdge} edgeAction={step.edgeAction} />
          <div className="step-narration" aria-live="polite" key={`${scenario.operation}-${scenario.value}-${stepIndex}`}><span>{String(stepIndex + 1).padStart(2, '0')}</span><div><strong>{step.title}</strong><p>{step.explanation}</p></div></div>
          <PlaybackControls stepIndex={stepIndex} stepCount={steps.length} playing={playing} speedIndex={speedIndex} isComplete={isComplete} onRestart={playback.restart} onMoveTo={playback.moveTo} onTogglePlayback={playback.togglePlayback} onCycleSpeed={playback.cycleSpeed} />
        </div>
        <aside className="code-panel linked-code"><div className="panel-label"><span>LIFO OPERATIONS</span><i>One entry point</i></div><ol>{codeLines.map((line, index) => <li className={activeLine === index ? 'is-active' : ''} key={line}><span>{index + 1}</span><code>{line}</code></li>)}</ol><div className="insight-note"><span>KEY INSIGHT</span><p>Push and pop are O(1) because both change only top and one nearby reference. Searching inside the stack would still require O(n) traversal.</p></div></aside>
      </section>
      <section className="lesson-concept"><span className="concept-number">04</span><div><p className="eyebrow"><span /> WHY IT WORKS</p><h2>The newest item owns the entrance.</h2></div><p>Every push installs a new entry point above the previous top. Every pop moves that entry point down exactly one link. That restriction creates last-in, first-out order without searching or shifting data.</p></section>
      <PredictionCheckpoint definition={definition.prediction} />
    </main>
  )
}
