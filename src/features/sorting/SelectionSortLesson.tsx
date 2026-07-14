import { SortLesson, type LessonComponentProps } from './SortLesson'
import { selectionSortLesson } from './lessonDefinitions'

export function SelectionSortLesson(props: LessonComponentProps) {
  return <SortLesson definition={selectionSortLesson} {...props} />
}
