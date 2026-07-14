import { SortLesson, type LessonComponentProps } from './SortLesson'
import { bubbleSortLesson } from './lessonDefinitions'

export function BubbleSortLesson(props: LessonComponentProps) {
  return <SortLesson definition={bubbleSortLesson} {...props} />
}
