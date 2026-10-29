// @vitest-environment happy-dom
import { act } from 'react'
import { renderToString } from 'react-dom/server'
import { hydrateRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import LmIframe from './Iframe'

const observer = vi.hoisted(() => ({ inView: false }))
vi.mock('react-intersection-observer', () => ({
  useInView: () => [() => {}, observer.inView]
}))

it.each([false, true])(
  'hydrates identically with initial visibility %s and loads with provider permissions',
  async (visible) => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    const content = {
      _uid: 'video',
      component: 'iframe' as const,
      url: 'https://www.youtube.com/embed/video',
      responsive_ratio: '16by9' as const,
      height: '400px',
      width: '600px',
      property: ['allow_fullscreen' as const],
      allow: ['encrypted-media' as const]
    }
    observer.inView = visible
    const initial = renderToString(<LmIframe content={content} />)
    expect(initial).not.toContain('src="https://www.youtube.com')
    expect(initial).not.toContain('allow-same-origin')
    const container = document.createElement('div')
    container.innerHTML = initial
    const recoverable = vi.fn()
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const serverFrame = container.querySelector('iframe')!
    let root!: ReturnType<typeof hydrateRoot>
    try {
      await act(async () => {
        root = hydrateRoot(container, <LmIframe content={content} />, {
          onRecoverableError: recoverable
        })
      })
      expect(container.querySelector('iframe')).toBe(serverFrame)
      expect(recoverable).not.toHaveBeenCalled()
      expect(consoleError).not.toHaveBeenCalled()
      if (!visible) expect(serverFrame.hasAttribute('src')).toBe(false)
      observer.inView = true
      await act(async () => root.render(<LmIframe content={content} />))
      expect(serverFrame.getAttribute('src')).toBe(content.url)
      expect(serverFrame.getAttribute('sandbox')).toContain('allow-same-origin')
      expect(serverFrame.getAttribute('allow')).toBe('encrypted-media')
      expect(serverFrame.hasAttribute('allowfullscreen')).toBe(true)
      expect(serverFrame.getAttribute('height')).toBe('400px')
      expect(serverFrame.getAttribute('width')).toBe('600px')
      expect(container.innerHTML).toContain('embed-responsive-16by9')
    } finally {
      await act(async () => root?.unmount())
      container.remove()
    }
  }
)
