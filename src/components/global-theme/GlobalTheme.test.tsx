import { renderToStaticMarkup } from 'react-dom/server'
import { useTheme } from '@mui/material/styles'
import { expect, it, vi } from 'vitest'
import GlobalTheme from './GlobalTheme'

const fixture = vi.hoisted(() => ({
  settings: {
    _uid: 'settings',
    theme_font_default: undefined as string | undefined
  }
}))
vi.mock('../provider/SettingsPageProvider', () => ({
  useSettings: () => fixture.settings,
  usePage: () => ({})
}))
vi.mock('@mui/material/CssBaseline', () => ({ default: () => null }))
vi.mock('./LmGlobalStyles', () => ({ LmGlobalStyles: () => null }))

function FontProbe() {
  return <span>{useTheme().typography.fontFamily}</span>
}

it.each([
  [undefined, '', 'Nunito'],
  ['', '', 'Nunito'],
  ['Open+Sans:wght@400;700', '', 'Open Sans'],
  [undefined, 'Environment Font', 'Environment Font'],
  ['Open+Sans:wght@400', 'Environment Font', 'Environment Font']
] as const)(
  'uses the font fallback without mutating settings (%s, %s)',
  (font, env, expected) => {
    vi.stubEnv('NEXT_PUBLIC_FONT_DEFAULT', env)
    fixture.settings = Object.freeze({
      _uid: 'settings',
      theme_font_default: font
    })
    expect(
      renderToStaticMarkup(
        <GlobalTheme>
          <FontProbe />
        </GlobalTheme>
      )
    ).toContain(`<span>${expected}</span>`)
    expect(fixture.settings.theme_font_default).toBe(font)
  }
)
