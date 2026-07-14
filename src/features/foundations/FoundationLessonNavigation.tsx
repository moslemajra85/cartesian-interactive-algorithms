import type { LessonComponentProps } from '../sorting/SortLesson'

type FoundationLessonNavigationProps = Pick<LessonComponentProps, 'lessons' | 'onBack' | 'onOpenLesson'> & {
  currentSlug: string
  title: string
}

export function FoundationLessonNavigation({
  currentSlug,
  title,
  lessons,
  onBack,
  onOpenLesson,
}: FoundationLessonNavigationProps) {
  return (
    <>
      <div className="lesson-crumbs">
        <button type="button" onClick={onBack}>← Lesson catalogue</button>
        <span>/</span><span>The Foundations</span><span>/</span><strong>{title}</strong>
      </div>

      <nav className="lesson-switcher" aria-label="Foundation lessons">
        {lessons.map((lesson) => (
          <button
            className={`${lesson.slug === currentSlug ? 'is-current' : ''} ${lesson.completed ? 'is-complete' : ''}`.trim()}
            type="button"
            onClick={() => onOpenLesson(lesson.slug)}
            aria-current={lesson.slug === currentSlug ? 'page' : undefined}
            aria-label={`${lesson.label}${lesson.completed ? ', completed' : ''}`}
            key={lesson.slug}
          >
            {lesson.label}
            {lesson.completed && <span className="lesson-check" aria-hidden="true">✓</span>}
          </button>
        ))}
      </nav>
    </>
  )
}
