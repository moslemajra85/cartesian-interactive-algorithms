import type { PredictionCheckpointDefinition } from '../learning/PredictionCheckpoint'

export const complexityCasesLesson = {
  slug: 'complexity-cases',
  title: 'Cases & Guarantees',
  lessonLabel: 'LESSON 01.04',
  duration: '9 MIN',
  tagline: 'Separate lucky runs from typical behavior and hard guarantees. Learn what a worst-case bound really promises.',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  prediction: {
    question: 'What does a worst-case O(n) bound for linear search guarantee?',
    options: [
      { id: 'always-n', label: 'Every search performs exactly n comparisons.' },
      { id: 'at-most-linear', label: 'Comparisons grow no faster than a linear bound.' },
      { id: 'average-n', label: 'The average search always performs n comparisons.' },
      { id: 'target-missing', label: 'The target is guaranteed to be missing.' },
    ],
    correctOptionId: 'at-most-linear',
    hint: 'A bound describes the ceiling as input grows, not the exact cost of every execution.',
    explanation: 'A worst-case O(n) bound says the work is capped by a linear growth rate. Individual searches may finish earlier, including after one comparison.',
  } satisfies PredictionCheckpointDefinition,
} as const
