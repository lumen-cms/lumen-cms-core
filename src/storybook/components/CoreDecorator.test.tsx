import { renderToStaticMarkup } from 'react-dom/server'
import { load } from 'cheerio'
import { expect, it, vi } from 'vitest'
import CoreDecorator from './CoreDecorator'
import { getFontBasedOnSetting } from '../../utils/parseFont'

vi.mock('../../components/provider/AppProvider', () => ({
  default: ({ children }: any) => children
}))
vi.mock('../../components/provider/SettingsPageProvider', () => ({
  default: ({ children }: any) => children
}))
vi.mock('../../components/global-theme/GlobalTheme', () => ({
  default: ({ children }: any) => children
}))
vi.mock('../../components/list-widget/SearchPaletteProvider', () => ({
  SearchPaletteProvider: ({ children }: any) => children
}))
vi.mock('../../components/layout/LmAppProvidersContainer', () => ({
  LmAppProvidersContainer: ({ children }: any) => children
}))

it.each([{}, { theme_font_default: 'Inter:wght@500' }])(
  'loads the CMS-selected Google Fonts stylesheet for %j',
  (settings) => {
    const $ = load(
      renderToStaticMarkup(
        <CoreDecorator settings={settings}>Preview</CoreDecorator>
      )
    )
    const href = $('link[rel="stylesheet"]').attr('href')!
    expect(href).toBe(getFontBasedOnSetting(settings))
    expect(new URL(href).origin).toBe('https://fonts.googleapis.com')
    expect($.text()).toContain('Preview')
  }
)
