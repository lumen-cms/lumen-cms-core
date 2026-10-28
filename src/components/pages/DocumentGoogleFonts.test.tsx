import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { load } from 'cheerio'
import { afterEach, describe, expect, it } from 'vitest'
import { DocumentGoogleFonts } from './DocumentGoogleFonts'
import {
  clearGoogleFontsCss,
  setGoogleFontsCss
} from '../../utils/initial-props/googleFontsCache'
import { getFontBasedOnSetting } from '../../utils/parseFont'

const settings = { theme_font_default: 'Inter:wght@500' }
const href = getFontBasedOnSetting(settings)
const render = (props: Parameters<typeof DocumentGoogleFonts>[0]) =>
  load(renderToStaticMarkup(createElement(DocumentGoogleFonts, props)))

describe('DocumentGoogleFonts', () => {
  afterEach(() => {
    clearGoogleFontsCss()
  })

  it('inlines the cached css', () => {
    setGoogleFontsCss(href, '@font-face{font-family:Inter}')
    const $ = render({ settings, nonce: 'abc' })

    expect($('style').attr('data-lm-google-fonts')).toBe(href)
    expect($('style').attr('nonce')).toBe('abc')
    expect($('style').html()).toBe('@font-face{font-family:Inter}')
    expect($('link[rel="stylesheet"]')).toHaveLength(0)
  })

  it('falls back to a stylesheet link without cached css', () => {
    const $ = render({ settings })

    expect($('style')).toHaveLength(0)
    expect($('link[rel="stylesheet"]').attr('href')).toBe(href)
    expect($('link[rel="stylesheet"]').attr('data-lm-google-fonts')).toBe(href)
  })

  it('renders nothing without settings', () => {
    expect(renderToStaticMarkup(createElement(DocumentGoogleFonts, {}))).toBe(
      ''
    )
  })
})
