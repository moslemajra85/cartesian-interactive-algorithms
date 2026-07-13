import { createSortStep, type SortStep } from './sortStep'

export function createBubbleSortSteps(input: number[]): SortStep[] {
  const values = [...input]
  const steps: SortStep[] = [
    createSortStep(values, {
      compared: null,
      swapped: null,
      sortedIndices: [],
      line: 0,
      pass: 0,
      title: 'Ready to sort',
      explanation: 'We will repeatedly compare neighboring values and move the larger one to the right.',
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
      explanation: 'An array with fewer than two values needs no comparisons.',
    }))
    return steps
  }

  const sortedIndices = new Set<number>()
  let pass = 0

  for (let end = values.length - 1; end > 0; end -= 1) {
    pass += 1
    let swappedInPass = false

    steps.push(createSortStep(values, {
      compared: null,
      swapped: null,
      sortedIndices: [...sortedIndices],
      line: 1,
      pass,
      title: `Pass ${pass}`,
      explanation: `Scan indices 0 through ${end}. The largest unsorted value will settle at index ${end}.`,
    }))

    for (let left = 0; left < end; left += 1) {
      const right = left + 1
      steps.push(createSortStep(values, {
        compared: [left, right],
        swapped: null,
        sortedIndices: [...sortedIndices],
        line: 3,
        pass,
        title: `Compare ${values[left]} and ${values[right]}`,
        explanation: values[left] > values[right]
          ? `${values[left]} is larger, so the pair is out of order.`
          : `${values[left]} is not larger, so this pair stays where it is.`,
      }))

      if (values[left] > values[right]) {
        const leftValue = values[left]
        values[left] = values[right]
        values[right] = leftValue
        swappedInPass = true

        steps.push(createSortStep(values, {
          compared: null,
          swapped: [left, right],
          sortedIndices: [...sortedIndices],
          line: 4,
          pass,
          title: `Swap ${values[right]} and ${values[left]}`,
          explanation: `Move ${values[right]} right and ${values[left]} left. The larger value continues bubbling toward the end.`,
        }))
      }
    }

    sortedIndices.add(end)
    steps.push(createSortStep(values, {
      compared: null,
      swapped: null,
      sortedIndices: [...sortedIndices],
      line: 5,
      pass,
      title: `${values[end]} is in its final position`,
      explanation: `Index ${end} is now sorted and does not need to be visited again.`,
    }))

    if (!swappedInPass) {
      for (let index = 0; index < end; index += 1) sortedIndices.add(index)
      break
    }
  }

  for (let index = 0; index < values.length; index += 1) sortedIndices.add(index)
  steps.push(createSortStep(values, {
    compared: null,
    swapped: null,
    sortedIndices: [...sortedIndices].sort((left, right) => left - right),
    line: 6,
    pass,
    title: 'Array sorted',
    explanation: `Finished in ${pass} ${pass === 1 ? 'pass' : 'passes'}. Every value is now in nondecreasing order.`,
  }))

  return steps
}
