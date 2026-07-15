import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { PlaybackControls } from '../../learning/PlaybackControls'
import { PredictionCheckpoint } from '../../learning/PredictionCheckpoint'
import { ProblemBrief } from '../../learning/ProblemBrief'
import { useStepPlayback } from '../../learning/useStepPlayback'
import type { LessonComponentProps } from '../../sorting/SortLesson'
import { LinkedLessonNavigation } from '../components/LinkedLessonNavigation'
import { LinkedListVisualizer } from '../components/LinkedListVisualizer'
import { PointerMovementStrip } from '../components/PointerMovementStrip'
import { createMiddleSteps } from './linkedMiddle'
import { linkedMiddleLesson as definition } from './linkedMiddleLessonDefinition'

const availableValues = [14, 31, 47, 62, 78, 93]

export function LinkedMiddleLesson({ lessons, onBack, onOpenLesson, onCompleteLesson }: LessonComponentProps) {
  const [length, setLength] = useState(5)
  const [draftLength, setDraftLength] = useState('5')
  const steps = useMemo(() => createMiddleSteps(availableValues.slice(0, length)), [length])
  const playback = useStepPlayback(steps.length)
  const { stepIndex, playing, speedIndex, isComplete } = playback
  const step = steps[stepIndex]
  const valueFor = (id: string | null) => id ? step.nodes.find((node) => node.id === id)?.value ?? '—' : 'null'
  useEffect(() => { if (isComplete) onCompleteLesson(definition.slug) }, [isComplete, onCompleteLesson])
  const apply = (event: FormEvent) => { event.preventDefault(); playback.restart(); setLength(Number(draftLength)) }
  const tryEven = () => { setDraftLength('6'); playback.restart(); setLength(6) }
  const lines = ['slow = head; fast = head', 'while fast != null and fast.next != null', '  slow = slow.next', '  fast = fast.next.next', 'return slow']
  const activeLine = step.phase === 'ready' ? 0 : step.phase === 'advance' ? 3 : 4

  return <main className="lesson-page linked-lesson"><LinkedLessonNavigation currentSlug={definition.slug} title={definition.title} lessons={lessons} onBack={onBack} onOpenLesson={onOpenLesson} /><section className="lesson-heading"><div><p className="eyebrow"><span /> {definition.lessonLabel} · {definition.duration}</p><h1 data-route-heading tabIndex={-1}>{definition.title}</h1><p>{definition.tagline}</p></div><div className="complexity-stamp" aria-label="Linear time and constant extra space"><small>ONE PASS</small><strong>O(n)</strong><span>O(1) SPACE</span></div></section><ProblemBrief definition={definition.problem} headingId={`${definition.slug}-problem`} /><section className="lesson-workspace linked-workspace"><div className="visualizer-panel"><form className="linked-experiment linked-cycle-experiment" onSubmit={apply}><div><strong>Change the playlist length</strong><span>Compare odd and even midpoints.</span></div><label>Node count<select value={draftLength} onChange={(event) => setDraftLength(event.target.value)}>{[3, 4, 5, 6].map((size) => <option value={size} key={size}>{size} nodes</option>)}</select></label><button className="secondary-experiment" type="button" onClick={tryEven}>Try even</button><button type="submit">Apply</button></form><div className="traversal-registers"><span><small>SLOW · 1 HOP</small><strong>{valueFor(step.slowId)}</strong></span><span className={step.fastId === null ? 'is-null' : ''}><small>FAST · 2 HOPS</small><strong>{valueFor(step.fastId)}</strong></span><span><small>ROUNDS</small><strong>{step.round}</strong></span></div><LinkedListVisualizer nodes={step.nodes} headId={step.headId} activeIds={step.activeIds} pointers={[{ id: 'slow', label: 'slow', nodeId: step.slowId, tone: step.phase === 'found' ? 'found' : 'reference' }, { id: 'fast', label: 'fast', nodeId: step.fastId }]} foundId={step.phase === 'found' ? step.slowId : null} /><PointerMovementStrip movements={step.movements} nodes={step.nodes} /><div className="step-narration" aria-live="polite" key={`${length}-${stepIndex}`}><span>{String(stepIndex + 1).padStart(2, '0')}</span><div><strong>{step.title}</strong><p>{step.explanation}</p></div></div><PlaybackControls stepIndex={stepIndex} stepCount={steps.length} playing={playing} speedIndex={speedIndex} isComplete={isComplete} onRestart={playback.restart} onMoveTo={playback.moveTo} onTogglePlayback={playback.togglePlayback} onCycleSpeed={playback.cycleSpeed} /></div><aside className="code-panel linked-code"><div className="panel-label"><span>RUNNER TECHNIQUE</span><i>No length field</i></div><ol>{lines.map((line, index) => <li className={activeLine === index ? 'is-active' : ''} key={line}><span>{index + 1}</span><code>{line}</code></li>)}</ol><div className="insight-note"><span>KEY INSIGHT</span><p>The speed ratio measures position implicitly. This avoids a counting pass and keeps extra memory constant.</p></div></aside></section><section className="lesson-concept"><span className="concept-number">07</span><div><p className="eyebrow"><span /> WHY IT WORKS</p><h2>Relative speed replaces stored length.</h2></div><p>For every link slow consumes, fast consumes two. Exhausting the full path therefore leaves slow exactly halfway through it, including the defined second-middle result for even lengths.</p></section><PredictionCheckpoint definition={definition.prediction} /></main>
}
