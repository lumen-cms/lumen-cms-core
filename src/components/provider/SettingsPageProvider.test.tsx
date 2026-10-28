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
    await act(async () => root.unmount())
    expect(instance.destroy).toHaveBeenCalledOnce()
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
})
