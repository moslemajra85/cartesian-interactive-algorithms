import { findLesson, isLessonSlug, type LessonSlug } from './curriculum'

export type AppRoute =
  | { kind: 'home' }
  | { kind: 'catalogue'; chapterId: 'arrays' }
  | { kind: 'lesson'; slug: LessonSlug }
  | { kind: 'not-found'; requestedPath: string }

export function routeFromHash(hash: string): AppRoute {
  const path = hash.replace(/^#/, '').replace(/^\/+|\/+$/g, '')

  if (!path || path === 'top') return { kind: 'home' }
  if (path === 'arrays') return { kind: 'catalogue', chapterId: 'arrays' }
  if (isLessonSlug(path)) return { kind: 'lesson', slug: path }
  return { kind: 'not-found', requestedPath: path }
}

export function hashForRoute(route: Exclude<AppRoute, { kind: 'not-found' }>): string {
  if (route.kind === 'home') return ''
  if (route.kind === 'catalogue') return '#arrays'
  return `#${route.slug}`
}

export function titleForRoute(route: AppRoute): string {
  if (route.kind === 'home') return 'Cartesian — Interactive Algorithms'
  if (route.kind === 'catalogue') return 'Arrays & Sorting — Cartesian'
  if (route.kind === 'lesson') return `${findLesson(route.slug)!.definition.title} — Cartesian`
  return 'Page not found — Cartesian'
}
