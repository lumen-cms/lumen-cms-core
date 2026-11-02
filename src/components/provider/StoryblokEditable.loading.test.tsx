// @vitest-environment happy-dom
import { act, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import { AppContext } from './context/AppContext'
import { LmComponentRender } from '../CoreComponents'
import { LmCoreComponents } from '../../utils/config'
import type { HeadlineStoryblok } from '../../typings/generated/components-schema'

const controller = vi.hoisted(() => {
  let release!: () => void
  const ready = new Promise<void>((resolve) => {
    release = resolve
  })
  return { ready, release, requested: vi.fn() }
})
vi.mock('./StoryblokEditableAttributes', async (importOriginal) => {
  controller.requested()
  await controller.ready
  return importOriginal<typeof import('./StoryblokEditableAttributes')>()
})

it('loads only for preview, retains children during a delayed download, and cleans up pending instances', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const original = LmCoreComponents.headline
  const mounts = vi.fn()
  LmCoreComponents.headline = function Probe({ content }) {
    const [count, setCount] = useState(0)
    useEffect(() => {
      mounts(content._uid)
    }, [content._uid])
    const Tag = content.text === 'replace root' ? 'section' : 'div'
    return (
      <Tag data-probe={content._uid}>
        <input defaultValue="Initial" />
        <button onClick={() => setCount((value) => value + 1)}>{count}</button>
      </Tag>
    )
  }
  const host = document.createElement('div')
  document.body.append(host)
  const root = createRoot(host)
  const blok = (uid: string, editableUid = uid): HeadlineStoryblok => ({
    component: 'headline',
    _uid: uid,
    _editable: `<!--#storyblok#{"id":42,"uid":"${editableUid}"}-->`
  })
  const render = (
    insideStoryblok: boolean,
    content: HeadlineStoryblok,
    transient = false
  ) =>
    root.render(
      <AppContext.Provider value={{ insideStoryblok }}>
        <LmComponentRender key="kept" content={content} />
        {transient && (
          <LmComponentRender key="transient" content={blok('transient')} />
        )}
      </AppContext.Provider>
    )
  try {
    await act(async () => render(false, blok('kept')))
    await act(async () => vi.dynamicImportSettled())
    expect(controller.requested).not.toHaveBeenCalled()
    expect(host.querySelectorAll('template')).toHaveLength(0)

    await act(async () => render(true, blok('kept'), true))
    await vi.waitFor(() => expect(controller.requested).toHaveBeenCalledOnce())
    const kept = host.querySelector<HTMLElement>('[data-probe="kept"]')!
    const transient = host.querySelector<HTMLElement>(
      '[data-probe="transient"]'
    )!
    expect(kept.parentElement).toBe(host)
    expect(kept.hasAttribute('data-blok-uid')).toBe(false)
    kept.querySelector('input')!.value = 'User input'
    await act(async () => kept.querySelector('button')!.click())
    expect(kept.querySelector('button')!.textContent).toBe('1')
    await act(async () => render(true, blok('kept', 'edited')))
    const mountsBeforeLoad = mounts.mock.calls.length
    await act(async () => {
      controller.release()
      await vi.dynamicImportSettled()
    })
    await vi.waitFor(async () => {
      await act(async () => vi.dynamicImportSettled())
      expect(kept.getAttribute('data-blok-uid')).toBe('42-edited')
    })
    expect(host.querySelector('[data-probe="kept"]')).toBe(kept)
    expect(kept.querySelector('input')!.value).toBe('User input')
    expect(kept.querySelector('button')!.textContent).toBe('1')
    expect(mounts).toHaveBeenCalledTimes(mountsBeforeLoad)
    expect(transient.hasAttribute('data-blok-uid')).toBe(false)

    await act(async () =>
      render(true, { ...blok('kept', 'replacement'), text: 'replace root' })
    )
    const replacement = host.querySelector('section')!
    expect(replacement.getAttribute('data-blok-uid')).toBe('42-replacement')
    expect(replacement.querySelector('button')!.textContent).toBe('1')
    expect(kept.hasAttribute('data-blok-uid')).toBe(false)
    expect(kept.classList.contains('storyblok__outline')).toBe(false)
    await act(async () => root.render(null))
    expect(replacement.hasAttribute('data-blok-uid')).toBe(false)
    expect(replacement.classList.contains('storyblok__outline')).toBe(false)
  } finally {
    controller.release()
    await act(async () => root.unmount())
    host.remove()
    LmCoreComponents.headline = original
  }
})
