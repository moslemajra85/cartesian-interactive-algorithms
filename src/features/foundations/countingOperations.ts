export type SequentialWork = {
  setup: number
  firstPass: number
  secondPass: number
  total: number
}

export type OperationCountingStep = SequentialWork & {
  inputSize: number
  title: string
  explanation: string
}

export function countSequentialOperations(inputSize: number): SequentialWork {
  if (!Number.isInteger(inputSize) || inputSize < 1) {
    throw new RangeError('Input size must be a positive whole number.')
  }

  const setup = 3
  const firstPass = inputSize
  const secondPass = inputSize
  return { setup, firstPass, secondPass, total: setup + firstPass + secondPass }
}

export function createOperationCountingSteps(maxInputSize = 12): OperationCountingStep[] {
  if (!Number.isInteger(maxInputSize) || maxInputSize < 2 || maxInputSize > 20) {
    throw new RangeError('Maximum input size must be a whole number from 2 to 20.')
  }

  return Array.from({ length: maxInputSize }, (_, index) => {
    const inputSize = index + 1
    const work = countSequentialOperations(inputSize)

    return {
      inputSize,
      ...work,
      title: `Two passes over ${inputSize} ${inputSize === 1 ? 'item' : 'items'}`,
      explanation: `The fixed setup still costs 3 operations. The two separate loops cost ${inputSize} each, giving 2n + 3 = ${work.total} exact operations—but the growth class remains O(n).`,
    }
  })
}
