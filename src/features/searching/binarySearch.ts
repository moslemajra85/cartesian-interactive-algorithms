import { createSortStep, type SortStep } from '../sorting/sortStep'

function isNondecreasing(values: readonly number[]) {
  return values.every((value, index) => index === 0 || values[index - 1] <= value)
}

export function createBinarySearchSteps(input: number[], target: number): SortStep[] {
  if (!isNondecreasing(input)) {
    throw new RangeError('Binary search requires values in nondecreasing order.')
  }

  const values = [...input]
  let low = 0
  let high = values.length - 1
  let iteration = 0
  const steps: SortStep[] = [
    createSortStep(values, {
      compared: null, swapped: null, sortedIndices: [], line: 0, pass: 0,
      title: `Search for ${target}`,
      explanation: values.length
        ? 'Start with every index as a candidate. The values are ordered, so one comparison can eliminate half of them.'
        : 'The array contains no candidates to inspect.',
      activeRange: values.length ? [low, high] : [0, -1], splitAt: null, mergedRange: null, phaseLabel: 'READY',
    }),
  ]

  while (low <= high) {
    iteration += 1
    const middle = Math.floor((low + high) / 2)
    const middleValue = values[middle]

    steps.push(createSortStep(values, {
      compared: [middle, middle], swapped: null, sortedIndices: [], line: 2, pass: iteration,
      title: `Inspect midpoint ${middle}`,
      explanation: `The candidate interval is ${low}–${high}. Its midpoint holds ${middleValue}.`,
      activeRange: [low, high], splitAt: null, mergedRange: null, phaseLabel: `CHECK · ${iteration}`,
    }))

    if (middleValue === target) {
      steps.push(createSortStep(values, {
        compared: [middle, middle], swapped: null, sortedIndices: [middle], line: 3, pass: iteration,
        title: `${target} found at index ${middle}`,
        explanation: `The midpoint equals the target, so the search can stop after ${iteration} ${iteration === 1 ? 'check' : 'checks'}.`,
        activeRange: [low, high], splitAt: null, mergedRange: null, phaseLabel: 'FOUND',
      }))
      return steps
    }

    if (middleValue < target) {
      low = middle + 1
      steps.push(createSortStep(values, {
        compared: null, swapped: null, sortedIndices: [], line: 4, pass: iteration,
        title: `Discard indices through ${middle}`,
        explanation: `${middleValue} is smaller than ${target}. Every value to its left is no larger, so none can be the target.`,
        activeRange: [low, high], splitAt: null, mergedRange: null, phaseLabel: 'DISCARD LEFT',
      }))
    } else {
      high = middle - 1
      steps.push(createSortStep(values, {
        compared: null, swapped: null, sortedIndices: [], line: 5, pass: iteration,
        title: `Discard indices from ${middle}`,
        explanation: `${middleValue} is larger than ${target}. Every value to its right is no smaller, so none can be the target.`,
        activeRange: [low, high], splitAt: null, mergedRange: null, phaseLabel: 'DISCARD RIGHT',
      }))
    }
  }

  steps.push(createSortStep(values, {
    compared: null, swapped: null, sortedIndices: [], line: 6, pass: iteration,
    title: `${target} is not in the array`,
    explanation: 'The candidate interval is empty. Every possible index was eliminated by an ordered comparison.',
    activeRange: [0, -1], splitAt: null, mergedRange: null, phaseLabel: 'NOT FOUND',
  }))

  return steps
}
