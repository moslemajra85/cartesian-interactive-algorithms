import type { CSSProperties } from 'react'
import type { SortStep } from './sortStep'

export type ArrayVisualizationMode = 'in-place' | 'merge' | 'search'

type ArrayVisualizerProps = {
  step: SortStep
  playing: boolean
  mode?: ArrayVisualizationMode
}

export function ArrayVisualizer({ step, playing, mode = 'in-place' }: ArrayVisualizerProps) {
  const maxValue = Math.max(...step.values, 1)

  const visualStateFor = (index: number) => {
    const compared = step.compared?.includes(index) ?? false
    const swapped = step.swapped?.includes(index) ?? false
    const sorted = step.sortedIndices.includes(index)
    const activeRange = step.activeRange
    const inActiveRange = !activeRange || (index >= activeRange[0] && index <= activeRange[1])
    const mergedRange = step.mergedRange
    const merged = Boolean(mergedRange && index >= mergedRange[0] && index <= mergedRange[1])
    const startsRightHalf = step.splitAt !== null && step.splitAt !== undefined && index === step.splitAt + 1
    const arrivesFromRight = swapped && index === step.swapped?.[0]
    const arrivesFromLeft = swapped && index === step.swapped?.[1]
    const swapDistance = step.swapped ? Math.abs(step.swapped[1] - step.swapped[0]) * 112 : 0

    return {
      classes: [
        inActiveRange && activeRange && 'is-range-active',
        !inActiveRange && 'is-range-inactive',
        merged && 'is-merged',
        compared && 'is-compared',
        swapped && 'is-swapped',
        arrivesFromRight && 'arrives-from-right',
        arrivesFromLeft && 'arrives-from-left',
        sorted && 'is-sorted',
      ].filter(Boolean).join(' '),
      startsRightHalf,
      style: {
        '--item-index': index,
        '--swap-from': `${arrivesFromRight ? swapDistance : arrivesFromLeft ? -swapDistance : 0}%`,
      } as CSSProperties,
    }
  }

  const hasCandidates = step.activeRange && step.activeRange[0] <= step.activeRange[1]
  const tapeLabel = hasCandidates
    ? `${mode === 'search' ? 'CANDIDATES' : 'ACTIVE'} [${step.activeRange![0]}…${step.activeRange![1]}]`
    : step.activeRange ? 'NO CANDIDATES' : `ARRAY · ${step.values.length} CELLS`

  return (
    <div className={`sort-stage mode-${mode} ${playing ? 'is-playing' : ''}`}>
      <div className="pass-indicator">{step.phaseLabel ?? (step.pass ? `PASS ${step.pass}` : 'READY')}</div>
      <div className="array-tape" aria-hidden="true">
        <span>{tapeLabel}</span>
        <div className="tape-cells" style={{ gridTemplateColumns: `repeat(${step.values.length}, minmax(0, 1fr))` }}>
          {step.values.map((value, index) => {
            const visualState = visualStateFor(index)
            return (
              <i
                className={`tape-cell ${visualState.classes} ${visualState.startsRightHalf ? 'starts-right-half' : ''}`.trim()}
                style={visualState.style}
                key={index}
              >
                <b>{value}</b><small>{index}</small>
              </i>
            )
          })}
        </div>
      </div>
      <div className="sort-bars" aria-label={`Current array: ${step.values.join(', ')}`}>
        {step.values.map((value, index) => {
          const visualState = visualStateFor(index)

          return (
            <div className={`bar-slot ${visualState.startsRightHalf ? 'starts-right-half' : ''}`} key={index}>
              <div
                className={`sort-bar ${visualState.classes}`.trim()}
                style={{ ...visualState.style, height: `${30 + (value / maxValue) * 68}%` }}
              ><strong>{value}</strong></div>
              <span>{index}</span>
            </div>
          )
        })}
      </div>
      <div className="visual-legend">
        {mode === 'merge' ? (
          <>
            <span><i className="legend-compare" /> Comparing halves</span>
            <span><i className="legend-merged" /> Merged range</span>
            <span><i className="legend-sorted" /> Fully ordered</span>
          </>
        ) : mode === 'search' ? (
          <>
            <span><i className="legend-candidate" /> Candidate interval</span>
            <span><i className="legend-compare" /> Midpoint</span>
            <span><i className="legend-sorted" /> Target found</span>
          </>
        ) : (
          <>
            <span><i className="legend-compare" /> Inspecting</span>
            <span><i className="legend-swap" /> Swapped</span>
            <span><i className="legend-sorted" /> Ordered</span>
          </>
        )}
      </div>
    </div>
  )
}
