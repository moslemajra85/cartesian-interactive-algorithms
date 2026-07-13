import { SortLesson, type LessonLink, type SortLessonDefinition } from './SortLesson'
import { createBubbleSortSteps } from './bubbleSort'

const bubbleSortLesson: SortLessonDefinition = {
  slug: 'bubble-sort',
  title: 'Bubble Sort',
  lessonLabel: 'LESSON 02.03',
  duration: '8 MIN',
  tagline: 'Compare neighbors. Swap disorder. Repeat until every value finds its place.',
  timeComplexity: 'O(n²)',
  spaceComplexity: 'O(1)',
  initialValues: [7, 3, 9, 2, 6, 4],
  createSteps: createBubbleSortSteps,
  codeLines: [
    'bubbleSort(values)',
    '  for end from last index down to 1',
    '    for left from 0 up to end - 1',
    '      if values[left] > values[left + 1]',
    '        swap(values[left], values[left + 1])',
    '    mark values[end] as sorted',
    '  return values',
  ],
  insight: 'After every pass, at least one value reaches its final position. That shrinks the unsorted region from the right.',
  conceptTitle: 'The largest value has nowhere to hide.',
  conceptExplanation: 'Every comparison pushes the larger neighbor one position to the right. A complete pass therefore carries the largest unsorted value all the way to the boundary.',
}

type BubbleSortLessonProps = {
  lessons: LessonLink[]
  onBack: () => void
  onOpenLesson: (slug: string) => void
  onCompleteLesson: (slug: string) => void
}

export function BubbleSortLesson(props: BubbleSortLessonProps) {
  return <SortLesson definition={bubbleSortLesson} {...props} />
}
