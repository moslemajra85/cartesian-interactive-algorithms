import { describe, expect, it } from 'vitest'
import { chapterCatalog, lessonCatalog, lessonSlugs } from './curriculum'

describe('curriculum registry', () => {
  it('assigns every lesson a unique route slug', () => {
    expect(new Set(lessonSlugs).size).toBe(lessonCatalog.length)
  })

  it('references an available chapter from every lesson', () => {
    const availableChapterIds = new Set(
      chapterCatalog.filter((chapter) => chapter.availability === 'available').map((chapter) => chapter.id),
    )

    for (const lesson of lessonCatalog) {
      expect(availableChapterIds.has(lesson.chapterId)).toBe(true)
    }
  })

  it('keeps catalogue ordering aligned with educational lesson labels', () => {
    for (const lesson of lessonCatalog) {
      const chapter = chapterCatalog.find((candidate) => candidate.id === lesson.chapterId)!
      expect(lesson.definition.lessonLabel).toBe(`LESSON ${chapter.number}.${lesson.order}`)
    }
  })
})
