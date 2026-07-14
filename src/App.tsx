import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import { LessonCatalogue } from './features/catalog/LessonCatalogue'
import { NotFoundScreen } from './features/catalog/NotFoundScreen'
import {
  chapterCatalog,
  findChapter,
  findLesson,
  isLessonSlug,
  lessonCatalog,
  lessonSlugs,
  type ChapterDefinition,
  type ChapterId,
} from './features/catalog/curriculum'
import { hashForRoute, routeFromHash, titleForRoute, type AppRoute } from './features/catalog/routing'
import {
  clearLearningProgress,
  createEmptyProgress,
  loadLearningProgress,
  recordLessonCompletion,
  recordLessonVisit,
  saveLearningProgress,
} from './features/progress/learningProgress'
import type { LessonLink } from './features/sorting/SortLesson'

const availableLessons: LessonLink[] = [
  ...lessonCatalog.map((lesson) => ({
    slug: lesson.definition.slug,
    label: `${lesson.order} · ${lesson.definition.title}`,
  })),
]

function loadBrowserProgress() {
  try {
    return loadLearningProgress(window.localStorage, lessonSlugs)
  } catch {
    return createEmptyProgress()
  }
}

type ChapterView = ChapterDefinition & {
  lessons: number
  progress: number
  status: 'current' | 'completed' | 'locked'
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className={`menu-icon ${open ? 'is-open' : ''}`} aria-hidden="true">
      <i />
      <i />
    </span>
  )
}

function BookMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 44 44" aria-hidden="true">
      <path d="M8 8.5c6.8 0 11 2 14 6.2 3-4.2 7.2-6.2 14-6.2v26c-6.8 0-11 1-14 4-3-3-7.2-4-14-4z" />
      <path d="M22 15v23.5" />
      <circle cx="13" cy="16" r="1.5" />
      <circle cx="31" cy="16" r="1.5" />
    </svg>
  )
}

function HeroIllustration() {
  return (
    <div className="hero-illustration" aria-label="An animated array becoming sorted">
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="grid-paper" />
      <span className="float-symbol symbol-one">{'{ }'}</span>
      <span className="float-symbol symbol-two">O(n)</span>
      <span className="float-symbol symbol-three">→</span>
      <div className="array-stage">
        <span className="array-label">input</span>
        <div className="array-bars" aria-hidden="true">
          {[46, 76, 32, 62, 88, 52].map((height, index) => (
            <div
              className={`array-bar bar-${index + 1}`}
              style={{ '--bar-height': `${height}%` } as React.CSSProperties}
              key={height}
            >
              <span>{[4, 7, 2, 5, 9, 3][index]}</span>
            </div>
          ))}
        </div>
        <div className="stage-caption">
          <span className="pulse-dot" />
          Sorting is thinking made visible
        </div>
      </div>
    </div>
  )
}

function ChapterCard({ chapter, onOpen }: { chapter: ChapterView; onOpen: () => void }) {
  const action = chapter.status === 'locked'
    ? 'Coming in a future milestone'
    : chapter.progress === 100 ? 'Review chapter'
    : chapter.progress ? 'Continue chapter'
    : 'Start chapter'

  return (
    <article className={`chapter-card tone-${chapter.tone}`}>
      <div className="chapter-card-top">
        <span className="chapter-number">CHAPTER {chapter.number}</span>
        {chapter.status === 'current' && <span className="status-pill">In progress</span>}
        {chapter.status === 'completed' && <span className="status-pill is-complete">Complete</span>}
        {chapter.status === 'locked' && <span className="lock-mark" aria-label="Locked">◇</span>}
      </div>
      <div>
        <h3>{chapter.title}</h3>
        <p>{chapter.description}</p>
      </div>
      <div className="chapter-meta">
        <span>{chapter.lessons} lessons</span>
        <span>{chapter.progress}%</span>
      </div>
      <div className="progress-track" aria-label={`${chapter.progress}% complete`}>
        <span style={{ width: `${chapter.progress}%` }} />
      </div>
      <button className="card-link" type="button" disabled={chapter.status === 'locked'} onClick={chapter.status !== 'locked' ? onOpen : undefined} aria-label={`${action}: ${chapter.title}`}>
        {action}
        <span aria-hidden="true">→</span>
      </button>
    </article>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [route, setRoute] = useState<AppRoute>(() => routeFromHash(window.location.hash))
  const [progress, setProgress] = useState(loadBrowserProgress)
  const shouldFocusRoute = useRef(false)
  const searchButtonRef = useRef<HTMLButtonElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const completedLessonCount = progress.completedLessonSlugs.length
  const chaptersWithProgress: ChapterView[] = chapterCatalog.map((chapter) => {
    const chapterLessons = lessonCatalog.filter((lesson) => lesson.chapterId === chapter.id)
    const chapterCompletedCount = chapterLessons.filter((lesson) => progress.completedLessonSlugs.includes(lesson.definition.slug)).length
    const chapterProgress = chapterLessons.length ? Math.round((chapterCompletedCount / chapterLessons.length) * 100) : 0

    return {
      ...chapter,
      lessons: chapter.availability === 'available' ? chapterLessons.length : chapter.plannedLessonCount,
      progress: chapterProgress,
      status: chapter.availability === 'locked'
        ? 'locked'
        : chapterProgress === 100 ? 'completed' : 'current',
    }
  })
  const lastUnfinishedLesson = progress.lastLessonSlug
    && !progress.completedLessonSlugs.includes(progress.lastLessonSlug)
    ? availableLessons.find((lesson) => lesson.slug === progress.lastLessonSlug)
    : null
  const nextLesson = lastUnfinishedLesson
    ?? availableLessons.find((lesson) => !progress.completedLessonSlugs.includes(lesson.slug))
    ?? availableLessons.at(-1)!
  const currentLesson = route.kind === 'lesson' ? findLesson(route.slug) : undefined
  const CurrentLesson = currentLesson?.component
  const currentChapterLessons = currentLesson
    ? lessonCatalog
      .filter((lesson) => lesson.chapterId === currentLesson.chapterId)
      .map((lesson) => ({
        slug: lesson.definition.slug,
        label: `${lesson.order} · ${lesson.definition.title}`,
        completed: progress.completedLessonSlugs.includes(lesson.definition.slug),
      }))
    : []
  const selectedChapter = route.kind === 'catalogue' ? findChapter(route.chapterId) : undefined
  const selectedChapterLessons = route.kind === 'catalogue'
    ? lessonCatalog.filter((lesson) => lesson.chapterId === route.chapterId)
    : []
  const normalizedSearchQuery = searchQuery.trim().toLowerCase()
  const searchResults = lessonCatalog.filter(({ definition }) => (
    !normalizedSearchQuery
    || definition.title.toLowerCase().includes(normalizedSearchQuery)
    || definition.tagline.toLowerCase().includes(normalizedSearchQuery)
  ))

  useEffect(() => {
    try {
      saveLearningProgress(window.localStorage, progress)
    } catch {
      // The app remains usable when browser storage is unavailable.
    }
  }, [progress])

  useEffect(() => {
    if (route.kind !== 'lesson') return
    setProgress((current) => current.lastLessonSlug === route.slug
      ? current
      : recordLessonVisit(current, route.slug))
  }, [route])

  const navigate = (nextRoute: Exclude<AppRoute, { kind: 'not-found' }>) => {
    shouldFocusRoute.current = true
    setRoute(nextRoute)
    const hash = hashForRoute(nextRoute)
    window.history.pushState(null, '', hash || `${window.location.pathname}${window.location.search}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openLesson = (requestedSlug: string) => {
    if (isLessonSlug(requestedSlug)) {
      setSearchOpen(false)
      navigate({ kind: 'lesson', slug: requestedSlug })
    }
  }

  const openCatalogue = (chapterId: ChapterId) => navigate({ kind: 'catalogue', chapterId })
  const openHome = () => navigate({ kind: 'home' })

  const completeLesson = useCallback((slug: string) => {
    setProgress((current) => recordLessonCompletion(current, slug))
  }, [])

  const resetProgress = () => {
    if (!window.confirm('Reset all locally saved Cartesian lesson progress?')) return
    try {
      clearLearningProgress(window.localStorage)
    } catch {
      // State is still reset even when browser storage is unavailable.
    }
    setProgress(createEmptyProgress())
  }

  const openSearch = () => {
    setMenuOpen(false)
    setSearchQuery('')
    setSearchOpen(true)
  }

  const closeSearch = (restoreFocus = true) => {
    setSearchOpen(false)
    if (restoreFocus) window.setTimeout(() => searchButtonRef.current?.focus(), 0)
  }

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (searchOpen) closeSearch()
        setMenuOpen(false)
        return
      }

      const target = event.target
      const hasInteractiveFocus = target instanceof Element
        && target.closest('button, a, input, textarea, select, [contenteditable="true"]') !== null
      if (hasInteractiveFocus || event.ctrlKey || event.metaKey || event.altKey) return

      if (event.key.toLowerCase() === 'm') {
        setSearchOpen(false)
        setMenuOpen((current) => !current)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [searchOpen])

  useEffect(() => {
    document.title = titleForRoute(route)
    if (!shouldFocusRoute.current) return

    document.querySelector<HTMLElement>('[data-route-heading]')?.focus({ preventScroll: true })
    shouldFocusRoute.current = false
  }, [route])

  useEffect(() => {
    const onHistoryChange = () => {
      shouldFocusRoute.current = true
      setRoute(routeFromHash(window.location.hash))
    }
    window.addEventListener('popstate', onHistoryChange)
    window.addEventListener('hashchange', onHistoryChange)
    return () => {
      window.removeEventListener('popstate', onHistoryChange)
      window.removeEventListener('hashchange', onHistoryChange)
    }
  }, [])

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Cartesian home" onClick={(event) => { event.preventDefault(); openHome() }}>
          <BookMark />
          <span>
            <strong>Cartesian</strong>
            <small>Interactive algorithms</small>
          </span>
        </a>

        <nav className="top-actions" aria-label="Primary navigation">
          <span className="progress-copy"><b>{completedLessonCount}</b> of {availableLessons.length} lessons</span>
          <button
            className="icon-button"
            type="button"
            aria-label="Search lessons"
            aria-expanded={searchOpen}
            aria-controls="lesson-search"
            onClick={searchOpen ? () => closeSearch() : openSearch}
            ref={searchButtonRef}
          >
            <span aria-hidden="true">⌕</span>
          </button>
          <button
            className="menu-button"
            type="button"
            aria-label="Chapters"
            onClick={() => {
              setSearchOpen(false)
              setMenuOpen((current) => !current)
            }}
            aria-expanded={menuOpen}
            aria-controls="chapter-menu"
          >
            <MenuIcon open={menuOpen} />
            <span>Chapters</span>
            <kbd>M</kbd>
          </button>
        </nav>
      </header>

      {searchOpen && (
        <section id="lesson-search" className="lesson-search" aria-label="Search lessons">
          <div className="lesson-search-heading">
            <div>
              <span>FIND A LESSON</span>
              <strong>What do you want to understand?</strong>
            </div>
            <button type="button" onClick={() => closeSearch()} aria-label="Close lesson search">×</button>
          </div>
          <label htmlFor="lesson-search-input">Search by algorithm or idea</label>
          <input
            id="lesson-search-input"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Try “merge” or “search”"
            autoComplete="off"
            ref={searchInputRef}
          />
          {searchResults.length > 0 ? (
            <ul aria-label="Matching lessons">
              {searchResults.map(({ order, definition }) => (
                <li key={definition.slug}>
                  <button type="button" onClick={() => openLesson(definition.slug)}>
                    <span>{order}</span>
                    <span><strong>{definition.title}</strong><small>{definition.tagline}</small></span>
                    <i aria-hidden="true">→</i>
                  </button>
                </li>
              ))}
            </ul>
          ) : <p role="status">No lesson matches “{searchQuery.trim()}”.</p>}
        </section>
      )}
      {searchOpen && <button className="search-backdrop" type="button" aria-label="Close lesson search" onClick={() => closeSearch()} />}

      <aside id="chapter-menu" className={`chapter-drawer ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="drawer-heading">
          <span>Table of contents</span>
          <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close chapter menu">×</button>
        </div>
        <ol>
          {chaptersWithProgress.map((chapter) => (
            <li key={chapter.id}>
              <button
                type="button"
                disabled={chapter.status === 'locked'}
                onClick={chapter.availability === 'available' ? () => {
                  setMenuOpen(false)
                  openCatalogue(chapter.id)
                } : undefined}
              >
                <span>{chapter.number}</span>
                <strong>{chapter.shortTitle}</strong>
                <i>{chapter.progress ? `${chapter.progress}%` : chapter.status === 'locked' ? 'Locked' : 'New'}</i>
              </button>
            </li>
          ))}
        </ol>
        <div className="drawer-progress-actions">
          <span>Progress is saved on this device.</span>
          <button type="button" onClick={resetProgress} disabled={completedLessonCount === 0 && !progress.lastLessonSlug}>Reset progress</button>
        </div>
      </aside>
      {menuOpen && <button className="drawer-backdrop" type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}

      {CurrentLesson ? (
        <CurrentLesson
          lessons={currentChapterLessons}
          onBack={() => openCatalogue(currentLesson.chapterId)}
          onOpenLesson={openLesson}
          onCompleteLesson={completeLesson}
        />
      ) : route.kind === 'catalogue' && selectedChapter ? (
        <LessonCatalogue
          chapter={selectedChapter}
          lessons={selectedChapterLessons}
          completedLessonSlugs={progress.completedLessonSlugs}
          lastLessonSlug={progress.lastLessonSlug}
          onBack={openHome}
          onOpenLesson={openLesson}
        />
      ) : route.kind === 'not-found' ? (
        <NotFoundScreen requestedPath={route.requestedPath} onOpenCatalogue={() => openCatalogue('arrays')} onOpenHome={openHome} />
      ) : <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow"><span /> THE INTERACTIVE HANDBOOK</p>
            <h1 data-route-heading tabIndex={-1}>Don’t just learn algorithms. <em>Watch them think.</em></h1>
            <p className="hero-intro">
              Build intuition through visual stories, hands-on experiments, and problems that teach you how to reason—not what to memorize.
            </p>
            <div className="hero-actions">
              <button className="primary-action" type="button" onClick={() => openLesson(nextLesson.slug)}>
                {completedLessonCount ? 'Continue learning' : 'Start learning'} <span aria-hidden="true">→</span>
              </button>
              <span className="resume-note">
                <b>{lastUnfinishedLesson ? 'Resume' : completedLessonCount === availableLessons.length ? 'Review' : 'Up next'}</b>
                {nextLesson.label.replace(/^\d+ · /, '')}
              </span>
            </div>
          </div>
          <HeroIllustration />
        </section>

        <section className="learning-path" aria-labelledby="path-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow"><span /> YOUR LEARNING PATH</p>
              <h2 id="path-title">From first principles to graph thinking.</h2>
            </div>
            <p>Five connected chapters. Forty-five visual lessons. One stronger problem-solving mind.</p>
          </div>
          <div className="chapter-grid">
            {chaptersWithProgress.map((chapter) => <ChapterCard chapter={chapter} onOpen={() => openCatalogue(chapter.id)} key={chapter.id} />)}
          </div>
        </section>

        <section className="principles" aria-label="Learning principles">
          <div><span>01</span><strong>See the idea</strong><p>Every concept begins with a visual mental model.</p></div>
          <div><span>02</span><strong>Control the pace</strong><p>Pause, step, rewind, and inspect every decision.</p></div>
          <div><span>03</span><strong>Prove you understand</strong><p>Predict the next step before the animation reveals it.</p></div>
        </section>
      </main>}

      <footer>
        <a className="brand footer-brand" href="#top" onClick={(event) => { event.preventDefault(); openHome() }}><BookMark /><strong>Cartesian</strong></a>
        <p>Learn the shape of a solution.</p>
        <span>Built for curious problem solvers.</span>
      </footer>
    </div>
  )
}

export default App
