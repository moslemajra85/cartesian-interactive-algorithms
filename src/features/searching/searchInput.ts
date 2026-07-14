import { MAX_ARRAY_VALUE, MIN_ARRAY_VALUE } from '../sorting/arrayInput'

export type SearchTargetResult =
  | { ok: true; target: number }
  | { ok: false; error: string }

export function parseSearchTarget(input: string): SearchTargetResult {
  const trimmed = input.trim()
  if (!/^\d+$/.test(trimmed)) {
    return { ok: false, error: 'The target must be a whole number.' }
  }

  const target = Number(trimmed)
  if (target < MIN_ARRAY_VALUE || target > MAX_ARRAY_VALUE) {
    return { ok: false, error: `The target must be between ${MIN_ARRAY_VALUE} and ${MAX_ARRAY_VALUE}.` }
  }

  return { ok: true, target }
}
