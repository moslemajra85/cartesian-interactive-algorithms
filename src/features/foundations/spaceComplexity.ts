export type AuxiliarySpaceMeasurement = {
  inputCells: number
  inPlaceExtraCells: number
  copiedExtraCells: number
}

export type SpaceComplexityStep = AuxiliarySpaceMeasurement & {
  inputSize: number
  title: string
  explanation: string
}

export function measureAuxiliarySpace(inputSize: number): AuxiliarySpaceMeasurement {
  if (!Number.isInteger(inputSize) || inputSize < 1) {
    throw new RangeError('Input size must be a positive whole number.')
  }

  return {
    inputCells: inputSize,
    inPlaceExtraCells: 1,
    copiedExtraCells: inputSize,
  }
}

export function createSpaceComplexitySteps(maxInputSize = 8): SpaceComplexityStep[] {
  if (!Number.isInteger(maxInputSize) || maxInputSize < 2 || maxInputSize > 12) {
    throw new RangeError('Maximum input size must be a whole number from 2 to 12.')
  }

  return Array.from({ length: maxInputSize }, (_, index) => {
    const inputSize = index + 1
    const measurement = measureAuxiliarySpace(inputSize)

    return {
      inputSize,
      ...measurement,
      title: `Provide ${inputSize} input ${inputSize === 1 ? 'cell' : 'cells'}`,
      explanation: `Both strategies receive the same ${inputSize}-cell input. The in-place strategy still needs one temporary cell, while the copying strategy now allocates ${inputSize} extra ${inputSize === 1 ? 'cell' : 'cells'}.`,
    }
  })
}
