import { SortLesson, type LessonLink, type SortLessonDefinition } from './SortLesson'
import { createInsertionSortSteps } from './insertionSort'

const insertionSortLesson: SortLessonDefinition = {
  slug: 'insertion-sort',
  title: 'Insertion Sort',
  lessonLabel: 'LESSON 02.05',
  duration: '9 MIN',
  tagline: 'Pick the next value. Slide it left. Grow an ordered region one insertion at a time.',
  timeComplexity: 'O(n²)',
  spaceComplexity: 'O(1)',
  initialValues: [7, 3, 9, 2, 6, 4],
  createSteps: createInsertionSortSteps,
  codeLines: [
    'insertionSort(values)',
    '  for current from 1 to last index',
    '    position = current',
    '    while value < its left neighbor',
    '      swap value one position left',
    '    mark prefix through current as ordered',
    '  return values',
  ],
  insight: 'Insertion Sort is adaptive. When values are already close to their correct positions, the inner loop stops early and performs very little movement.',
  conceptTitle: 'Order grows from what you already know.',
  conceptExplanation: 'Before each pass, the prefix is ordered. Moving the next value left until its neighbor is no larger restores that invariant for a prefix that is one element longer.',
  prediction: {
    question: 'When can Insertion Sort stop moving the current value left?',
    options: [
      { id: 'original-index', label: 'When it returns to its original index.' },
      { id: 'right-scanned', label: 'After every value to its right has been inspected.' },
      { id: 'left-not-larger', label: 'When its left neighbor is no larger, or it reaches index zero.' },
      { id: 'maximum-found', label: 'When the largest value in the array has been found.' },
    ],
    correctOptionId: 'left-not-larger',
    hint: 'The prefix was already ordered before insertion. What local comparison proves the new value fits?',
    explanation: 'Once the left neighbor is no larger, everything further left is also no larger because the prefix is ordered. The value has reached a valid insertion point.',
  },
}

type InsertionSortLessonProps = {
  lessons: LessonLink[]
  onBack: () => void
  onOpenLesson: (slug: string) => void
  onCompleteLesson: (slug: string) => void
}

export function InsertionSortLesson(props: InsertionSortLessonProps) {
  return <SortLesson definition={insertionSortLesson} {...props} />
}
