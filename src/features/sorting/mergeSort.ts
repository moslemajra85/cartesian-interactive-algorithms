import { createSortStep, type SortStep } from './sortStep'

const indicesFrom = (start: number, end: number) => Array.from(
  { length: Math.max(0, end - start + 1) },
  (_, offset) => start + offset,
)

export function createMergeSortSteps(input: number[]): SortStep[] {
  const values = [...input]
  const steps: SortStep[] = [
    createSortStep(values, {
      compared: null,
      swapped: null,
      sortedIndices: [],
      line: 0,
      pass: 0,
      title: 'Ready to divide',
      explanation: 'Split the array into smaller ranges, then merge ordered halves back together.',
      activeRange: values.length ? [0, values.length - 1] : null,
      splitAt: null,
      mergedRange: null,
      phaseLabel: 'READY',
    }),
  ]

  if (values.length < 2) {
    steps.push(createSortStep(values, {
      compared: null,
      swapped: null,
      sortedIndices: values.map((_, index) => index),
      line: 1,
      pass: 0,
      title: 'Already sorted',
      explanation: 'A range with fewer than two values is already ordered.',
      activeRange: values.length ? [0, 0] : null,
      splitAt: null,
      mergedRange: values.length ? [0, 0] : null,
      phaseLabel: 'BASE CASE',
    }))
    return steps
  }

  const merge = (start: number, middle: number, end: number, depth: number) => {
    let left = start
    let right = middle + 1
    const merged: number[] = []

    steps.push(createSortStep(values, {
      compared: null,
      swapped: null,
      sortedIndices: [],
      line: 5,
      pass: depth,
      title: `Merge indices ${start} through ${end}`,
      explanation: `Both halves are ordered. Repeatedly take the smaller front value to build one ordered range.`,
      activeRange: [start, end],
      splitAt: middle,
      mergedRange: null,
      phaseLabel: `MERGE · D${depth}`,
    }))

    while (left <= middle && right <= end) {
      const leftValue = values[left]
      const rightValue = values[right]
      steps.push(createSortStep(values, {
        compared: [left, right],
        swapped: null,
        sortedIndices: [],
        line: 5,
        pass: depth,
        title: `Compare ${leftValue} and ${rightValue}`,
        explanation: leftValue <= rightValue
          ? `${leftValue} is no larger, so take it from the left half first.`
          : `${rightValue} is smaller, so take it from the right half first.`,
        activeRange: [start, end],
        splitAt: middle,
        mergedRange: null,
        phaseLabel: `MERGE · D${depth}`,
      }))

      if (leftValue <= rightValue) {
        merged.push(leftValue)
        left += 1
      } else {
        merged.push(rightValue)
        right += 1
      }
    }

    while (left <= middle) {
      merged.push(values[left])
      left += 1
    }
    while (right <= end) {
      merged.push(values[right])
      right += 1
    }

    merged.forEach((value, offset) => {
      values[start + offset] = value
    })

    steps.push(createSortStep(values, {
      compared: null,
      swapped: null,
      sortedIndices: start === 0 && end === values.length - 1 ? indicesFrom(start, end) : [],
      line: 5,
      pass: depth,
      title: `Range ${start}–${end} is ordered`,
      explanation: `The two ordered halves now form [${merged.join(', ')}]. This range can participate in a larger merge.`,
      activeRange: [start, end],
      splitAt: null,
      mergedRange: [start, end],
      phaseLabel: `MERGED · D${depth}`,
    }))
  }

  const divide = (start: number, end: number, depth: number) => {
    if (start === end) {
      steps.push(createSortStep(values, {
        compared: null,
        swapped: null,
        sortedIndices: [],
        line: 1,
        pass: depth,
        title: `${values[start]} is a base case`,
        explanation: `Index ${start} contains one value, so this range is already ordered and recursion can return.`,
        activeRange: [start, end],
        splitAt: null,
        mergedRange: [start, end],
        phaseLabel: `BASE · D${depth}`,
      }))
      return
    }

    const middle = Math.floor((start + end) / 2)
    steps.push(createSortStep(values, {
      compared: null,
      swapped: null,
      sortedIndices: [],
      line: 2,
      pass: depth,
      title: `Split range ${start}–${end}`,
      explanation: `Divide after index ${middle}: recurse into ${start}–${middle}, then ${middle + 1}–${end}.`,
      activeRange: [start, end],
      splitAt: middle,
      mergedRange: null,
      phaseLabel: `SPLIT · D${depth}`,
    }))

    divide(start, middle, depth + 1)
    divide(middle + 1, end, depth + 1)
    merge(start, middle, end, depth)
  }

  divide(0, values.length - 1, 1)
  steps.push(createSortStep(values, {
    compared: null,
    swapped: null,
    sortedIndices: indicesFrom(0, values.length - 1),
    line: 6,
    pass: 1,
    title: 'Array sorted',
    explanation: 'The final merge returned one ordered range spanning the entire array.',
    activeRange: [0, values.length - 1],
    splitAt: null,
    mergedRange: [0, values.length - 1],
    phaseLabel: 'COMPLETE',
  }))

  return steps
}
