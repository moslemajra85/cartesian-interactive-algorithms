import { useEffect, useMemo, useState } from 'react'
import { PlaybackControls } from '../learning/PlaybackControls'
import { PredictionCheckpoint } from '../learning/PredictionCheckpoint'
import { ProblemBrief } from '../learning/ProblemBrief'
import { useStepPlayback } from '../learning/useStepPlayback'
import type { LessonComponentProps } from '../sorting/SortLesson'
import { FoundationLessonNavigation } from './FoundationLessonNavigation'
import { InputSizeExperiment } from './InputSizeExperiment'
import { createRecursionStackSteps } from './recursionStack'
import { recursionStackLesson as definition } from './recursionStackLessonDefinition'

export function RecursionStackLesson({ lessons, onBack, onOpenLesson, onCompleteLesson }: LessonComponentProps) {
  const [depth, setDepth] = useState(4)
  const steps = useMemo(() => createRecursionStackSteps(depth), [depth])
  const playback = useStepPlayback(steps.length)
  const { stepIndex, playing, speedIndex, isComplete } = playback
  const step = steps[stepIndex]

  useEffect(() => {
    if (isComplete) onCompleteLesson(definition.slug)
  }, [isComplete, onCompleteLesson])

  const changeDepth = (nextDepth: number) => {
    playback.restart()
    setDepth(nextDepth)
  }

  return (
    <main className="lesson-page foundation-lesson">
      <FoundationLessonNavigation currentSlug={definition.slug} title={definition.title} lessons={lessons} onBack={onBack} onOpenLesson={onOpenLesson} />

      <section className="lesson-heading">
        <div>
          <p className="eyebrow"><span /> {definition.lessonLabel} · {definition.duration}</p>
          <h1 data-route-heading tabIndex={-1}>{definition.title}</h1>
          <p>{definition.tagline}</p>
        </div>
        <div className="complexity-stamp" aria-label="Linear time and linear call-stack space">
          <small>STACK SPACE</small><strong>O(n)</strong><span>DEPTH MATTERS</span>
        </div>
      </section>

      <ProblemBrief definition={definition.problem} headingId={`${definition.slug}-problem`} />

      <section className="growth-workspace recursion-workspace">
        <div className="growth-panel">
          <div className="panel-label"><span>CALL STACK · DEPTH {depth}</span><i>{step.phase.toUpperCase()}</i></div>
          <InputSizeExperiment
            value={depth} min={1} max={8} onChange={changeDepth}
            label="Experiment with recursion depth" description="Change the folder depth and replay the call sequence."
            singularUnit="level" pluralUnit="levels"
          />
          <div className="recursion-stage" aria-label={`Call stack contains ${step.frames.length} frames. ${step.title}.`}>
            <div className="folder-depth" aria-hidden="true">
              {Array.from({ length: depth }, (_, index) => (
                <span className={index + 1 <= step.frames.length ? 'is-visited' : ''} key={index}>/{index + 1}</span>
              ))}
            </div>
            <div className="call-stack" aria-hidden="true">
              <strong>TOP OF STACK</strong>
              <div>
                {[...step.frames].reverse().map((level) => (
                  <span className={level === step.activeLevel ? `is-active phase-${step.phase}` : ''} key={level}>
                    <b>visitFolder(level {level})</b><small>resume after child returns</small>
                  </span>
                ))}
                {step.frames.length === 0 && <i>empty</i>}
              </div>
              <em>CALLER</em>
            </div>
          </div>

          <div className="step-narration" aria-live="polite" key={`${depth}-${stepIndex}`}>
            <span>{String(stepIndex + 1).padStart(2, '0')}</span>
            <div><strong>{step.title}</strong><p>{step.explanation}</p></div>
          </div>
          <PlaybackControls
            stepIndex={stepIndex} stepCount={steps.length} playing={playing} speedIndex={speedIndex} isComplete={isComplete}
            onRestart={playback.restart} onMoveTo={playback.moveTo} onTogglePlayback={playback.togglePlayback} onCycleSpeed={playback.cycleSpeed}
          />
        </div>

        <aside className="growth-guide recursion-guide">
          <div className="panel-label"><span>THE RECURSIVE RULE</span><i>Same shape, smaller input</i></div>
          <ol>
            <li><code>ENTER</code><div><strong>Push a frame</strong><p>Remember this call’s unfinished work.</p></div></li>
            <li><code>BASE</code><div><strong>Stop descending</strong><p>Return directly when no child remains.</p></div></li>
            <li><code>RETURN</code><div><strong>Pop and resume</strong><p>Complete suspended callers in reverse order.</p></div></li>
          </ol>
          <div className="insight-note"><span>KEY INSIGHT</span><p>Recursive code can look short while its call stack grows with depth. A deeply skewed input can therefore become a memory risk.</p></div>
        </aside>
      </section>

      <section className="lesson-concept">
        <span className="concept-number">05</span>
        <div><p className="eyebrow"><span /> THE MENTAL MODEL</p><h2>Descent postpones work. Unwinding completes it.</h2></div>
        <p>Every frame preserves the local state of one unfinished call. The base case stops new frames; returns then remove frames in last-in, first-out order until the original caller receives its result.</p>
      </section>
      <PredictionCheckpoint definition={definition.prediction} />
    </main>
  )
}
