// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import { DrawerContentList } from './DrawerContentList'
const fixture = vi.hoisted(() => ({
  settings: {} as any,
  slug: '/target',
  paths: [] as string[][]
}))
vi.mock('../../provider/SettingsPageProvider', () => ({
  useSettings: () => fixture.settings
}))
vi.mock('../../provider/context/AppContext', () => ({
  useAppContext: () => ({ slug: fixture.slug })
}))
vi.mock('./CollapsibleListSection', () => ({
  DrawerContentRender: ({ content, openedPath }: any) => {
    fixture.paths.push(openedPath)
    return <span>{content._uid}</span>
  }
}))
it('does not traverse menu content again after initialization and keeps the original open path', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const inspected = vi.fn(() => 'Nested data')
  const node = {
    _uid: 'menu',
    component: 'nav_menu',
    body: [
      {
        _uid: 'child',
        component: 'button',
        get title() {
          return inspected()
        }
      }
    ]
  }
  fixture.settings = { drawer_body: [node] }
  fixture.paths = []
  const root = createRoot(document.createElement('div'))
  try {
    await act(async () => root.render(<DrawerContentList />))
    expect(inspected).toHaveBeenCalled()
    const path = fixture.paths.at(-1)
    inspected.mockClear()
    fixture.slug = '/changed'
    await act(async () => root.render(<DrawerContentList />))
    expect(inspected).not.toHaveBeenCalled()
    expect(fixture.paths.at(-1)).toBe(path)
  } finally {
    await act(async () => root.unmount())
  }
})
