// @vitest-environment happy-dom
import { act } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, expect, it, vi } from 'vitest'
import IconCore from '../icon/LmIcon'
import ImageSvg from './ImageSvg'

const visibility = vi.hoisted(() => ({ inView: false }))
vi.mock('react-intersection-observer', () => ({
  useInView: () => [() => {}, visibility.inView]
}))
afterEach(() => {
  visibility.inView = false
})

it.each(['icon', 'image'] as const)(
  'keeps %s fetching behind visibility and preserves rendering/clicks',
  async (kind) => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    const fetchSvg = vi.fn(
      async (_input: RequestInfo | URL, _init?: RequestInit) =>
        new Response(
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" /></svg>',
          { headers: { 'content-type': 'image/svg+xml' } }
        )
    )
    vi.stubGlobal('fetch', fetchSvg)
    const onClick = vi.fn()
    const render = () =>
      kind === 'icon' ? (
        <IconCore
          iconName="keyboard_arrow_down"
          buttonSize="lm-button-large"
          style={{ color: 'red' }}
          onClick={onClick}
        />
      ) : (
        <ImageSvg
          content={{
            component: 'image',
            _uid: 'svg',
            source: 'https://a.storyblok.com/f/test/test.svg',
            width: '48',
            height: '32',
            fit_in_color: 'blue'
          }}
          onClick={onClick}
        />
      )
    const host = document.createElement('div')
    host.innerHTML = renderToString(render())
    document.body.append(host)
    expect(host.querySelector('svg')).toBeNull()
    const onRecoverableError = vi.fn()
    let root: ReturnType<typeof hydrateRoot> | undefined
    try {
      await act(async () => {
        root = hydrateRoot(host, render(), { onRecoverableError })
      })
      expect(fetchSvg).not.toHaveBeenCalled()
      expect(onRecoverableError).not.toHaveBeenCalled()
      visibility.inView = true
      await act(async () => root!.render(render()))
      await act(async () => vi.dynamicImportSettled())
      await vi.waitFor(async () => {
        await act(async () => {})
        expect(host.querySelector('svg path')).not.toBeNull()
      })
      const svg = host.querySelector('svg')!
      if (kind === 'icon') {
        expect(fetchSvg.mock.calls[0]?.[0]).toBe(
          'https://cdn.jsdelivr.net/npm/@mdi/svg/svg/chevron-down.svg'
        )
        expect(svg.classList.contains('lm-svg-icon')).toBe(true)
        expect(svg.classList.contains('size__lm-button-large')).toBe(true)
        expect(svg.style.color).toBe('red')
      } else {
        expect(fetchSvg.mock.calls[0]?.[0]).toBe(
          'https://s3.amazonaws.com/a.storyblok.com/f/test/test.svg'
        )
        expect(svg.style.width).toBe('48px')
        expect(svg.style.height).toBe('32px')
        expect(svg.style.color).toBe('blue')
        expect(svg.classList.contains('has-color')).toBe(true)
      }
      await act(async () =>
        svg.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      )
      expect(onClick).toHaveBeenCalledOnce()
    } finally {
      await act(async () => root?.unmount())
      host.remove()
    }
  }
)
