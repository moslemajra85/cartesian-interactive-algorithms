import type { PredictionCheckpointDefinition } from '../learning/PredictionCheckpoint'

export const complexityGrowthLesson = {
  slug: 'complexity-growth',
  title: 'Growth of Work',
  lessonLabel: 'LESSON 01.01',
  duration: '8 MIN',
  tagline: 'Change the input. Watch the work grow. Learn what Big O is actually comparing.',
  timeComplexity: 'O(1)…O(n²)',
  spaceComplexity: '—',
  problem: {
    title: 'Protect a fraud check as transaction volume grows',
    scenario: 'A payment team is choosing between fraud checks that inspect one rule, halve a candidate set, scan every transaction, or compare every transaction pair.',
    constraints: ['Daily volume is expected to grow tenfold.', 'The response must stay within a fixed processing window.', 'Current small-scale timings look similar.'],
    question: 'Which growth pattern will dominate capacity as the input expands, even if every option feels fast today?',
  },
  prediction: {
    question: 'If the input size doubles, which strategy’s work grows by roughly four times?',
    options: [
      { id: 'constant', label: 'Constant O(1)' },
      { id: 'logarithmic', label: 'Logarithmic O(log n)' },
      { id: 'linear', label: 'Linear O(n)' },
      { id: 'quadratic', label: 'Quadratic O(n²)' },
    ],
    correctOptionId: 'quadratic',
    hint: 'Write the original work as n × n, then replace each n with 2n.',
    explanation: '(2n)² equals 4n². Doubling the input therefore multiplies quadratic work by four, while linear work only doubles.',
  } satisfies PredictionCheckpointDefinition,
} as const
