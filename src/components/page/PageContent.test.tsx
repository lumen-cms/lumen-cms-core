// @vitest-environment happy-dom
import { act, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { useTheme, type Theme } from '@mui/material/styles'
import { expect, it, vi } from 'vitest'
import { LmPage } from './Page'
import { PageContent } from './PageContent'
import GlobalTheme from '../global-theme/GlobalTheme'
import { ConfiguredGlobalTheme } from '../global-theme/ConfiguredGlobalTheme'
import { selectThemeConfig } from '../global-theme/themeConfig'
import SettingsPageProvider from '../provider/SettingsPageProvider'
import { AppContext } from '../provider/context/AppContext'
import type {
  GlobalStoryblok,
  PageStoryblok
} from '../../typings/generated/components-schema'
import type { subscribeStoryblokPreview } from '../provider/storyblokPreview'

const preview = vi.hoisted(() => ({
  options: undefined as
    | Parameters<typeof subscribeStoryblokPreview>[0]
    | undefined
}))
vi.mock('../provider/storyblokPreview', () => ({
  subscribeStoryblokPreview: (
    options: Parameters<typeof subscribeStoryblokPreview>[0]
  ) => {
    preview.options = options
    return () => {}
  }
}))
vi.mock('../CoreComponents', () => ({
  LmComponentRender: ({
    content,
    sectionPosition
  }: {
    content: { _uid: string }
    sectionPosition?: number
  }) => <span data-position={sectionPosition}>{content._uid}</span>
}))
vi.mock('@mui/material/CssBaseline', () => ({ default: () => null }))
vi.mock('../global-theme/LmGlobalStyles', () => ({
  LmGlobalStyles: () => null
}))

const page = (id: string): PageStoryblok => ({
  component: 'page',
  _uid: id,
  uuid: id,
  body: [{ component: 'section', _uid: id + '-body' }]
})
const settings: GlobalStoryblok = {
  component: 'global',
  _uid: 'settings',
  uuid: 'settings',
  theme_base: 'base',
  theme_primary: '#123456',
  promotion: [{ component: 'section', _uid: 'promotion' }]
}

it('renders explicit page content without document providers and preserves promotion rules', () => {
  const render = (content: PageStoryblok) =>
    renderToStaticMarkup(
      <ConfiguredGlobalTheme config={selectThemeConfig(settings)}>
        <PageContent content={content} promotion={<b>Promotion</b>} />
      </ConfiguredGlobalTheme>
    )
  expect(render(page('explicit'))).toContain('explicit-body')
  expect(render(page('explicit'))).toContain('data-position="0"')
  expect(render(page('explicit'))).toContain('Promotion')
  expect(
    render({ ...page('explicit'), property: ['disable_promotion'] })
  ).not.toContain('Promotion')
  const empty = render({ ...page('empty'), body: [] })
  expect(empty).toContain('There is no content yet')
  expect(empty).toContain('Promotion')
  expect(
    renderToStaticMarkup(
      <GlobalTheme>
        <LmPage content={page('fallback')} />
      </GlobalTheme>
    )
  ).toContain('fallback-body')
})

it('propagates preview document edits and navigation through the legacy adapters without rebuilding an unchanged theme', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const host = document.createElement('div')
  const root = createRoot(host)
  let theme: Theme
  function Probe() {
    const currentTheme = useTheme()
    useEffect(() => {
      theme = currentTheme
    }, [currentTheme])
    return (
      <output>
        {currentTheme.palette.primary.main}|{currentTheme.drawer.right}
      </output>
    )
  }
  const render = (content: PageStoryblok) =>
    root.render(
      <AppContext.Provider value={{ insideStoryblok: true }}>
        <SettingsPageProvider page={content} settings={settings}>
          <GlobalTheme>
            <Probe />
            <LmPage content={page('stale-prop')} />
          </GlobalTheme>
        </SettingsPageProvider>
      </AppContext.Provider>
    )
  try {
    await act(async () => {
      render(page('initial'))
      await vi.dynamicImportSettled()
    })
    expect(host.textContent).toContain('initial-body')
    const initialTheme = theme!
    await act(async () =>
      preview.options!.setPage({
        ...page('initial'),
        body: page('edited').body
      })
    )
    expect(host.textContent).toContain('edited-body')
    expect(host.textContent).not.toContain('stale-prop-body')
    expect(theme!).toBe(initialTheme)
    await act(async () =>
      preview.options!.setSettings({
        ...settings,
        promotion: [{ component: 'section', _uid: 'edited-promotion' }]
      })
    )
    expect(host.textContent).toContain('edited-promotion')
    expect(theme!).toBe(initialTheme)
    await act(async () =>
      preview.options!.setSettings({ ...settings, theme_primary: '#654321' })
    )
    expect(host.textContent).toContain('#654321')
    await act(async () =>
      preview.options!.setPage({
        ...page('initial'),
        right_drawer_width: '350'
      })
    )
    expect(host.textContent).toContain('350px')
    await act(async () => render(page('next')))
    expect(host.textContent).toContain('next-body')
    expect(host.textContent).not.toContain('initial-body')
    expect(host.textContent).toContain('254px')
  } finally {
    await act(async () => root.unmount())
  }
})
