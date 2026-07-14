import type { SortStep } from './sortStep'

export function describeArrayStep(step: SortStep) {
  const parts = [`Values by index: ${step.values.map((value, index) => `${index}: ${value}`).join(', ')}.`]

  if (step.activeRange) {
    const [start, end] = step.activeRange
    parts.push(start <= end ? `Active indices ${start} through ${end}.` : 'No active indices remain.')
  }

  if (step.compared) {
    const [left, right] = step.compared
    parts.push(left === right
      ? `Inspecting index ${left}, value ${step.values[left]}.`
      : `Comparing indices ${left} and ${right}, values ${step.values[left]} and ${step.values[right]}.`)
  }

  if (step.swapped) {
    const [left, right] = step.swapped
    parts.push(`Indices ${left} and ${right} were swapped.`)
  }

  if (step.mergedRange) {
    parts.push(`Indices ${step.mergedRange[0]} through ${step.mergedRange[1]} were merged.`)
  }

  if (step.sortedIndices.length > 0) {
    parts.push(`Ordered indices: ${step.sortedIndices.join(', ')}.`)
  }

  return parts.join(' ')
}
