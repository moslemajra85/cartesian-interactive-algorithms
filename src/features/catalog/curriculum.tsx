import type { ComponentType } from 'react'
import { BubbleSortLesson } from '../sorting/BubbleSortLesson'
import { InsertionSortLesson } from '../sorting/InsertionSortLesson'
import { SelectionSortLesson } from '../sorting/SelectionSortLesson'
import type { LessonComponentProps } from '../sorting/SortLesson'
import { bubbleSortLesson, insertionSortLesson, selectionSortLesson } from '../sorting/lessonDefinitions'

export type ChapterTone = 'coral' | 'blue' | 'gold' | 'violet'

export type ChapterDefinition = {
  id: string
  number: string
  title: string
  shortTitle: string
  description: string
  plannedLessonCount: number
  tone: ChapterTone
  availability: 'available' | 'locked'
}

export const chapterCatalog: readonly ChapterDefinition[] = [
  {
    id: 'foundations', number: '01', title: 'The Foundations', shortTitle: 'Foundations',
    description: 'Build the mental models behind efficient problem solving.', plannedLessonCount: 6,
    tone: 'gold', availability: 'locked',
  },
  {
    id: 'arrays', number: '02', title: 'Arrays & Sorting', shortTitle: 'Arrays & Sorting',
    description: 'See data move, compare, and settle into order.', plannedLessonCount: 3,
    tone: 'coral', availability: 'available',
  },
  {
    id: 'linked-lists', number: '03', title: 'Linked Structures', shortTitle: 'Linked Structures',
    description: 'Follow references through lists, stacks, and queues.', plannedLessonCount: 8,
    tone: 'blue', availability: 'locked',
  },
  {
    id: 'trees', number: '04', title: 'Trees & Heaps', shortTitle: 'Trees & Heaps',
    description: 'Explore hierarchical data one branch at a time.', plannedLessonCount: 12,
    tone: 'violet', availability: 'locked',
  },
  {
    id: 'graphs', number: '05', title: 'Graphs', shortTitle: 'Graphs',
    description: 'Navigate networks, paths, cycles, and connections.', plannedLessonCount: 14,
    tone: 'gold', availability: 'locked',
  },
]

const catalogEntries = [
  { order: '03', chapterId: 'arrays', definition: bubbleSortLesson, component: BubbleSortLesson },
  { order: '04', chapterId: 'arrays', definition: selectionSortLesson, component: SelectionSortLesson },
  { order: '05', chapterId: 'arrays', definition: insertionSortLesson, component: InsertionSortLesson },
] as const satisfies readonly {
  order: string
  chapterId: string
  definition: { slug: string; title: string; duration: string; tagline: string; timeComplexity: string; spaceComplexity: string }
  component: ComponentType<LessonComponentProps>
}[]

export const lessonCatalog = catalogEntries
export type LessonCatalogEntry = (typeof lessonCatalog)[number]
export type LessonSlug = LessonCatalogEntry['definition']['slug']

export const lessonSlugs: readonly LessonSlug[] = lessonCatalog.map((entry) => entry.definition.slug)

export function findLesson(slug: string): LessonCatalogEntry | undefined {
  return lessonCatalog.find((entry) => entry.definition.slug === slug)
}

export function isLessonSlug(slug: string): slug is LessonSlug {
  return findLesson(slug) !== undefined
}
