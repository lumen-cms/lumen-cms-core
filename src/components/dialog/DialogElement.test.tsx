// @vitest-environment happy-dom
import { act } from 'react'
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
    default: (loader: any) => {
      const Component = lazy(async () => {
        loaded()
        return loader()
      })
      return (props: any) => (
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
  LmCoreComponents.dialog_test_button = ({ content, onClick }: any) => (
    <button onClick={onClick}>{content.label}</button>
  )
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
            ] as any,
            body: [
              {
                component: 'dialog_test_button',
                _uid: 'body',
                label: 'Dialog body'
              }
            ] as any
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
