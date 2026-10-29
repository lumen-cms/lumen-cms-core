// @vitest-environment happy-dom
import { act, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, expect, it, vi } from 'vitest'
import { LmCoreComponents } from '../utils/config'
import { LmComponentRender } from './CoreComponents'
import { AppContext } from './provider/context/AppContext'

const original = { ...LmCoreComponents }
afterEach(() => {
  for (const key of Object.keys(LmCoreComponents)) delete LmCoreComponents[key]
  Object.assign(LmCoreComponents, original)
})

it('renders nested registrations and consumer overrides, forwarding content and extra props', async () => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  const host = document.createElement('div')
  const root = createRoot(host)
  const click = vi.fn()
  LmCoreComponents.test_parent = ({ content, ...rest }: any) => (
    <section>
      {content.body.map((item: any) => (
        <LmComponentRender key={item._uid} content={item} {...rest} />
      ))}
    </section>
  )
  LmCoreComponents.test_child = () => <span>Original</span>
  LmCoreComponents.test_child = ({ content, onClick }: any) => (
    <button onClick={onClick}>{content.text}</button>
  )
  try {
    await act(async () =>
      root.render(
        <LmComponentRender
          content={
            {
              component: 'test_parent',
              body: [
                { component: 'test_child', _uid: 'child', text: 'Override' }
              ]
            } as any
          }
          onClick={click}
        />
      )
    )
    expect(host.querySelector('section button')?.textContent).toBe('Override')
    host.querySelector('button')!.click()
    expect(click).toHaveBeenCalledOnce()
    await act(async () =>
      root.render(
        <LmComponentRender
          content={{ component: 'missing_test_block' } as any}
        />
      )
    )
    expect(host.textContent).toContain(
      'The component missing_test_block has not been created yet.'
    )
  } finally {
    await act(async () => root.unmount())
  }
})

it('renders a lazy registration and applies preview markers to its resolved root', async () => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  const host = document.createElement('div')
  document.body.append(host)
  const root = createRoot(host)
  let resolve!: (value: { default: () => React.JSX.Element }) => void
  const loaded = new Promise<{ default: () => React.JSX.Element }>((done) => {
    resolve = done
  })
  LmCoreComponents.test_lazy = lazy(() => loaded)
  try {
    await act(async () =>
      root.render(
        <AppContext.Provider value={{ insideStoryblok: true } as any}>
          <Suspense fallback={<span>Loading</span>}>
            <LmComponentRender
              content={
                {
                  component: 'test_lazy',
                  _editable: '<!--#storyblok#{"id":42,"uid":"lazy"}-->'
                } as any
              }
            />
          </Suspense>
        </AppContext.Provider>
      )
    )
    expect(host.textContent).toBe('Loading')
    await act(async () => {
      resolve({ default: () => <button>Ready</button> })
      await loaded
    })
    expect(host.querySelector('button')?.getAttribute('data-blok-uid')).toBe(
      '42-lazy'
    )
    expect(host.querySelector('button')?.parentElement).toBe(host)
  } finally {
    await act(async () => root.unmount())
    host.remove()
  }
})
