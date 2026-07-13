import { createSortStep, type SortStep } from './sortStep'

const prefixIndices = (end: number) => Array.from({ length: end + 1 }, (_, index) => index)

export function createInsertionSortSteps(input: number[]): SortStep[] {
  const values = [...input]
  const steps: SortStep[] = [
    createSortStep(values, {
      compared: null,
      swapped: null,
      sortedIndices: values.length ? [0] : [],
      line: 0,
      pass: 0,
      title: 'Ready to insert',
      explanation: 'Treat the first value as an ordered region, then insert each remaining value into that region.',
    }),
  ]

  if (values.length < 2) {
    steps.push(createSortStep(values, {
      compared: null,
      swapped: null,
      sortedIndices: values.map((_, index) => index),
      line: 6,
      pass: 0,
      title: 'Already sorted',
      explanation: 'An array with fewer than two values is already an ordered region.',
    }))
    return steps
  }

  for (let current = 1; current < values.length; current += 1) {
    const pass = current
    let position = current
    const valueToInsert = values[current]

    steps.push(createSortStep(values, {
      compared: null,
      swapped: null,
      sortedIndices: prefixIndices(current - 1),
      line: 1,
      pass,
      title: `Insert ${valueToInsert}`,
      explanation: `Take the value at index ${current} and move it left until the ordered prefix can accept it.`,
    }))

    while (position > 0) {
      const left = position - 1
      steps.push(createSortStep(values, {
        compared: [left, position],
        swapped: null,
        sortedIndices: [],
        line: 3,
        pass,
        title: `Compare ${values[left]} with ${values[position]}`,
        explanation: values[position] < values[left]
          ? `${values[position]} belongs before ${values[left]}, so it must move one position left.`
          : `${values[position]} is not smaller than ${values[left]}; its insertion position has been found.`,
      }))

      if (values[position] >= values[left]) break

      const leftValue = values[left]
      values[left] = values[position]
      values[position] = leftValue
      steps.push(createSortStep(values, {
        compared: null,
        swapped: [left, position],
        sortedIndices: [],
        line: 4,
        pass,
        title: `Move ${values[left]} left`,
        explanation: `Swap the adjacent pair. The value being inserted is now at index ${left}.`,
      }))

      position = left
    }

    steps.push(createSortStep(values, {
      compared: null,
      swapped: null,
      sortedIndices: prefixIndices(current),
      line: 5,
      pass,
      title: `Indices 0 through ${current} are ordered`,
      explanation: `${valueToInsert} has been inserted at index ${position}. The ordered prefix has grown by one value.`,
    }))
  }

  steps.push(createSortStep(values, {
    compared: null,
    swapped: null,
    sortedIndices: prefixIndices(values.length - 1),
    line: 6,
    pass: values.length - 1,
    title: 'Array sorted',
    explanation: 'The ordered prefix now spans the entire array, so no unsorted values remain.',
  }))

  return steps
}
