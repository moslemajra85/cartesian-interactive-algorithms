import { SortLesson, type LessonComponentProps } from './SortLesson'
import { insertionSortLesson } from './lessonDefinitions'

export function InsertionSortLesson(props: LessonComponentProps) {
  return <SortLesson definition={insertionSortLesson} {...props} />
}
