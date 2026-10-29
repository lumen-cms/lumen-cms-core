// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { AppContext } from './context/AppContext'

const bridge = vi.hoisted(() => ({
  load: vi.fn(async () => {}),
  instances: [] as any[]
}))
vi.mock('@storyblok/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@storyblok/react')>()),
  loadStoryblokBridge: bridge.load
}))
import SettingsPageProvider, {
  usePage,
  useSettings
} from './SettingsPageProvider'

function Consumer() {
  return (
    <div>
      {String(usePage()?.title ?? '')}|{String(useSettings()?.title ?? '')}
    </div>
  )
}
describe('Storyblok preview lifecycle', () => {
  it('updates the matching page/settings and destroys the bridge on unmount', async () => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
    class MockBridge {
      listeners: Record<string, any> = {}
      destroy = vi.fn()
      constructor(public options: any) {
        bridge.instances.push(this)
      }
      on(events: string | string[], callback: any) {
        for (const event of [events].flat()) this.listeners[event] = callback
      }
    }
    vi.stubGlobal('StoryblokBridge', MockBridge)
    const host = document.createElement('div')
    const root = createRoot(host)
    await act(async () =>
      root.render(
        <AppContext.Provider value={{ insideStoryblok: true } as any}>
          <SettingsPageProvider
            settings={{ uuid: 'settings', title: 'Global' } as any}
            page={{ uuid: 'page', title: 'Page' } as any}
          >
            <Consumer />
          </SettingsPageProvider>
        </AppContext.Provider>
      )
    )
    await act(async () => {
      await vi.dynamicImportSettled()
    })
    const instance = bridge.instances.at(-1)
    expect(instance.options.resolveLinks).toBe('url')
    expect(instance.options.resolveRelations).toContain('form_container.form')
    await act(async () =>
      instance.listeners.input({
        story: { uuid: 'other', content: { title: 'Unrelated' } }
      })
    )
    expect(host.textContent).toBe('Page|Global')
    await act(async () =>
      instance.listeners.input({
        story: { uuid: 'page', content: { title: 'Edited' } }
      })
    )
    await act(async () =>
      instance.listeners.input({
        story: {
          uuid: 'settings',
          content: { component: 'global', title: 'Edited global' }
        }
      })
    )
    expect(host.textContent).toBe('Edited|Edited global')
    const reload = vi
      .spyOn(window.location, 'reload')
      .mockImplementation(() => {})
    instance.listeners.change({ action: 'change', reload: false })
    expect(reload).not.toHaveBeenCalled()
    instance.listeners.change({ action: 'change', reload: true })
    instance.listeners.published({ action: 'published' })
    expect(reload).toHaveBeenCalledTimes(2)
    await act(async () => root.unmount())
    expect(instance.destroy).toHaveBeenCalledOnce()
    instance.listeners.published({ action: 'published' })
    expect(reload).toHaveBeenCalledTimes(2)
  })
  it('does not load the editor bridge on the public site', async () => {
    bridge.load.mockClear()
    const root = createRoot(document.createElement('div'))
    await act(async () =>
      root.render(
        <SettingsPageProvider settings={{} as any}>
          <Consumer />
        </SettingsPageProvider>
      )
    )
    expect(bridge.load).not.toHaveBeenCalled()
    await act(async () => root.unmount())
  })
  it('cancels bridge creation when unmounted while its loader is pending', async () => {
    let resolve!: () => void
    const loading = new Promise<void>((done) => {
      resolve = done
    })
    bridge.load.mockReturnValueOnce(loading)
    const constructor = vi.fn()
    vi.stubGlobal('StoryblokBridge', constructor)
    const root = createRoot(document.createElement('div'))
    await act(async () =>
      root.render(
        <AppContext.Provider value={{ insideStoryblok: true } as any}>
          <SettingsPageProvider settings={{ uuid: 'settings' } as any}>
            <Consumer />
          </SettingsPageProvider>
        </AppContext.Provider>
      )
    )
    await act(async () => {
      await vi.dynamicImportSettled()
    })
    await act(async () => root.unmount())
    await act(async () => {
      resolve()
      await loading
    })
    expect(constructor).not.toHaveBeenCalled()
  })
})

it('publishes changed UUIDs and cleared pages without a stale child render', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const root = createRoot(document.createElement('div'))
  const seen: string[] = []
  function Snapshot() {
    seen.push(`${usePage()?.title || ''}|${useSettings()?.title}`)
    return null
  }
  const render = (page: any, settings: any) =>
    root.render(
      <SettingsPageProvider page={page} settings={settings}>
        <Snapshot />
      </SettingsPageProvider>
    )
  try {
    await act(async () =>
      render({ uuid: 'a', title: 'A' }, { uuid: 's1', title: 'S1' })
    )
    seen.length = 0
    await act(async () =>
      render({ uuid: 'b', title: 'B' }, { uuid: 's2', title: 'S2' })
    )
    expect(seen).toEqual(['B|S2'])
    seen.length = 0
    await act(async () =>
      render(
        { uuid: 'b', title: 'Ignored same UUID' },
        { uuid: 's2', title: 'Ignored same UUID' }
      )
    )
    expect(seen).toEqual(['B|S2'])
    seen.length = 0
    await act(async () => render(null, { uuid: 's2', title: 'Ignored' }))
    expect(seen).toEqual(['|S2'])
  } finally {
    await act(async () => root.unmount())
  }
})
