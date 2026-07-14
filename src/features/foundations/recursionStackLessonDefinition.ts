import type { PredictionCheckpointDefinition } from '../learning/PredictionCheckpoint'

export const recursionStackLesson = {
  slug: 'recursion-stack', title: 'Recursion & the Stack', lessonLabel: 'LESSON 01.05', duration: '10 MIN',
  tagline: 'Enter one smaller problem at a time. Preserve unfinished work. Watch answers return in reverse order.',
  timeComplexity: 'O(n)', spaceComplexity: 'O(n)',
  problem: {
    title: 'Calculate storage inside nested folders',
    scenario: 'A file service must total the bytes inside a folder tree. Each folder can contain files and another nested folder, so the same operation applies at every level.',
    constraints: ['The nesting depth is not known in advance.', 'Each caller must resume after its child finishes.', 'A folder with no child must stop the descent.'],
    question: 'How can the service reuse one rule at every depth while remembering the unfinished callers safely?',
  },
  prediction: {
    question: 'Why must a recursive folder traversal define a base case?',
    options: [
      { id: 'sort', label: 'It keeps folder names alphabetically sorted.' },
      { id: 'stop', label: 'It provides a condition that stops creating deeper calls.' },
      { id: 'constant-space', label: 'It guarantees recursion always uses O(1) space.' },
      { id: 'parallel', label: 'It makes every recursive call execute in parallel.' },
    ],
    correctOptionId: 'stop',
    hint: 'Consider what would happen if every call always created one more call.',
    explanation: 'The base case returns without recursing again. That stops descent and gives the deepest frame a result, allowing the stack to unwind.',
  } satisfies PredictionCheckpointDefinition,
} as const
