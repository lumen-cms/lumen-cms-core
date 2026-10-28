// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it } from 'vitest'
import { StoryblokEditable } from './StoryblokEditable'

it('annotates the rendered root and follows lazy replacements without a layout wrapper', async () => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  const host = document.createElement('div')
  document.body.append(host)
  const root = createRoot(host)
  const content = { _editable: '<!--#storyblok#{"id":42,"uid":"button"}-->' }
  const Component = ({ loaded }: { loaded: boolean }) =>
    loaded ? <button>Loaded</button> : <span>Loading</span>
  try {
    await act(async () =>
      root.render(
        <StoryblokEditable content={content}>
          <Component loaded={false} />
        </StoryblokEditable>
      )
    )
    expect(host.querySelector('span')?.getAttribute('data-blok-uid')).toBe(
      '42-button'
    )
    await act(async () =>
      root.render(
        <StoryblokEditable content={content}>
          <Component loaded />
        </StoryblokEditable>
      )
    )
    await Promise.resolve()
    expect(host.querySelector('button')?.getAttribute('data-blok-uid')).toBe(
      '42-button'
    )
    expect(host.querySelector('button')?.parentElement).toBe(host)
    expect(host.querySelectorAll('template')).toHaveLength(2)
    const button = host.querySelector('button')!
    await act(async () => root.unmount())
    expect(button.hasAttribute('data-blok-uid')).toBe(false)
  } finally {
    host.remove()
  }
})
