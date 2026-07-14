import { SortLesson, type LessonComponentProps } from './SortLesson'
import { mergeSortLesson } from './lessonDefinitions'

export function MergeSortLesson(props: LessonComponentProps) {
  return <SortLesson definition={mergeSortLesson} {...props} />
}
