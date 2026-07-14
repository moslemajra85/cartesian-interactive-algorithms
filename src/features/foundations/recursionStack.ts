export type RecursionPhase = 'ready' | 'descend' | 'base' | 'unwind' | 'complete'

export type RecursionStackStep = {
  frames: number[]
  activeLevel: number | null
  phase: RecursionPhase
  title: string
  explanation: string
}

export function createRecursionStackSteps(depth: number): RecursionStackStep[] {
  if (!Number.isInteger(depth) || depth < 1 || depth > 8) {
    throw new RangeError('Recursion depth must be a whole number from 1 to 8.')
  }

  const frames: number[] = []
  const steps: RecursionStackStep[] = [{
    frames: [], activeLevel: null, phase: 'ready', title: 'Traversal is ready',
    explanation: `The root folder contains a nested path ${depth} ${depth === 1 ? 'level' : 'levels'} deep. Each recursive call will need its own suspended frame.`,
  }]

  for (let level = 1; level <= depth; level += 1) {
    frames.push(level)
    steps.push({
      frames: [...frames], activeLevel: level, phase: 'descend', title: `Enter folder level ${level}`,
      explanation: `Push frame ${level}. It remembers where this call must continue after the deeper folder returns.`,
    })
  }

  steps.push({
    frames: [...frames], activeLevel: depth, phase: 'base', title: 'Base case reached',
    explanation: 'This folder has no child folder. The recursion stops creating calls and can begin returning results.',
  })

  for (let level = depth; level >= 1; level -= 1) {
    steps.push({
      frames: [...frames], activeLevel: level, phase: 'unwind', title: `Return from level ${level}`,
      explanation: `Frame ${level} completes and leaves the stack. Control returns to ${level === 1 ? 'the original caller' : `the suspended call at level ${level - 1}`}.`,
    })
    frames.pop()
  }

  steps.push({
    frames: [], activeLevel: null, phase: 'complete', title: 'Traversal complete',
    explanation: `All ${depth} frames returned in reverse order. The call stack is empty again.`,
  })
  return steps
}
