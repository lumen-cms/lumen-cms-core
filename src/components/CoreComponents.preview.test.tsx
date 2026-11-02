// @vitest-environment happy-dom
import { act, useEffect } from 'react'
import { createRoot, hydrateRoot, type Root } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { LmComponentRender } from './CoreComponents'
import AppProvider from './provider/AppProvider'
import {
  AppContext,
  useAppContext,
  type AppContextProps
} from './provider/context/AppContext'
import { LmCoreComponents } from '../utils/config'
import type { HeadlineStoryblok } from '../typings/generated/components-schema'

const originalHeadline = LmCoreComponents.headline
const originalButton = LmCoreComponents.button
let host: HTMLDivElement
let root: Root | undefined

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  host = document.createElement('div')
  document.body.append(host)
})

afterEach(async () => {
  if (root) await act(async () => root!.unmount())
  root = undefined
  host.remove()
  LmCoreComponents.headline = originalHeadline
  LmCoreComponents.button = originalButton
})

const content: HeadlineStoryblok = {
  component: 'headline',
  _uid: 'headline',
  text: 'Content',
  _editable: '<!--#storyblok#{"id":42,"uid":"headline"}-->'
}

it('isolates unchanged blocks from route/locale updates while route consumers still update', async () => {
  root = createRoot(host)
  const renderBlock = vi.fn()
  const unmountBlock = vi.fn()
  LmCoreComponents.headline = function Headline() {
    renderBlock()
    useEffect(() => unmountBlock, [])
    return <span>Content</span>
  }
  LmCoreComponents.button = function RouteButton() {
    const { slug, locale } = useAppContext()
    return <button>{`${locale}:${slug}`}</button>
  }
  const children = (
    <>
      {Array.from({ length: 100 }, (_, i) => (
        <LmComponentRender key={i} content={content} />
      ))}
      <LmComponentRender content={{ component: 'button', _uid: 'route' }} />
    </>
  )
  const render = (appContent: AppContextProps) =>
    root!.render(<AppProvider content={appContent}>{children}</AppProvider>)

  await act(async () =>
    render({ insideStoryblok: false, slug: '/first', locale: 'en' })
  )
  expect(renderBlock).toHaveBeenCalledTimes(100)
  renderBlock.mockClear()
  await act(async () =>
    render({ insideStoryblok: false, slug: '/second', locale: 'en' })
  )
  expect(renderBlock).not.toHaveBeenCalled()
  expect(host.querySelector('button')?.textContent).toBe('en:/second')
  await act(async () =>
    render({ insideStoryblok: true, slug: '/second', locale: 'de' })
  )
  expect(renderBlock).not.toHaveBeenCalled()
  expect(host.querySelector('button')?.textContent).toBe('de:/second')
  // AppProvider retains its mount-time preview mode, even if props change.
  expect(host.querySelectorAll('template')).toHaveLength(0)
  expect(unmountBlock).not.toHaveBeenCalled()
})

it.each(['Provider', 'shorthand'] as const)(
  'honors changing nested native context overrides through %s',
  async (syntax) => {
    root = createRoot(host)
    LmCoreComponents.headline = () => <h1>Content</h1>
    const Provider = syntax === 'Provider' ? AppContext.Provider : AppContext
    const children = <LmComponentRender content={content} />
    const render = (value: AppContextProps) =>
      root!.render(
        <AppProvider content={{ insideStoryblok: true }}>
          <Provider value={value}>{children}</Provider>
        </AppProvider>
      )

    for (const insideStoryblok of [false, true, undefined, true, false]) {
      await act(async () => render({ insideStoryblok }))
      await act(async () => vi.dynamicImportSettled())
      const heading = host.querySelector('h1')!
      expect(heading.parentElement).toBe(host)
      expect(heading.getAttribute('data-blok-uid')).toBe(
        insideStoryblok ? '42-headline' : null
      )
      expect(host.querySelectorAll('template')).toHaveLength(
        insideStoryblok ? 2 : 0
      )
    }
  }
)

it('keeps ordinary parent renders and registry overrides observable with unchanged props', async () => {
  root = createRoot(host)
  const mutableContent = { ...content }
  const renders = vi.fn()
  LmCoreComponents.headline = ({ content }) => {
    renders()
    return <h1>{content.text}</h1>
  }
  const render = () =>
    root!.render(<LmComponentRender content={mutableContent} />)
  await act(async () => render())
  mutableContent.text = 'Updated'
  await act(async () => render())
  expect(host.textContent).toBe('Updated')
  expect(renders).toHaveBeenCalledTimes(2)
  LmCoreComponents.headline = ({ content }) => <h2>{content.text}</h2>
  await act(async () => render())
  expect(host.querySelector('h2')?.textContent).toBe('Updated')
})

it.each([false, true])(
  'hydrates the same DOM structure in preview mode %s',
  async (insideStoryblok) => {
    LmCoreComponents.headline = () => <h1>Content</h1>
    const children = (
      <AppContext.Provider value={{ insideStoryblok }}>
        <LmComponentRender content={content} />
      </AppContext.Provider>
    )
    host.innerHTML = renderToString(children)
    const serverHeading = host.querySelector('h1')
    expect(host.innerHTML).toBe(
      insideStoryblok
        ? '<template></template><h1>Content</h1><template></template>'
        : '<h1>Content</h1>'
    )
    const onRecoverableError = vi.fn()
    await act(async () => {
      root = hydrateRoot(host, children, { onRecoverableError })
    })
    expect(onRecoverableError).not.toHaveBeenCalled()
    expect(host.querySelector('h1')).toBe(serverHeading)
    await act(async () => vi.dynamicImportSettled())
    expect(host.querySelector('h1')?.getAttribute('data-blok-uid')).toBe(
      insideStoryblok ? '42-headline' : null
    )
  }
)
