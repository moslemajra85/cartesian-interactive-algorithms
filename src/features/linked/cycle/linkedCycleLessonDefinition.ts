import type { PredictionCheckpointDefinition } from '../../learning/PredictionCheckpoint'

export const linkedCycleLesson = {
  slug: 'linked-cycle-detection', title: 'Two-Pointer Cycle Detection', lessonLabel: 'LESSON 03.06', duration: '12 MIN', tagline: 'Move slow once. Move fast twice. A meeting proves the path loops instead of reaching null.', timeComplexity: 'O(n)', spaceComplexity: 'O(1)',
  problem: {
    title: 'Prevent an infinite route-processing loop',
    scenario: 'A dispatch worker follows next references through a route. Corrupted data may connect a later stop back to an earlier one, causing the worker to process stops forever.',
    constraints: ['Node records cannot be modified.', 'The route may be long.', 'Only constant extra memory is available, so a visited-node set is not allowed.'],
    question: 'How can the worker prove that a cycle exists without storing every node it has already visited?',
  },
  prediction: {
    question: 'Why does slow meeting fast after movement prove that a cycle exists?',
    options: [
      { id: 'catch', label: 'Fast can catch slow only when repeated links keep both pointers inside a loop.' },
      { id: 'sorted', label: 'Equal pointers prove the node values are sorted.' },
      { id: 'head', label: 'Both pointers are reset to head after every step.' },
      { id: 'copy', label: 'Fast secretly stores a copy of every visited node.' },
    ],
    correctOptionId: 'catch',
    hint: 'On a finite path ending at null, can fast remain behind long enough to catch slow?',
    explanation: 'Without a cycle, fast eventually reaches null. Inside a finite loop, fast gains one node on slow per iteration, so their positions must eventually coincide.',
  } satisfies PredictionCheckpointDefinition,
} as const
