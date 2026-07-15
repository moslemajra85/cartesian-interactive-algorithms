import type { ComponentType } from 'react'
import { ComplexityGrowthLesson } from '../foundations/ComplexityGrowthLesson'
import { complexityGrowthLesson } from '../foundations/complexityGrowthLessonDefinition'
import { ComplexityCasesLesson } from '../foundations/ComplexityCasesLesson'
import { complexityCasesLesson } from '../foundations/complexityCasesLessonDefinition'
import { CountingOperationsLesson } from '../foundations/CountingOperationsLesson'
import { countingOperationsLesson } from '../foundations/countingOperationsLessonDefinition'
import { SpaceComplexityLesson } from '../foundations/SpaceComplexityLesson'
import { spaceComplexityLesson } from '../foundations/spaceComplexityLessonDefinition'
import { RecursionStackLesson } from '../foundations/RecursionStackLesson'
import { recursionStackLesson } from '../foundations/recursionStackLessonDefinition'
import { TimeSpaceTradeoffLesson } from '../foundations/TimeSpaceTradeoffLesson'
import { timeSpaceTradeoffLesson } from '../foundations/timeSpaceTradeoffLessonDefinition'
import { BinarySearchLesson } from '../searching/BinarySearchLesson'
import { binarySearchLesson } from '../searching/binarySearchLessonDefinition'
import { LinkedInsertionLesson } from '../linked/LinkedInsertionLesson'
import { linkedInsertionLesson } from '../linked/linkedInsertionLessonDefinition'
import { LinkedDeletionLesson } from '../linked/LinkedDeletionLesson'
import { linkedDeletionLesson } from '../linked/linkedDeletionLessonDefinition'
import { LinkedTraversalLesson } from '../linked/LinkedTraversalLesson'
import { linkedTraversalLesson } from '../linked/linkedTraversalLessonDefinition'
import { LinkedStackLesson } from '../linked/LinkedStackLesson'
import { linkedStackLesson } from '../linked/linkedStackLessonDefinition'
import { BubbleSortLesson } from '../sorting/BubbleSortLesson'
import { InsertionSortLesson } from '../sorting/InsertionSortLesson'
import { MergeSortLesson } from '../sorting/MergeSortLesson'
import { SelectionSortLesson } from '../sorting/SelectionSortLesson'
import type { LessonComponentProps } from '../sorting/SortLesson'
import { bubbleSortLesson, insertionSortLesson, mergeSortLesson, selectionSortLesson } from '../sorting/lessonDefinitions'

export type ChapterTone = 'coral' | 'blue' | 'gold' | 'violet'

export type ChapterDefinition = {
  id: 'foundations' | 'arrays' | 'linked-lists' | 'trees' | 'graphs'
  number: string
  title: string
  shortTitle: string
  description: string
  catalogueDescription: string
  learningNote: string
  plannedLessonCount: number
  tone: ChapterTone
  availability: 'available' | 'locked'
}

export const chapterCatalog: readonly ChapterDefinition[] = [
  {
    id: 'foundations', number: '01', title: 'The Foundations', shortTitle: 'Foundations',
    description: 'Build the mental models behind efficient problem solving.', plannedLessonCount: 6,
    catalogueDescription: 'Measure how an algorithm’s work changes as its input grows, then build the vocabulary to compare solutions honestly.',
    learningNote: 'Complexity describes growth, not stopwatch time. Focus on what happens when the input doubles and which details stop mattering at scale.',
    tone: 'gold', availability: 'available',
  },
  {
    id: 'arrays', number: '02', title: 'Arrays & Sorting', shortTitle: 'Arrays & Sorting',
    description: 'See data move into order, then use that order to search efficiently.', plannedLessonCount: 5,
    catalogueDescription: 'Compare four ways to create order, then use that order to eliminate half a search at a time.',
    learningNote: 'Sorting creates an invariant you can trust; Binary Search spends that order to eliminate candidates. Focus on what each comparison proves, not only on which values move.',
    tone: 'coral', availability: 'available',
  },
  {
    id: 'linked-lists', number: '03', title: 'Linked Structures', shortTitle: 'Linked Structures',
    description: 'Follow references through lists, stacks, and queues.', plannedLessonCount: 8,
    catalogueDescription: 'Follow references through lists, stacks, and queues.',
    learningNote: 'Track ownership and links before thinking about syntax.',
    tone: 'blue', availability: 'available',
  },
  {
    id: 'trees', number: '04', title: 'Trees & Heaps', shortTitle: 'Trees & Heaps',
    description: 'Explore hierarchical data one branch at a time.', plannedLessonCount: 12,
    catalogueDescription: 'Explore hierarchical data one branch at a time.',
    learningNote: 'Every traversal rule determines which branch becomes visible next.',
    tone: 'violet', availability: 'locked',
  },
  {
    id: 'graphs', number: '05', title: 'Graphs', shortTitle: 'Graphs',
    description: 'Navigate networks, paths, cycles, and connections.', plannedLessonCount: 14,
    catalogueDescription: 'Navigate networks, paths, cycles, and connections.',
    learningNote: 'Graph algorithms differ mainly in what they remember and which frontier they explore next.',
    tone: 'gold', availability: 'locked',
  },
]

const catalogEntries = [
  { order: '01', chapterId: 'foundations', definition: complexityGrowthLesson, component: ComplexityGrowthLesson },
  { order: '02', chapterId: 'foundations', definition: countingOperationsLesson, component: CountingOperationsLesson },
  { order: '03', chapterId: 'foundations', definition: spaceComplexityLesson, component: SpaceComplexityLesson },
  { order: '04', chapterId: 'foundations', definition: complexityCasesLesson, component: ComplexityCasesLesson },
  { order: '05', chapterId: 'foundations', definition: recursionStackLesson, component: RecursionStackLesson },
  { order: '06', chapterId: 'foundations', definition: timeSpaceTradeoffLesson, component: TimeSpaceTradeoffLesson },
  { order: '03', chapterId: 'arrays', definition: bubbleSortLesson, component: BubbleSortLesson },
  { order: '04', chapterId: 'arrays', definition: selectionSortLesson, component: SelectionSortLesson },
  { order: '05', chapterId: 'arrays', definition: insertionSortLesson, component: InsertionSortLesson },
  { order: '06', chapterId: 'arrays', definition: mergeSortLesson, component: MergeSortLesson },
  { order: '07', chapterId: 'arrays', definition: binarySearchLesson, component: BinarySearchLesson },
  { order: '01', chapterId: 'linked-lists', definition: linkedInsertionLesson, component: LinkedInsertionLesson },
  { order: '02', chapterId: 'linked-lists', definition: linkedDeletionLesson, component: LinkedDeletionLesson },
  { order: '03', chapterId: 'linked-lists', definition: linkedTraversalLesson, component: LinkedTraversalLesson },
  { order: '04', chapterId: 'linked-lists', definition: linkedStackLesson, component: LinkedStackLesson },
] as const satisfies readonly {
  order: string
  chapterId: string
  definition: { slug: string; title: string; duration: string; tagline: string; timeComplexity: string; spaceComplexity: string }
  component: ComponentType<LessonComponentProps>
}[]

export const lessonCatalog = catalogEntries
export type ChapterId = ChapterDefinition['id']
export type LessonCatalogEntry = (typeof lessonCatalog)[number]
export type LessonSlug = LessonCatalogEntry['definition']['slug']

export const lessonSlugs: readonly LessonSlug[] = lessonCatalog.map((entry) => entry.definition.slug)

export function findLesson(slug: string): LessonCatalogEntry | undefined {
  return lessonCatalog.find((entry) => entry.definition.slug === slug)
}

export function findChapter(chapterId: string): ChapterDefinition | undefined {
  return chapterCatalog.find((chapter) => chapter.id === chapterId)
}

export function isAvailableChapterId(chapterId: string): chapterId is ChapterId {
  return findChapter(chapterId)?.availability === 'available'
}

export function isLessonSlug(slug: string): slug is LessonSlug {
  return findLesson(slug) !== undefined
}
