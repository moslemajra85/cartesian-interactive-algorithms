import type { LessonCatalogEntry, LessonSlug } from './curriculum'

type LessonCatalogueProps = {
  lessons: readonly LessonCatalogEntry[]
  completedLessonSlugs: readonly string[]
  lastLessonSlug: string | null
  onBack: () => void
  onOpenLesson: (slug: LessonSlug) => void
}

export function LessonCatalogue({ lessons, completedLessonSlugs, lastLessonSlug, onBack, onOpenLesson }: LessonCatalogueProps) {
  const completedCount = lessons.filter((lesson) => completedLessonSlugs.includes(lesson.definition.slug)).length
  const progress = Math.round((completedCount / lessons.length) * 100)

  return (
    <main className="catalogue-page">
      <div className="lesson-crumbs">
        <button type="button" onClick={onBack}>← Learning path</button>
        <span>/</span><strong>Arrays & Sorting</strong>
      </div>

      <section className="catalogue-heading">
        <div>
          <p className="eyebrow"><span /> CHAPTER 02 · LESSON CATALOGUE</p>
          <h1 data-route-heading tabIndex={-1}>Arrays &amp; Sorting</h1>
          <p>Compare four ways to create order, then inspect every decision at your own pace.</p>
        </div>
        <div className="catalogue-progress" aria-label={`${completedCount} of ${lessons.length} lessons complete`}>
          <span>{String(completedCount).padStart(2, '0')} / {String(lessons.length).padStart(2, '0')}</span>
          <strong>{progress}%</strong>
          <i><b style={{ width: `${progress}%` }} /></i>
        </div>
      </section>

      <section className="lesson-catalogue-grid" aria-label="Sorting lessons">
        {lessons.map((lesson) => {
          const { definition } = lesson
          const completed = completedLessonSlugs.includes(definition.slug)
          const isResume = lastLessonSlug === definition.slug && !completed
          const action = completed ? 'Review' : isResume ? 'Continue' : 'Start'

          return (
            <article className={`lesson-catalogue-card ${completed ? 'is-complete' : ''}`} key={definition.slug}>
              <div className="catalogue-card-top">
                <span>LESSON 02.{lesson.order}</span>
                {completed && <i>✓ COMPLETE</i>}
              </div>
              <div>
                <h2>{definition.title}</h2>
                <p>{definition.tagline}</p>
              </div>
              <dl>
                <div><dt>TIME</dt><dd>{definition.timeComplexity}</dd></div>
                <div><dt>SPACE</dt><dd>{definition.spaceComplexity}</dd></div>
                <div><dt>LENGTH</dt><dd>{definition.duration}</dd></div>
              </dl>
              <button type="button" onClick={() => onOpenLesson(definition.slug)}>
                {action} {definition.title} <span aria-hidden="true">→</span>
              </button>
            </article>
          )
        })}
      </section>

      <aside className="catalogue-note">
        <span>LEARNING NOTE</span>
        <p>These algorithms share the same goal but make different decisions. Focus on each lesson’s invariant—the fact that remains true after every pass.</p>
      </aside>
    </main>
  )
}
