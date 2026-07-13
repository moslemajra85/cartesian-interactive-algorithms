import { useCallback, useEffect, useState } from 'react'
import './App.css'
import {
  clearLearningProgress,
  createEmptyProgress,
  loadLearningProgress,
  recordLessonCompletion,
  recordLessonVisit,
  saveLearningProgress,
} from './features/progress/learningProgress'
import { BubbleSortLesson } from './features/sorting/BubbleSortLesson'
import { InsertionSortLesson } from './features/sorting/InsertionSortLesson'
import { SelectionSortLesson } from './features/sorting/SelectionSortLesson'
import type { LessonLink } from './features/sorting/SortLesson'

type LessonSlug = 'bubble-sort' | 'selection-sort' | 'insertion-sort'
type Screen = 'home' | LessonSlug

const sortingLessons: LessonLink[] = [
  { slug: 'bubble-sort', label: '03 · Bubble Sort' },
  { slug: 'selection-sort', label: '04 · Selection Sort' },
  { slug: 'insertion-sort', label: '05 · Insertion Sort' },
]

const sortingLessonSlugs = sortingLessons.map((lesson) => lesson.slug)

function loadBrowserProgress() {
  try {
    return loadLearningProgress(window.localStorage, sortingLessonSlugs)
  } catch {
    return createEmptyProgress()
  }
}

function screenFromHash(): Screen {
  const slug = window.location.hash.slice(1)
  return sortingLessons.some((lesson) => lesson.slug === slug) ? slug as LessonSlug : 'home'
}

type Chapter = {
  id: string
  number: string
  title: string
  shortTitle: string
  description: string
  lessons: number
  progress: number
  tone: 'coral' | 'blue' | 'gold' | 'violet'
  status?: 'current' | 'completed' | 'locked'
}

const chapters: Chapter[] = [
  {
    id: 'foundations',
    number: '01',
    title: 'The Foundations',
    shortTitle: 'Foundations',
    description: 'Build the mental models behind efficient problem solving.',
    lessons: 6,
    progress: 0,
    tone: 'gold',
    status: 'locked',
  },
  {
    id: 'arrays',
    number: '02',
    title: 'Arrays & Sorting',
    shortTitle: 'Arrays & Sorting',
    description: 'See data move, compare, and settle into order.',
    lessons: 3,
    progress: 0,
    tone: 'coral',
    status: 'current',
  },
  {
    id: 'linked-lists',
    number: '03',
    title: 'Linked Structures',
    shortTitle: 'Linked Structures',
    description: 'Follow references through lists, stacks, and queues.',
    lessons: 8,
    progress: 0,
    tone: 'blue',
    status: 'locked',
  },
  {
    id: 'trees',
    number: '04',
    title: 'Trees & Heaps',
    shortTitle: 'Trees & Heaps',
    description: 'Explore hierarchical data one branch at a time.',
    lessons: 12,
    progress: 0,
    tone: 'violet',
    status: 'locked',
  },
  {
    id: 'graphs',
    number: '05',
    title: 'Graphs',
    shortTitle: 'Graphs',
    description: 'Navigate networks, paths, cycles, and connections.',
    lessons: 14,
    progress: 0,
    tone: 'gold',
    status: 'locked',
  },
]

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

function ChapterCard({ chapter, onOpen }: { chapter: Chapter; onOpen: () => void }) {
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
      <button className="card-link" type="button" disabled={chapter.status === 'locked'} onClick={chapter.id === 'arrays' ? onOpen : undefined}>
        {chapter.status === 'locked' ? 'Coming in a future milestone' : chapter.progress === 100 ? 'Review chapter' : chapter.progress ? 'Continue chapter' : 'Start chapter'}
        <span aria-hidden="true">→</span>
      </button>
    </article>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [screen, setScreen] = useState<Screen>(screenFromHash)
  const [progress, setProgress] = useState(loadBrowserProgress)
  const completedLessonCount = progress.completedLessonSlugs.length
  const sortingProgress = Math.round((completedLessonCount / sortingLessons.length) * 100)
  const chaptersWithProgress = chapters.map((chapter) => chapter.id === 'arrays'
    ? { ...chapter, progress: sortingProgress, status: sortingProgress === 100 ? 'completed' as const : 'current' as const }
    : chapter)
  const lessonsWithProgress = sortingLessons.map((lesson) => ({
    ...lesson,
    completed: progress.completedLessonSlugs.includes(lesson.slug),
  }))
  const lastUnfinishedLesson = progress.lastLessonSlug
    && !progress.completedLessonSlugs.includes(progress.lastLessonSlug)
    ? sortingLessons.find((lesson) => lesson.slug === progress.lastLessonSlug)
    : null
  const nextLesson = lastUnfinishedLesson
    ?? sortingLessons.find((lesson) => !progress.completedLessonSlugs.includes(lesson.slug))
    ?? sortingLessons.at(-1)!

  useEffect(() => {
    try {
      saveLearningProgress(window.localStorage, progress)
    } catch {
      // The app remains usable when browser storage is unavailable.
    }
  }, [progress])

  useEffect(() => {
    if (screen === 'home') return
    setProgress((current) => current.lastLessonSlug === screen
      ? current
      : recordLessonVisit(current, screen))
  }, [screen])

  const openLesson = (requestedSlug: string = 'bubble-sort') => {
    const slug = sortingLessons.some((lesson) => lesson.slug === requestedSlug) ? requestedSlug as LessonSlug : 'bubble-sort'
    setScreen(slug)
    window.history.pushState(null, '', `#${slug}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openHome = () => {
    setScreen('home')
    window.history.pushState(null, '', window.location.pathname)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'm') setMenuOpen((current) => !current)
      if (event.key === 'Escape') setMenuOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    const onHistoryChange = () => setScreen(screenFromHash())
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
        <a className="brand" href="#top" aria-label="Cartesian home" onClick={openHome}>
          <BookMark />
          <span>
            <strong>Cartesian</strong>
            <small>Interactive algorithms</small>
          </span>
        </a>

        <nav className="top-actions" aria-label="Primary navigation">
          <span className="progress-copy"><b>{completedLessonCount}</b> of {sortingLessons.length} lessons</span>
          <button className="icon-button" type="button" aria-label="Open search">
            <span aria-hidden="true">⌕</span>
          </button>
          <button
            className="menu-button"
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-expanded={menuOpen}
            aria-controls="chapter-menu"
          >
            <MenuIcon open={menuOpen} />
            <span>Chapters</span>
            <kbd>M</kbd>
          </button>
        </nav>
      </header>

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
                onClick={chapter.id === 'arrays' ? () => {
                  setMenuOpen(false)
                  openLesson(nextLesson.slug)
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

      {screen === 'bubble-sort' ? (
        <BubbleSortLesson lessons={lessonsWithProgress} onBack={openHome} onOpenLesson={openLesson} onCompleteLesson={completeLesson} />
      ) : screen === 'selection-sort' ? (
        <SelectionSortLesson lessons={lessonsWithProgress} onBack={openHome} onOpenLesson={openLesson} onCompleteLesson={completeLesson} />
      ) : screen === 'insertion-sort' ? (
        <InsertionSortLesson lessons={lessonsWithProgress} onBack={openHome} onOpenLesson={openLesson} onCompleteLesson={completeLesson} />
      ) : <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow"><span /> THE INTERACTIVE HANDBOOK</p>
            <h1>Don’t just learn algorithms. <em>Watch them think.</em></h1>
            <p className="hero-intro">
              Build intuition through visual stories, hands-on experiments, and problems that teach you how to reason—not what to memorize.
            </p>
            <div className="hero-actions">
              <button className="primary-action" type="button" onClick={() => openLesson(nextLesson.slug)}>
                {completedLessonCount ? 'Continue learning' : 'Start learning'} <span aria-hidden="true">→</span>
              </button>
              <span className="resume-note">
                <b>{lastUnfinishedLesson ? 'Resume' : completedLessonCount === sortingLessons.length ? 'Review' : 'Up next'}</b>
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
            <p>Five connected chapters. Forty-nine visual lessons. One stronger problem-solving mind.</p>
          </div>
          <div className="chapter-grid">
            {chaptersWithProgress.map((chapter) => <ChapterCard chapter={chapter} onOpen={() => openLesson(nextLesson.slug)} key={chapter.id} />)}
          </div>
        </section>

        <section className="principles" aria-label="Learning principles">
          <div><span>01</span><strong>See the idea</strong><p>Every concept begins with a visual mental model.</p></div>
          <div><span>02</span><strong>Control the pace</strong><p>Pause, step, rewind, and inspect every decision.</p></div>
          <div><span>03</span><strong>Prove you understand</strong><p>Predict the next step before the animation reveals it.</p></div>
        </section>
      </main>}

      <footer>
        <a className="brand footer-brand" href="#top"><BookMark /><strong>Cartesian</strong></a>
        <p>Learn the shape of a solution.</p>
        <span>Built for curious problem solvers.</span>
      </footer>
    </div>
  )
}

export default App
