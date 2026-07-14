export const MIN_ARRAY_LENGTH = 2
export const MAX_ARRAY_LENGTH = 8
export const MIN_ARRAY_VALUE = 1
export const MAX_ARRAY_VALUE = 99

export type ArrayInputResult =
  | { ok: true; values: number[]; normalized: string }
  | { ok: false; error: string }

export function parseArrayInput(input: string): ArrayInputResult {
  const trimmedInput = input.trim()

  if (!trimmedInput) {
    return { ok: false, error: 'Enter at least two values.' }
  }

  const tokens = trimmedInput.split(/[\s,]+/)

  if (tokens.length < MIN_ARRAY_LENGTH || tokens.length > MAX_ARRAY_LENGTH) {
    return { ok: false, error: `Use between ${MIN_ARRAY_LENGTH} and ${MAX_ARRAY_LENGTH} values.` }
  }

  if (tokens.some((token) => !/^\d+$/.test(token))) {
    return { ok: false, error: 'Use whole numbers separated by commas or spaces.' }
  }

  const values = tokens.map(Number)
  if (values.some((value) => value < MIN_ARRAY_VALUE || value > MAX_ARRAY_VALUE)) {
    return { ok: false, error: `Each value must be between ${MIN_ARRAY_VALUE} and ${MAX_ARRAY_VALUE}.` }
  }

  return {
    ok: true,
    values,
    normalized: values.join(', '),
  }
}
