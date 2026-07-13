import { SortLesson, type LessonLink, type SortLessonDefinition } from './SortLesson'
import { createSelectionSortSteps } from './selectionSort'

const selectionSortLesson: SortLessonDefinition = {
  slug: 'selection-sort',
  title: 'Selection Sort',
  lessonLabel: 'LESSON 02.04',
  duration: '9 MIN',
  tagline: 'Find the smallest. Put it next. Grow a sorted region from left to right.',
  timeComplexity: 'O(n²)',
  spaceComplexity: 'O(1)',
  initialValues: [7, 3, 9, 2, 6, 4],
  createSteps: createSelectionSortSteps,
  codeLines: [
    'selectionSort(values)',
    '  for start from 0 to last index - 1',
    '    minimum = start',
    '    compare each remaining value to minimum',
    '      update minimum when a smaller value appears',
    '    swap values[start] with values[minimum]',
    '    mark values[start] as sorted',
    '  return values',
  ],
  insight: 'Selection Sort performs at most one swap per pass. It spends its work searching, then places the chosen value directly into position.',
  conceptTitle: 'Each position earns a proof.',
  conceptExplanation: 'Before filling an index, Selection Sort inspects every remaining candidate. The chosen minimum therefore cannot be improved by any value to its right.',
}

type SelectionSortLessonProps = {
  lessons: LessonLink[]
  onBack: () => void
  onOpenLesson: (slug: string) => void
  onCompleteLesson: (slug: string) => void
}

export function SelectionSortLesson(props: SelectionSortLessonProps) {
  return <SortLesson definition={selectionSortLesson} {...props} />
}
