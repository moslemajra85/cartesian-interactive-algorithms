export type SortStep = {
  values: number[]
  compared: [number, number] | null
  swapped: [number, number] | null
  sortedIndices: number[]
  line: number
  pass: number
  title: string
  explanation: string
}

export function createSortStep(
  values: number[],
  details: Omit<SortStep, 'values'>,
): SortStep {
  return { values: [...values], ...details }
}
