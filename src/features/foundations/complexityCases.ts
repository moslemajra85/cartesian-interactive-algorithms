export type CaseComparison = {
  best: number
  average: number
  worst: number
}

export type ComplexityCaseStep = CaseComparison & {
  inputSize: number
  title: string
  explanation: string
}

export function linearSearchCases(inputSize: number): CaseComparison {
  if (!Number.isInteger(inputSize) || inputSize < 1) {
    throw new RangeError('Input size must be a positive whole number.')
  }

  return {
    best: 1,
    average: (inputSize + 1) / 2,
    worst: inputSize,
  }
}

export function createComplexityCaseSteps(maxInputSize = 10): ComplexityCaseStep[] {
  if (!Number.isInteger(maxInputSize) || maxInputSize < 2 || maxInputSize > 20) {
    throw new RangeError('Maximum input size must be a whole number from 2 to 20.')
  }

  return Array.from({ length: maxInputSize }, (_, index) => {
    const inputSize = index + 1
    const cases = linearSearchCases(inputSize)

    return {
      inputSize,
      ...cases,
      title: `Search among ${inputSize} ${inputSize === 1 ? 'candidate' : 'candidates'}`,
      explanation: `A lucky match still needs one comparison. A uniformly located successful target needs ${cases.average} comparisons on average, while a last-position or missing target can require all ${cases.worst}.`,
    }
  })
}
