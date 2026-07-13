export const LEARNING_PROGRESS_KEY = 'cartesian.learning-progress.v1'

export type LearningProgress = {
  version: 1
  completedLessonSlugs: string[]
  lastLessonSlug: string | null
}

export type ProgressStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

export function createEmptyProgress(): LearningProgress {
  return {
    version: 1,
    completedLessonSlugs: [],
    lastLessonSlug: null,
  }
}

function normalizeProgress(value: unknown, validLessonSlugs: readonly string[]): LearningProgress {
  if (!value || typeof value !== 'object') return createEmptyProgress()

  const candidate = value as Partial<LearningProgress>
  if (candidate.version !== 1 || !Array.isArray(candidate.completedLessonSlugs)) {
    return createEmptyProgress()
  }

  const validSlugs = new Set(validLessonSlugs)
  const completedLessonSlugs = [...new Set(candidate.completedLessonSlugs)]
    .filter((slug): slug is string => typeof slug === 'string' && validSlugs.has(slug))
  const lastLessonSlug = typeof candidate.lastLessonSlug === 'string'
    && validSlugs.has(candidate.lastLessonSlug)
    ? candidate.lastLessonSlug
    : null

  return { version: 1, completedLessonSlugs, lastLessonSlug }
}

export function loadLearningProgress(
  storage: ProgressStorage,
  validLessonSlugs: readonly string[],
): LearningProgress {
  try {
    const serialized = storage.getItem(LEARNING_PROGRESS_KEY)
    if (!serialized) return createEmptyProgress()
    return normalizeProgress(JSON.parse(serialized), validLessonSlugs)
  } catch {
    return createEmptyProgress()
  }
}

export function saveLearningProgress(
  storage: ProgressStorage,
  progress: LearningProgress,
): boolean {
  try {
    storage.setItem(LEARNING_PROGRESS_KEY, JSON.stringify(progress))
    return true
  } catch {
    return false
  }
}

export function clearLearningProgress(storage: ProgressStorage): boolean {
  try {
    storage.removeItem(LEARNING_PROGRESS_KEY)
    return true
  } catch {
    return false
  }
}

export function recordLessonVisit(
  progress: LearningProgress,
  lessonSlug: string,
): LearningProgress {
  return { ...progress, lastLessonSlug: lessonSlug }
}

export function recordLessonCompletion(
  progress: LearningProgress,
  lessonSlug: string,
): LearningProgress {
  if (progress.completedLessonSlugs.includes(lessonSlug)) return progress

  return {
    ...progress,
    completedLessonSlugs: [...progress.completedLessonSlugs, lessonSlug],
    lastLessonSlug: lessonSlug,
  }
}
