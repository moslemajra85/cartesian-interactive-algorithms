import type { PredictionCheckpointDefinition } from '../learning/PredictionCheckpoint'

export const countingOperationsLesson = {
  slug: 'counting-operations',
  title: 'Counting Operations',
  lessonLabel: 'LESSON 01.02',
  duration: '9 MIN',
  tagline: 'Translate code into work. Separate fixed cost from repeated cost. Keep the term that controls growth.',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  prediction: {
    question: 'Why are two separate loops over n items O(n), rather than O(n²)?',
    options: [
      { id: 'parallel', label: 'The loops execute at the same time.' },
      { id: 'add', label: 'Their work adds to 2n instead of multiplying to n².' },
      { id: 'constant-loop', label: 'The second loop counts as constant work.' },
      { id: 'small-input', label: 'Big O assumes the input is always small.' },
    ],
    correctOptionId: 'add',
    hint: 'Ask whether the second loop runs once overall or once for every iteration of the first loop.',
    explanation: 'Sequential loops run one after the other, so their costs add: n + n = 2n. Nested loops multiply because the inner loop repeats for every outer iteration.',
  } satisfies PredictionCheckpointDefinition,
} as const
