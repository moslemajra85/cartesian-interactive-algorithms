import { describe, expect, it } from 'vitest'
import { createSpaceComplexitySteps, measureAuxiliarySpace } from './spaceComplexity'

describe('auxiliary space model', () => {
  it('separates provided input from extra workspace', () => {
    expect(measureAuxiliarySpace(6)).toEqual({
      inputCells: 6,
      inPlaceExtraCells: 1,
      copiedExtraCells: 6,
    })
  })

  it('keeps in-place workspace fixed while copied workspace grows', () => {
    const small = measureAuxiliarySpace(3)
    const large = measureAuxiliarySpace(9)

    expect(large.inPlaceExtraCells).toBe(small.inPlaceExtraCells)
    expect(large.copiedExtraCells).toBe(small.copiedExtraCells * 3)
  })

  it('builds a deterministic timeline through the requested size', () => {
    const steps = createSpaceComplexitySteps(7)

    expect(steps).toHaveLength(7)
    expect(steps.at(-1)).toMatchObject({ inputSize: 7, inputCells: 7, inPlaceExtraCells: 1, copiedExtraCells: 7 })
  })

  it.each([0, -2, 1.5])('rejects an invalid measurement size: %s', (size) => {
    expect(() => measureAuxiliarySpace(size)).toThrow(RangeError)
  })

  it.each([1, 13, 3.5])('rejects an invalid timeline maximum: %s', (size) => {
    expect(() => createSpaceComplexitySteps(size)).toThrow(RangeError)
  })
})
