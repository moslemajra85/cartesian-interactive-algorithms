import { createSortStep, type SortStep } from './sortStep'

export function createSelectionSortSteps(input: number[]): SortStep[] {
  const values = [...input]
  const steps: SortStep[] = [
    createSortStep(values, {
      compared: null,
      swapped: null,
      sortedIndices: [],
      line: 0,
      pass: 0,
      title: 'Ready to select',
      explanation: 'We will find the smallest value in the unsorted region and place it at the next open position.',
    }),
  ]

  if (values.length < 2) {
    steps.push(createSortStep(values, {
      compared: null,
      swapped: null,
      sortedIndices: values.map((_, index) => index),
      line: 7,
      pass: 0,
      title: 'Already sorted',
      explanation: 'An array with fewer than two values has no unsorted region to scan.',
    }))
    return steps
  }

  const sortedIndices = new Set<number>()

  for (let start = 0; start < values.length - 1; start += 1) {
    const pass = start + 1
    let minimumIndex = start

    steps.push(createSortStep(values, {
      compared: null,
      swapped: null,
      sortedIndices: [...sortedIndices],
      line: 1,
      pass,
      title: `Fill position ${start}`,
      explanation: `Search indices ${start} through ${values.length - 1} for the smallest remaining value.`,
    }))

    for (let scan = start + 1; scan < values.length; scan += 1) {
      const previousMinimum = values[minimumIndex]
      steps.push(createSortStep(values, {
        compared: [minimumIndex, scan],
        swapped: null,
        sortedIndices: [...sortedIndices],
        line: 3,
        pass,
        title: `Compare ${previousMinimum} with ${values[scan]}`,
        explanation: values[scan] < previousMinimum
          ? `${values[scan]} is smaller than the current candidate ${previousMinimum}.`
          : `${previousMinimum} remains the smallest value found in this pass.`,
      }))

      if (values[scan] < values[minimumIndex]) {
        minimumIndex = scan
        steps.push(createSortStep(values, {
          compared: [start, minimumIndex],
          swapped: null,
          sortedIndices: [...sortedIndices],
          line: 4,
          pass,
          title: `${values[minimumIndex]} becomes the candidate`,
          explanation: `Remember index ${minimumIndex}; continue scanning in case an even smaller value appears.`,
        }))
      }
    }

    if (minimumIndex !== start) {
      const startValue = values[start]
      values[start] = values[minimumIndex]
      values[minimumIndex] = startValue
      steps.push(createSortStep(values, {
        compared: null,
        swapped: [start, minimumIndex],
        sortedIndices: [...sortedIndices],
        line: 5,
        pass,
        title: `Place ${values[start]} at index ${start}`,
        explanation: `Swap the smallest remaining value with ${values[minimumIndex]}, which occupied the next sorted position.`,
      }))
    } else {
      steps.push(createSortStep(values, {
        compared: null,
        swapped: null,
        sortedIndices: [...sortedIndices],
        line: 5,
        pass,
        title: `${values[start]} is already in place`,
        explanation: `The first value in the unsorted region was already its minimum, so no swap is needed.`,
      }))
    }

    sortedIndices.add(start)
    steps.push(createSortStep(values, {
      compared: null,
      swapped: null,
      sortedIndices: [...sortedIndices],
      line: 6,
      pass,
      title: `Index ${start} is sorted`,
      explanation: `${values[start]} is the smallest value that could occupy this position. It will not move again.`,
    }))
  }

  sortedIndices.add(values.length - 1)
  steps.push(createSortStep(values, {
    compared: null,
    swapped: null,
    sortedIndices: [...sortedIndices].sort((left, right) => left - right),
    line: 7,
    pass: values.length - 1,
    title: 'Array sorted',
    explanation: `Every position now contains the smallest value that was available when that position was filled.`,
  }))

  return steps
}
