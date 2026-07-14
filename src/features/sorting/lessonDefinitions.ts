import type { SortLessonDefinition } from './SortLesson'
import { createBubbleSortSteps } from './bubbleSort'
import { createInsertionSortSteps } from './insertionSort'
import { createMergeSortSteps } from './mergeSort'
import { createSelectionSortSteps } from './selectionSort'

export const bubbleSortLesson = {
  slug: 'bubble-sort', title: 'Bubble Sort', lessonLabel: 'LESSON 02.03', duration: '8 MIN',
  tagline: 'Compare neighbors. Swap disorder. Repeat until every value finds its place.',
  timeComplexity: 'O(n²)', spaceComplexity: 'O(1)', initialValues: [7, 3, 9, 2, 6, 4],
  createSteps: createBubbleSortSteps,
  codeLines: [
    'bubbleSort(values)', '  for end from last index down to 1',
    '    for left from 0 up to end - 1', '      if values[left] > values[left + 1]',
    '        swap(values[left], values[left + 1])', '    mark values[end] as sorted', '  return values',
  ],
  insight: 'After every pass, at least one value reaches its final position. That shrinks the unsorted region from the right.',
  conceptTitle: 'The largest value has nowhere to hide.',
  conceptExplanation: 'Every comparison pushes the larger neighbor one position to the right. A complete pass therefore carries the largest unsorted value all the way to the boundary.',
  prediction: {
    question: 'What is guaranteed after one complete Bubble Sort pass?',
    options: [
      { id: 'array-sorted', label: 'The entire array is sorted.' },
      { id: 'largest-settled', label: 'The largest unsorted value reaches the right boundary.' },
      { id: 'smallest-first', label: 'The smallest value reaches index zero.' },
      { id: 'half-comparisons', label: 'The next pass needs half as many comparisons.' },
    ],
    correctOptionId: 'largest-settled',
    hint: 'Track what happens to the larger value in every adjacent comparison as the scan moves right.',
    explanation: 'Each comparison sends the larger neighbor right. Repeating that operation across the unsorted region carries its maximum to the boundary.',
  },
} satisfies SortLessonDefinition

export const selectionSortLesson = {
  slug: 'selection-sort', title: 'Selection Sort', lessonLabel: 'LESSON 02.04', duration: '9 MIN',
  tagline: 'Find the smallest. Put it next. Grow a sorted region from left to right.',
  timeComplexity: 'O(n²)', spaceComplexity: 'O(1)', initialValues: [7, 3, 9, 2, 6, 4],
  createSteps: createSelectionSortSteps,
  codeLines: [
    'selectionSort(values)', '  for start from 0 to last index - 1', '    minimum = start',
    '    compare each remaining value to minimum', '      update minimum when a smaller value appears',
    '    swap values[start] with values[minimum]', '    mark values[start] as sorted', '  return values',
  ],
  insight: 'Selection Sort performs at most one swap per pass. It spends its work searching, then places the chosen value directly into position.',
  conceptTitle: 'Each position earns a proof.',
  conceptExplanation: 'Before filling an index, Selection Sort inspects every remaining candidate. The chosen minimum therefore cannot be improved by any value to its right.',
  prediction: {
    question: 'Why does Selection Sort need at most one swap during a pass?',
    options: [
      { id: 'single-comparison', label: 'It performs only one comparison per pass.' },
      { id: 'choose-first', label: 'It finishes finding the minimum before placing it.' },
      { id: 'adjacent-only', label: 'It can swap only adjacent values.' },
      { id: 'prefix-frozen', label: 'Every unsorted value is already near its destination.' },
    ],
    correctOptionId: 'choose-first',
    hint: 'Separate the search phase from the placement phase. When does any movement actually happen?',
    explanation: 'The scan only remembers the smallest candidate. After the scan proves which value is minimum, one swap places that value into the next sorted position.',
  },
} satisfies SortLessonDefinition

export const insertionSortLesson = {
  slug: 'insertion-sort', title: 'Insertion Sort', lessonLabel: 'LESSON 02.05', duration: '9 MIN',
  tagline: 'Pick the next value. Slide it left. Grow an ordered region one insertion at a time.',
  timeComplexity: 'O(n²)', spaceComplexity: 'O(1)', initialValues: [7, 3, 9, 2, 6, 4],
  createSteps: createInsertionSortSteps,
  codeLines: [
    'insertionSort(values)', '  for current from 1 to last index', '    position = current',
    '    while value < its left neighbor', '      swap value one position left',
    '    mark prefix through current as ordered', '  return values',
  ],
  insight: 'Insertion Sort is adaptive. When values are already close to their correct positions, the inner loop stops early and performs very little movement.',
  conceptTitle: 'Order grows from what you already know.',
  conceptExplanation: 'Before each pass, the prefix is ordered. Moving the next value left until its neighbor is no larger restores that invariant for a prefix that is one element longer.',
  prediction: {
    question: 'When can Insertion Sort stop moving the current value left?',
    options: [
      { id: 'original-index', label: 'When it returns to its original index.' },
      { id: 'right-scanned', label: 'After every value to its right has been inspected.' },
      { id: 'left-not-larger', label: 'When its left neighbor is no larger, or it reaches index zero.' },
      { id: 'maximum-found', label: 'When the largest value in the array has been found.' },
    ],
    correctOptionId: 'left-not-larger',
    hint: 'The prefix was already ordered before insertion. What local comparison proves the new value fits?',
    explanation: 'Once the left neighbor is no larger, everything further left is also no larger because the prefix is ordered. The value has reached a valid insertion point.',
  },
} satisfies SortLessonDefinition

export const mergeSortLesson = {
  slug: 'merge-sort', title: 'Merge Sort', lessonLabel: 'LESSON 02.06', duration: '11 MIN',
  tagline: 'Divide the problem. Order the pieces. Merge small certainties into one solution.',
  timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)', initialValues: [8, 3, 6, 2, 7, 4, 1],
  createSteps: createMergeSortSteps,
  codeLines: [
    'mergeSort(values, start, end)', '  if start >= end: return',
    '  middle = floor((start + end) / 2)', '  mergeSort(values, start, middle)',
    '  mergeSort(values, middle + 1, end)', '  merge the two ordered halves',
    '  return the ordered range',
  ],
  insight: 'The merge step never has to search an unordered range. It compares only the front values of two halves that recursion has already ordered.',
  conceptTitle: 'Large order grows from small guarantees.',
  conceptExplanation: 'A one-value range is already sorted. Once recursion returns two sorted halves, choosing the smaller front value repeatedly creates a larger sorted range. That argument holds at every level until the whole array is ordered.',
  prediction: {
    question: 'What must be true before Merge Sort can merge two ranges correctly?',
    options: [
      { id: 'equal-size', label: 'The two ranges must contain the same number of values.' },
      { id: 'halves-ordered', label: 'Each range must already be ordered.' },
      { id: 'no-duplicates', label: 'Neither range may contain duplicate values.' },
      { id: 'in-final-place', label: 'Every value must already occupy its final array index.' },
    ],
    correctOptionId: 'halves-ordered',
    hint: 'Why is comparing only the front remaining value of each half sufficient?',
    explanation: 'Because both halves are ordered, each front value is the smallest remaining candidate in its half. The smaller front is therefore the smallest value remaining across both halves.',
  },
  visualMode: 'merge',
} satisfies SortLessonDefinition
