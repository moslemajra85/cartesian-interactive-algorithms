import type { PredictionCheckpointDefinition } from '../learning/PredictionCheckpoint'

export const spaceComplexityLesson = {
  slug: 'space-complexity',
  title: 'Space Complexity',
  lessonLabel: 'LESSON 01.03',
  duration: '8 MIN',
  tagline: 'Separate input storage from working memory. See when “in place” stays constant and when copying grows with n.',
  timeComplexity: '—',
  spaceComplexity: 'O(1)…O(n)',
  prediction: {
    question: 'An algorithm receives an array of n values and creates one equally sized copy. What is its auxiliary space complexity?',
    options: [
      { id: 'constant', label: 'O(1), because there is only one copied array.' },
      { id: 'logarithmic', label: 'O(log n), because memory is cheaper than time.' },
      { id: 'linear', label: 'O(n), because the copy grows with the input.' },
      { id: 'quadratic', label: 'O(n²), because two arrays exist.' },
    ],
    correctOptionId: 'linear',
    hint: 'Count cells, not containers. How many additional values must the copy hold?',
    explanation: 'The copy needs one additional cell for every input value. Its extra memory therefore grows directly with n, which is O(n) auxiliary space.',
  } satisfies PredictionCheckpointDefinition,
} as const
