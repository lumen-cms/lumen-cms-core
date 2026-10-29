// @vitest-environment happy-dom
import { act, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import Player from './Player'
import type { LmPlayerProps } from './playerTypes'
const seen = vi.hoisted(() => ({
  inView: false,
  props: {} as Record<string, any>,
  ratio: {} as Record<string, any>,
  observer: vi.fn(),
  source: vi.fn(() => ({ src: 'video.mp4' }))
}))
vi.mock('react-intersection-observer', () => ({
  useInView: () => [seen.observer, seen.inView]
}))
vi.mock('react-player', () => ({
  default: (props: Record<string, any>) => {
    seen.props = props
    return <div data-player />
  }
}))
vi.mock('../../utils/videoUrlHelper', () => ({ default: seen.source }))
vi.mock('../image/LmAspectRatio', () => ({
  default: ({ children, ...props }: { children: ReactNode }) => {
    seen.ratio = props
    return <div>{children}</div>
  }
}))
const content = {
  _uid: 'player',
  component: 'player'
} as LmPlayerProps['content']
async function check(
  test: (
    render: (c?: Partial<LmPlayerProps['content']>) => Promise<void>,
    host: HTMLDivElement
  ) => Promise<void>
) {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  seen.inView = false
  seen.source.mockClear()
  const host = document.createElement('div'),
    root = createRoot(host)
  const render = async (c: Partial<LmPlayerProps['content']> = {}) => {
    await act(async () =>
      root.render(<Player content={{ ...content, ...c }} />)
    )
  }
  try {
    await test(render, host)
  } finally {
    await act(async () => root.unmount())
  }
}
it('preserves intersection gating, default sizing and lazy bypass', async () =>
  check(async (render, host) => {
    await render()
    expect(host.querySelector('[data-player]')).toBeNull()
    expect(seen.source).not.toHaveBeenCalled()
    expect(seen.ratio.ref).toBe(seen.observer)
    seen.inView = true
    await render()
    expect(seen.props).toMatchObject({
      height: '360px',
      width: '640px',
      volume: 0,
      light: false,
      playing: false,
      src: 'video.mp4'
    })
    seen.inView = false
    await render({ disable_lazy_load: true })
    expect(host.querySelector('[data-player]')).not.toBeNull()
    expect(seen.ratio.ref).toBeNull()
    expect(seen.source).toHaveBeenLastCalledWith(expect.anything(), true)
  }))
it('preserves ratio styling, dimensions, poster and audio configuration', async () =>
  check(async (render) => {
    await render({
      disable_lazy_load: true,
      ratio: '16x9,4x3',
      border_radius: '8px',
      volume: '0.5',
      muted: true,
      light: true,
      fallback_image: 'poster.jpg',
      loop: true,
      controls: true,
      playsinline: true
    })
    expect(seen.ratio.ratio).toEqual(['16/9', '4/3'])
    expect(seen.props).toMatchObject({
      height: '100%',
      width: '100%',
      light: 'poster.jpg',
      volume: 0,
      loop: true,
      controls: true,
      playsInline: true,
      style: { position: 'absolute', top: 0, left: 0, borderRadius: '8px' }
    })
    await render({
      disable_lazy_load: true,
      height: '200px',
      width: '300px',
      volume: '0.5',
      light: true
    })
    expect(seen.props).toMatchObject({
      height: '200px',
      width: '300px',
      volume: 0.5,
      light: true
    })
    expect(seen.ratio.ratio).toEqual([])
  }))
it('follows playback settings and applies hover inversion across updates', async () =>
  check(async (render, host) => {
    await render({
      disable_lazy_load: true,
      playing: true,
      toggle_play_on_hover: true
    })
    const player = host.querySelector('[data-player]')
    expect(seen.props.playing).toBe(true)
    await act(async () => seen.props.onMouseEnter())
    expect(seen.props.playing).toBe(false)
    await render({
      disable_lazy_load: true,
      playing: true,
      toggle_play_on_hover: true
    })
    expect(seen.props.playing).toBe(false)
    expect(host.querySelector('[data-player]')).toBe(player)
    await act(async () => seen.props.onMouseLeave())
    expect(seen.props.playing).toBe(true)
    await render({ disable_lazy_load: true, toggle_play_on_hover: false })
    await act(async () => seen.props.onMouseEnter())
    expect(seen.props.playing).toBe(false)
    await render({ disable_lazy_load: true, playing: true })
    expect(seen.props.playing).toBe(true)
    await render({ disable_lazy_load: true, playing: false })
    expect(seen.props.playing).toBe(false)
    expect(host.querySelector('[data-player]')).toBe(player)
  }))
