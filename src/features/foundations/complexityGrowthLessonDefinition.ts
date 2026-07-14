import type { PredictionCheckpointDefinition } from '../learning/PredictionCheckpoint'

export const complexityGrowthLesson = {
  slug: 'complexity-growth',
  title: 'Growth of Work',
  lessonLabel: 'LESSON 01.01',
  duration: '8 MIN',
  tagline: 'Change the input. Watch the work grow. Learn what Big O is actually comparing.',
  timeComplexity: 'O(1)…O(n²)',
  spaceComplexity: '—',
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
