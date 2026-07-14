export const growthRateIds = ['constant', 'logarithmic', 'linear', 'quadratic'] as const
export type GrowthRateId = (typeof growthRateIds)[number]

export type ComplexityGrowthStep = {
  inputSize: number
  operations: Record<GrowthRateId, number>
  title: string
  explanation: string
}

export function operationCounts(inputSize: number): Record<GrowthRateId, number> {
  if (!Number.isInteger(inputSize) || inputSize < 1) {
    throw new RangeError('Input size must be a positive whole number.')
  }

  return {
    constant: 1,
    logarithmic: Math.floor(Math.log2(inputSize)) + 1,
    linear: inputSize,
    quadratic: inputSize ** 2,
  }
}

export function createComplexityGrowthSteps(maxInputSize = 10): ComplexityGrowthStep[] {
  if (!Number.isInteger(maxInputSize) || maxInputSize < 2 || maxInputSize > 20) {
    throw new RangeError('Maximum input size must be a whole number from 2 to 20.')
  }

  return Array.from({ length: maxInputSize }, (_, index) => {
    const inputSize = index + 1
    const operations = operationCounts(inputSize)

    return {
      inputSize,
      operations,
      title: inputSize === 1 ? 'Start with one item' : `Grow the input to ${inputSize} items`,
      explanation: inputSize === 1
        ? 'At this scale every strategy looks inexpensive. Growth becomes visible only as more input arrives.'
        : `Linear work reaches ${operations.linear} units, while a nested pair of passes reaches ${operations.quadratic}. The gap is the growth rate becoming visible.`,
    }
  })
}
