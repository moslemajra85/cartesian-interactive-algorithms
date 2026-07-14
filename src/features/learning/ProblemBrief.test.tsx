// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { ProblemBrief, type ProblemBriefDefinition } from './ProblemBrief'

afterEach(cleanup)

const definition: ProblemBriefDefinition = {
  title: 'Keep an API within its latency budget',
  scenario: 'A lookup endpoint must stay responsive as its catalogue grows.',
  constraints: ['The catalogue doubles each quarter.', 'Missing values are valid requests.'],
  question: 'Which growth bound protects the latency target?',
}

describe('ProblemBrief', () => {
  it('connects a scenario, constraints, and engineering decision', () => {
    render(<ProblemBrief definition={definition} headingId="problem-title" />)

    expect(screen.getByRole('heading', { name: definition.title })).toBeTruthy()
    expect(screen.getByText(definition.scenario)).toBeTruthy()
    expect(screen.getByText(definition.constraints[0])).toBeTruthy()
    expect(screen.getByText(definition.question)).toBeTruthy()
  })
})
