// @vitest-environment happy-dom
// @vitest-environment-options {"settings":{"handleDisabledFileLoadingAsSuccess":true}}
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import AppHead from './AppHead'
import { getFontBasedOnSetting } from '../../utils/parseFont'

const state = vi.hoisted(() => ({
  preview: false,
  loads: 0,
  settings: { theme_font_default: 'Inter:wght@500' }
}))
vi.mock('../provider/SettingsPageProvider', () => ({
  useSettings: () => state.settings
}))
vi.mock('../provider/context/AppContext', () => ({
  useAppContext: () => ({ insideStoryblok: state.preview })
}))
vi.mock('next/head', () => ({ default: () => null }))
vi.mock('./GoogleFontsLivePreview', async (importOriginal) => {
  state.loads++
  return importOriginal<typeof import('./GoogleFontsLivePreview')>()
})

it('loads only in enabled editor previews and preserves live font updates', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const original = document.createElement('link')
  original.rel = 'stylesheet'
  original.href = getFontBasedOnSetting(state.settings)
  original.setAttribute('data-lm-google-fonts', original.href)
  document.head.append(original)
  const root = createRoot(document.createElement('div'))
  const previewLink = () =>
    document.querySelector<HTMLLinkElement>('#lm-google-fonts-preview')
  try {
    await act(async () => root.render(<AppHead />))
    expect(state.loads).toBe(0)
    expect(previewLink()).toBeNull()
    state.preview = true
    vi.stubEnv('NEXT_PUBLIC_DISABLE_GOOGLE_FONTS', 'true')
    await act(async () => root.render(<AppHead />))
    expect(state.loads).toBe(0)
    vi.stubEnv('NEXT_PUBLIC_DISABLE_GOOGLE_FONTS', '')
    await act(async () => root.render(<AppHead />))
    await act(async () => vi.dynamicImportSettled())
    expect(state.loads).toBe(1)
    expect(previewLink()).toBeNull()
    state.settings = { theme_font_default: 'Roboto:wght@400' }
    await act(async () => root.render(<AppHead />))
    const link = previewLink()!
    expect(link.href).toBe(getFontBasedOnSetting(state.settings))
    expect(link.rel).toBe('stylesheet')
    state.settings = { theme_font_default: 'Lato:wght@700' }
    await act(async () => root.render(<AppHead />))
    expect(previewLink()).toBe(link)
    expect(link.href).toBe(getFontBasedOnSetting(state.settings))
    expect(document.querySelectorAll('#lm-google-fonts-preview')).toHaveLength(
      1
    )
    state.settings = { theme_font_default: 'Inter:wght@500' }
    await act(async () => root.render(<AppHead />))
    expect(previewLink()).toBeNull()
    expect(document.querySelector('[data-lm-google-fonts]')).toBe(original)
  } finally {
    await act(async () => root.unmount())
    original.remove()
    previewLink()?.remove()
  }
})
