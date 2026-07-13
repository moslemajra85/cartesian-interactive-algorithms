import { describe, expect, it } from 'vitest'
import { getPlaybackCommand } from './playbackShortcuts'

describe('getPlaybackCommand', () => {
  it.each([
    [' ', 'toggle-playback'],
    ['Spacebar', 'toggle-playback'],
    ['ArrowLeft', 'previous-step'],
    ['ArrowRight', 'next-step'],
    ['r', 'restart'],
    ['R', 'restart'],
    ['s', 'change-speed'],
    ['S', 'change-speed'],
  ] as const)('maps %s to %s', (key, command) => {
    expect(getPlaybackCommand({ key })).toBe(command)
  })

  it('ignores unrelated keys', () => {
    expect(getPlaybackCommand({ key: 'Enter' })).toBeNull()
    expect(getPlaybackCommand({ key: 'm' })).toBeNull()
  })

  it('does not override browser or operating-system shortcuts', () => {
    expect(getPlaybackCommand({ key: 'r', ctrlKey: true })).toBeNull()
    expect(getPlaybackCommand({ key: 's', metaKey: true })).toBeNull()
    expect(getPlaybackCommand({ key: 'ArrowLeft', altKey: true })).toBeNull()
  })
})
