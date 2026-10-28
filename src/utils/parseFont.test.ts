import { describe, expect, it, vi } from 'vitest'
import parseFont, {
  getFontBasedOnSetting,
  getGoogleFontFamilies
} from './parseFont'

const BASE = 'https://fonts.googleapis.com/css2?family='

describe('getGoogleFontFamilies', () => {
  it('merges duplicate families into one sorted entry', () => {
    expect(
      getGoogleFontFamilies({
        theme_font_default: 'Roboto:wght@400',
        theme_font_alt1: 'Martel+Sans:wght@700',
        theme_font_alt2: 'Inter',
        theme_font_alt3: 'Inter:wght@900',
        theme_font_alt4: 'Inter:wght@500'
      })
    ).toEqual(['Roboto', 'Martel+Sans:wght@700', 'Inter:wght@400;500;900'])
  })

  it('treats spaces and plus signs in family names the same', () => {
    expect(
      getGoogleFontFamilies({
        theme_font_default: 'Martel Sans:wght@700',
        theme_font_alt1: 'Martel+Sans:wght@300'
      })
    ).toEqual(['Martel+Sans:wght@300;700'])
  })

  it('converts css1 weights and italics', () => {
    expect(
      getGoogleFontFamilies({
        theme_font_default: 'Roboto:700,400,300italic',
        theme_font_alt1: 'Lato:regular,bold,700i'
      })
    ).toEqual([
      'Roboto:ital,wght@0,400;0,700;1,300',
      'Lato:ital,wght@0,400;0,700;1,700'
    ])
  })

  it('merges italic tuples with plain weights', () => {
    expect(
      getGoogleFontFamilies({
        theme_font_default: 'Nunito:ital,wght@1,400;0,700',
        theme_font_alt1: 'Nunito:wght@300'
      })
    ).toEqual(['Nunito:ital,wght@0,300;0,700;1,400'])
  })

  it('passes unsupported axes through without merging', () => {
    expect(
      getGoogleFontFamilies({
        theme_font_default: 'Open Sans:wdth,wght@75..100,300..800',
        theme_font_alt1: 'Open+Sans:wdth,wght@75..100,300..800',
        theme_font_alt2: 'Open Sans:wght@400'
      })
    ).toEqual(['Open+Sans:wdth,wght@75..100,300..800', 'Open+Sans'])
  })

  it('falls back to Nunito without font settings', () => {
    expect(getGoogleFontFamilies({ theme_font_default: '  ' })).toEqual([
      'Nunito:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700'
    ])
  })
})

describe('getFontBasedOnSetting', () => {
  it('builds a css2 url with display=swap', () => {
    expect(
      getFontBasedOnSetting({
        theme_font_default: 'Inter',
        theme_font_alt1: 'Inter:wght@900'
      })
    ).toBe(`${BASE}Inter:wght@400;900&display=swap`)
  })

  it('omits display=swap when lazy fonts are disabled', () => {
    vi.stubEnv('NEXT_PUBLIC_LAZY_FONT_DISABLE', 'true')
    expect(getFontBasedOnSetting({ theme_font_default: 'Inter' })).toBe(
      `${BASE}Inter`
    )
  })
})

describe('parseFont', () => {
  it('returns the css font family name', () => {
    expect(parseFont('Martel+Sans:wght@700')).toBe('Martel Sans')
    expect(parseFont()).toBeNull()
  })
})
