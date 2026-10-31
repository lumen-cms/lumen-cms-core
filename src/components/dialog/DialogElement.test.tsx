// @vitest-environment happy-dom
import { act, type MouseEventHandler } from 'react'
import type LmDialog from './LmDialog'
import type { LmDialogAsyncProps } from './dialogTypes'
import type { DialogStoryblok } from '../../typings/generated/components-schema'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import { LmCoreComponents } from '../../utils/config'

const loaded = vi.hoisted(() => vi.fn())
vi.mock('next/router', () => ({
  useRouter: () => ({ events: { on: vi.fn(), off: vi.fn() } })
}))
// Exercise the real loader and renderer with a Suspense boundary, without
// relying on Next's Webpack preload globals in Vitest.
vi.mock('next/dynamic', async () => {
  const { lazy, Suspense } = await import('react')
  return {
    default: (loader: () => Promise<{ default: typeof LmDialog }>) => {
      const Component = lazy(async () => {
        loaded()
        return loader()
      })
      return (props: LmDialogAsyncProps) => (
        <Suspense fallback={null}>
          <Component {...props} />
        </Suspense>
      )
    }
  }
})
import DialogElement from './DialogElement'

it('keeps its trigger rendered and loads dialog content only when opened', async () => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  const host = document.createElement('div')
  document.body.append(host)
  const root = createRoot(host)
  const previous = LmCoreComponents.dialog_test_button
  LmCoreComponents.dialog_test_button = ({
    content,
    onClick
  }: {
    content: { label: string }
    onClick?: MouseEventHandler<HTMLButtonElement>
  }) => <button onClick={onClick}>{content.label}</button>
  try {
    await act(async () =>
      root.render(
        <DialogElement
          content={{
            component: 'dialog',
            _uid: 'dialog',
            title: 'Lazy dialog',
            trigger: [
              {
                component: 'dialog_test_button',
                _uid: 'trigger',
                label: 'Open dialog'
              }
            ] as unknown as DialogStoryblok['trigger'],
            body: [
              {
                component: 'dialog_test_button',
                _uid: 'body',
                label: 'Dialog body'
              }
            ] as unknown as DialogStoryblok['body']
          }}
        />
      )
    )
    const trigger = host.querySelector('button')!
    expect(trigger.textContent).toBe('Open dialog')
    expect(loaded).not.toHaveBeenCalled()
    await act(async () => {
      trigger.click()
      await vi.dynamicImportSettled()
    })
    expect(loaded).toHaveBeenCalledOnce()
    expect(document.querySelector('[role="dialog"]')?.textContent).toContain(
      'Dialog body'
    )
    expect(host.querySelector('button')).toBe(trigger)
  } finally {
    await act(async () => root.unmount())
    host.remove()
    if (previous) LmCoreComponents.dialog_test_button = previous
    else delete LmCoreComponents.dialog_test_button
  }
})

declare module '../../typings/storyblok-registry' {
  interface StoryblokComponentMap {
    dialog_test_button: {
      component: 'dialog_test_button'
      _uid: string
      label: string
    }
  }
  interface StoryblokRendererPropsOverrides {
    dialog_test_button: {
      content: StoryblokComponentMap['dialog_test_button']
      onClick?: MouseEventHandler<HTMLButtonElement>
    }
  }
}
