import type { PredictionCheckpointDefinition } from '../../learning/PredictionCheckpoint'

export const linkedStackLesson = {
  slug: 'stack-push-pop', title: 'Stack Push & Pop', lessonLabel: 'LESSON 03.04', duration: '11 MIN', tagline: 'Push at top. Pop from top. Preserve the older chain before moving the only entry point.', timeComplexity: 'O(1)', spaceComplexity: 'O(1)',
  problem: {
    title: 'Maintain an editor’s undo history',
    scenario: 'A collaborative editor stores reversible commands in a linked stack. The newest command must be undone first, while older commands remain available in their original reverse-chronological order.',
    constraints: ['Only the top reference is immediately available.', 'Push and pop must not scan older commands.', 'Removing the newest command must preserve the remaining history.'],
    question: 'How can the editor add and remove the newest command in constant time without losing access to older undo records?',
  },
  prediction: {
    question: 'During push, why must new.next be assigned to top before top moves to new?',
    options: [
      { id: 'preserve', label: 'It preserves the only path to every older stack item.' },
      { id: 'sort', label: 'It sorts commands by their numeric value.' },
      { id: 'copy', label: 'It copies every existing stack node.' },
      { id: 'tail', label: 'It makes the oldest item the new top.' },
    ],
    correctOptionId: 'preserve',
    hint: 'After top changes, which reference still needs to lead to the old top?',
    explanation: 'The old top is the entry point to the complete older stack. Storing it in new.next first keeps that chain reachable after top is redirected to new.',
  } satisfies PredictionCheckpointDefinition,
} as const
