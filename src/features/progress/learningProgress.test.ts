import { describe, expect, it } from 'vitest'
import {
  LEARNING_PROGRESS_KEY,
  clearLearningProgress,
  createEmptyProgress,
  loadLearningProgress,
  recordLessonCompletion,
  recordLessonVisit,
  saveLearningProgress,
  type ProgressStorage,
} from './learningProgress'

const LESSONS = ['bubble-sort', 'selection-sort', 'insertion-sort']

function createMemoryStorage(initialValue: string | null = null): ProgressStorage & { value: string | null } {
  return {
    value: initialValue,
    getItem() { return this.value },
    setItem(_key, value) { this.value = value },
    removeItem() { this.value = null },
  }
}

describe('learning progress', () => {
  it('starts empty when no saved value exists', () => {
    expect(loadLearningProgress(createMemoryStorage(), LESSONS)).toEqual(createEmptyProgress())
  })

  it('loads valid progress while removing duplicates and unknown lessons', () => {
    const storage = createMemoryStorage(JSON.stringify({
      version: 1,
      completedLessonSlugs: ['bubble-sort', 'unknown', 'bubble-sort'],
      lastLessonSlug: 'selection-sort',
    }))

    expect(loadLearningProgress(storage, LESSONS)).toEqual({
      version: 1,
      completedLessonSlugs: ['bubble-sort'],
      lastLessonSlug: 'selection-sort',
    })
  })

  it.each(['not-json', JSON.stringify({ version: 2 }), JSON.stringify({ version: 1, completedLessonSlugs: 'bubble-sort' })])(
    'falls back safely for invalid data: %s',
    (value) => {
      expect(loadLearningProgress(createMemoryStorage(value), LESSONS)).toEqual(createEmptyProgress())
    },
  )

  it('records a visit without marking the lesson complete', () => {
    expect(recordLessonVisit(createEmptyProgress(), 'selection-sort')).toEqual({
      version: 1,
      completedLessonSlugs: [],
      lastLessonSlug: 'selection-sort',
    })
  })

  it('records completion once and makes the completed lesson the latest visit', () => {
    const completed = recordLessonCompletion(createEmptyProgress(), 'bubble-sort')

    expect(recordLessonCompletion(completed, 'bubble-sort')).toBe(completed)
    expect(completed).toEqual({
      version: 1,
      completedLessonSlugs: ['bubble-sort'],
      lastLessonSlug: 'bubble-sort',
    })
  })

  it('saves and clears the versioned payload', () => {
    const storage = createMemoryStorage()
    const progress = recordLessonCompletion(createEmptyProgress(), 'insertion-sort')

    expect(saveLearningProgress(storage, progress)).toBe(true)
    expect(JSON.parse(storage.value!)).toEqual(progress)
    expect(clearLearningProgress(storage)).toBe(true)
    expect(storage.value).toBeNull()
  })

  it('survives unavailable browser storage', () => {
    const unavailableStorage: ProgressStorage = {
      getItem() { throw new Error('unavailable') },
      setItem() { throw new Error('unavailable') },
      removeItem() { throw new Error('unavailable') },
    }

    expect(loadLearningProgress(unavailableStorage, LESSONS)).toEqual(createEmptyProgress())
    expect(saveLearningProgress(unavailableStorage, createEmptyProgress())).toBe(false)
    expect(clearLearningProgress(unavailableStorage)).toBe(false)
  })

  it('uses a versioned storage key', () => {
    expect(LEARNING_PROGRESS_KEY).toBe('cartesian.learning-progress.v1')
  })
})
