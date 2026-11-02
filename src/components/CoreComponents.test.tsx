import LmEcommerceCheckout from './ecommerce/EcommerceCheckout'
import { renderToStaticMarkup } from 'react-dom/server'
import type { ButtonStoryblok } from '../typings/generated/components-schema'
// @vitest-environment happy-dom
import { act, lazy, Suspense, type MouseEventHandler } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, expect, it, vi } from 'vitest'
import { LmCoreComponents, type LmCoreComponentsProps } from '../utils/config'
import { LmComponentRender } from './CoreComponents'
import { AppContext } from './provider/context/AppContext'

declare module '../typings/storyblok-registry' {
  interface StoryblokComponentMap {
    test_parent: {
      component: 'test_parent'
      body: { component: 'test_child'; _uid: string; text: string }[]
    }
    test_child: { component: 'test_child'; _uid: string; text: string }
    test_lazy: { component: 'test_lazy'; _editable?: string }
    missing_test_block: { component: 'missing_test_block' }
  }
  interface StoryblokRendererPropsOverrides {
    test_parent: {
      content: StoryblokComponentMap['test_parent']
      onClick?: MouseEventHandler<HTMLButtonElement>
    }
    test_child: {
      content: StoryblokComponentMap['test_child']
      onClick?: MouseEventHandler<HTMLButtonElement>
    }
  }
}

const original = { ...LmCoreComponents }
afterEach(() => {
  for (const key of Object.keys(
    LmCoreComponents
  ) as (keyof LmCoreComponentsProps)[])
    delete LmCoreComponents[key]
  Object.assign(LmCoreComponents, original)
})

it('renders nested registrations and consumer overrides, forwarding content and extra props', async () => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  const host = document.createElement('div')
  const root = createRoot(host)
  const click = vi.fn()
  LmCoreComponents.test_parent = ({
    content,
    ...rest
  }: {
    content: { body: { component: 'test_child'; _uid: string; text: string }[] }
    onClick?: MouseEventHandler<HTMLButtonElement>
  }) => (
    <section>
      {content.body.map((item) => (
        <LmComponentRender key={item._uid} content={item} {...rest} />
      ))}
    </section>
  )
  LmCoreComponents.test_child = () => <span>Original</span>
  LmCoreComponents.test_child = ({
    content,
    onClick
  }: {
    content: { text: string }
    onClick?: MouseEventHandler<HTMLButtonElement>
  }) => <button onClick={onClick}>{content.text}</button>
  try {
    await act(async () =>
      root.render(
        <LmComponentRender
          content={{
            component: 'test_parent',
            body: [{ component: 'test_child', _uid: 'child', text: 'Override' }]
          }}
          onClick={click}
        />
      )
    )
    expect(host.querySelector('section button')?.textContent).toBe('Override')
    host.querySelector('button')!.click()
    expect(click).toHaveBeenCalledOnce()
    await act(async () =>
      root.render(
        <LmComponentRender content={{ component: 'missing_test_block' }} />
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
        <AppContext.Provider value={{ insideStoryblok: true }}>
          <Suspense fallback={<span>Loading</span>}>
            <LmComponentRender
              content={{
                component: 'test_lazy',
                _editable: '<!--#storyblok#{"id":42,"uid":"lazy"}-->'
              }}
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
    await act(async () => vi.dynamicImportSettled())
    expect(host.querySelector('button')?.getAttribute('data-blok-uid')).toBe(
      '42-lazy'
    )
    expect(host.querySelector('button')?.parentElement).toBe(host)
  } finally {
    await act(async () => root.unmount())
    host.remove()
  }
})

it('preserves the missing-content failure instead of rendering a fallback', () => {
  expect(() =>
    renderToStaticMarkup(
      <LmComponentRender content={undefined as unknown as ButtonStoryblok} />
    )
  ).toThrow(TypeError)
})

it('preserves checkout failure when no integration is configured', () => {
  expect(() =>
    renderToStaticMarkup(
      <LmEcommerceCheckout
        content={{ component: 'ecommerce_checkout', _uid: 'checkout' }}
      />
    )
  ).toThrow(TypeError)
})

it.each([
  'toString',
  'constructor',
  'lm_app_providers',
  'lm_link_render',
  'parallax_provider'
])(
  'does not dispatch non-renderer registry key %s from external content',
  (component) => {
    const html = renderToStaticMarkup(
      <LmComponentRender
        content={{ component, _uid: 'external' } as ButtonStoryblok}
      />
    )
    expect(html).toContain('has not been created')
  }
)
