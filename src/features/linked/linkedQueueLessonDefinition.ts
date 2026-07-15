import type { PredictionCheckpointDefinition } from '../learning/PredictionCheckpoint'

export const linkedQueueLesson = {
  slug: 'queue-enqueue-dequeue', title: 'Queue Enqueue & Dequeue', lessonLabel: 'LESSON 03.05', duration: '12 MIN', tagline: 'Add at rear. Remove at front. Keep two boundaries so neither operation scans the waiting line.', timeComplexity: 'O(1)', spaceComplexity: 'O(1)',
  problem: {
    title: 'Dispatch support requests fairly',
    scenario: 'A support service processes ordinary requests in arrival order. New tickets join the back of a linked queue, while the dispatcher removes the oldest ticket from the front.',
    constraints: ['Arrival order must be preserved.', 'Neither insertion nor removal may scan the queue.', 'The empty state must keep front and rear consistent.'],
    question: 'Which references let the dispatcher accept and serve tickets in constant time while preserving first-in, first-out order?',
  },
  prediction: {
    question: 'During enqueue, why must rear.next point to new before rear moves to new?',
    options: [
      { id: 'attach', label: 'It attaches the new node to the reachable queue before changing the rear boundary.' },
      { id: 'front', label: 'It moves front to the newest request.' },
      { id: 'sort', label: 'It sorts tickets by their numeric code.' },
      { id: 'scan', label: 'It forces a traversal from front to rear.' },
    ],
    correctOptionId: 'attach',
    hint: 'If rear moves first, which node still has a reference that can attach new to the existing chain?',
    explanation: 'The old rear is the current tail of the reachable queue. Linking oldRear.next to new first attaches the node; then moving rear records the new tail boundary.',
  } satisfies PredictionCheckpointDefinition,
} as const
