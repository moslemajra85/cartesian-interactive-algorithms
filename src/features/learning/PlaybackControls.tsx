type PlaybackControlsProps = {
  stepIndex: number
  stepCount: number
  playing: boolean
  speedIndex: number
  isComplete: boolean
  onRestart: () => void
  onMoveTo: (step: number) => void
  onTogglePlayback: () => void
  onCycleSpeed: () => void
  timelineLabel?: string
}

export function PlaybackControls({
  stepIndex,
  stepCount,
  playing,
  speedIndex,
  isComplete,
  onRestart,
  onMoveTo,
  onTogglePlayback,
  onCycleSpeed,
  timelineLabel = `Step ${stepIndex + 1} of ${stepCount}`,
}: PlaybackControlsProps) {
  const progress = stepCount > 1 ? (stepIndex / (stepCount - 1)) * 100 : 100

  return (
    <>
      <div className="player-controls">
        <button className="control-button" type="button" onClick={onRestart} aria-label="Restart">↺</button>
        <button className="control-button" type="button" onClick={() => onMoveTo(stepIndex - 1)} disabled={stepIndex === 0} aria-label="Previous step">←</button>
        <button className={`play-button ${playing ? 'is-playing' : ''}`} type="button" onClick={onTogglePlayback}>
          <span aria-hidden="true">{isComplete ? '↺' : playing ? 'Ⅱ' : '▶'}</span>
          {isComplete ? 'Replay' : playing ? 'Pause' : 'Play'}
        </button>
        <button className="control-button" type="button" onClick={() => onMoveTo(stepIndex + 1)} disabled={isComplete} aria-label="Next step">→</button>
        <button className="speed-button" type="button" onClick={onCycleSpeed}>{speedIndex + 1}× speed</button>
      </div>
      <div className="timeline" aria-label={timelineLabel}><span style={{ width: `${progress}%` }} /></div>
      <div className="shortcut-strip" aria-label="Keyboard shortcuts">
        <span><kbd>Space</kbd> Play / pause</span>
        <span><kbd>←</kbd><kbd>→</kbd> Step</span>
        <span><kbd>R</kbd> Restart</span>
        <span><kbd>S</kbd> Speed</span>
      </div>
    </>
  )
}
