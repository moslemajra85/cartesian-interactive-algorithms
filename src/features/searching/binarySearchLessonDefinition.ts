import type { PredictionCheckpointDefinition } from '../learning/PredictionCheckpoint'

type BinarySearchLessonDefinition = {
  slug: 'binary-search'
  title: string
  lessonLabel: string
  duration: string
  tagline: string
  timeComplexity: string
  spaceComplexity: string
  initialValues: number[]
  initialTarget: number
  codeLines: string[]
  insight: string
  conceptTitle: string
  conceptExplanation: string
  prediction: PredictionCheckpointDefinition
}

export const binarySearchLesson = {
  slug: 'binary-search',
  title: 'Binary Search',
  lessonLabel: 'LESSON 02.07',
  duration: '9 MIN',
  tagline: 'Inspect the middle. Trust the order. Eliminate half the possibilities at every decision.',
  timeComplexity: 'O(log n)',
  spaceComplexity: 'O(1)',
  initialValues: [2, 5, 8, 12, 16, 21, 27, 33],
  initialTarget: 21,
  codeLines: [
    'binarySearch(values, target)',
    '  low = 0; high = last index',
    '  while low <= high: inspect middle',
    '    if values[middle] == target: return middle',
    '    if values[middle] < target: low = middle + 1',
    '    else: high = middle - 1',
    '  return not found',
  ],
  insight: 'Binary Search does not merely move faster through the array. Ordering gives each midpoint comparison proof that an entire half cannot contain the target.',
  conceptTitle: 'Order turns one comparison into many eliminations.',
  conceptExplanation: 'At every step, the midpoint divides the candidate interval. If its value is too small, everything to its left is also too small. If it is too large, everything to its right is also too large. The remaining problem is at most half the size.',
  prediction: {
    question: 'Why can Binary Search safely discard an entire half after one midpoint comparison?',
    options: [
      { id: 'array-ordered', label: 'Because the array is ordered.' },
      { id: 'middle-average', label: 'Because the midpoint value is always the array average.' },
      { id: 'unique-values', label: 'Because every value must be unique.' },
      { id: 'target-present', label: 'Because the target is guaranteed to exist.' },
    ],
    correctOptionId: 'array-ordered',
    hint: 'If the midpoint is smaller than the target, what does ordering prove about every earlier value?',
    explanation: 'Ordering means all values left of the midpoint are no larger and all values right of it are no smaller. The comparison therefore rules out one complete side.',
  },
} satisfies BinarySearchLessonDefinition
