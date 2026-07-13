export type PlaybackCommand =
  | 'toggle-playback'
  | 'previous-step'
  | 'next-step'
  | 'restart'
  | 'change-speed'

type KeyboardInput = {
  key: string
  altKey?: boolean
  ctrlKey?: boolean
  metaKey?: boolean
}

export function getPlaybackCommand(input: KeyboardInput): PlaybackCommand | null {
  if (input.altKey || input.ctrlKey || input.metaKey) return null

  switch (input.key.toLowerCase()) {
    case ' ':
    case 'spacebar':
      return 'toggle-playback'
    case 'arrowleft':
      return 'previous-step'
    case 'arrowright':
      return 'next-step'
    case 'r':
      return 'restart'
    case 's':
      return 'change-speed'
    default:
      return null
  }
}
