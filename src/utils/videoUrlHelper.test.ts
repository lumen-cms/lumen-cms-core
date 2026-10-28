import { describe, expect, it } from 'vitest'
import videoUrlHelper, { selectPlayableSource } from './videoUrlHelper'

describe('videoUrlHelper', () => {
  it('returns an empty source until the player is in view', () => {
    expect(
      videoUrlHelper(
        { component: 'player', _uid: '1', url: 'https://youtu.be/abc' },
        false
      )
    ).toEqual({ src: '' })
  })

  it('uses the external url and trims comma separated values', () => {
    expect(
      videoUrlHelper(
        { component: 'player', _uid: '1', url: ' https://youtu.be/abc ' },
        true
      )
    ).toEqual({ src: 'https://youtu.be/abc' })
  })

  it('prefers the internal asset over alternatives', () => {
    expect(
      videoUrlHelper(
        {
          component: 'player',
          _uid: '1',
          url_internal: { filename: 'https://a.storyblok.com/clip.mp4' } as any,
          url_alternatives: [{ filename: 'https://a.storyblok.com/clip.webm' }]
        } as any,
        true
      ).src
    ).toMatch(/clip\.(mp4|webm)$/)
  })
})

describe('selectPlayableSource', () => {
  const sources = ['https://x/clip.webm', 'https://x/clip.mp4']

  it('picks the first source the browser can play', () => {
    expect(
      selectPlayableSource(sources, (type) =>
        type === 'video/mp4' ? 'probably' : ''
      )
    ).toBe('https://x/clip.mp4')
  })

  it('falls back to the first source when nothing matches', () => {
    expect(selectPlayableSource(sources, () => '')).toBe(sources[0])
  })

  it('keeps single sources untouched', () => {
    expect(selectPlayableSource(['https://youtu.be/abc'])).toBe(
      'https://youtu.be/abc'
    )
  })
})
