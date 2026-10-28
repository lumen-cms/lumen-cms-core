import { createTheme } from '@mui/material/styles'
import { unstable_styleFunctionSx as styleFunctionSx } from '@mui/system'
import { describe, expect, it } from 'vitest'
import { StylesStoryblok } from '../../typings/generated/components-schema'
import {
  cssKeyToCamelCase,
  getAdvancedSx,
  getStyles
} from './useStylesAdvanced'

describe('cssKeyToCamelCase', () => {
  it.each([
    ['-webkit-background-clip', 'WebkitBackgroundClip'],
    ['-moz-osx-font-smoothing', 'MozOsxFontSmoothing'],
    ['-ms-transform', 'msTransform'],
    ['background-clip', 'backgroundClip'],
    ['backgroundClip', 'backgroundClip'],
    ['WebkitBackgroundClip', 'WebkitBackgroundClip'],
    ['--my-var', '--my-var'],
    ['  text-fill-color ', 'textFillColor'],
    ['', '']
  ])('converts %j to %j', (input, expected) => {
    expect(cssKeyToCamelCase(input)).toBe(expected)
  })
})

describe('getStyles css_properties', () => {
  const theme = createTheme()

  it('normalizes keys and skips empty entries', () => {
    const content = {
      _uid: 'styles',
      component: 'styles',
      css_properties: [
        {
          _uid: '1',
          component: 'item_key_value',
          key: '-webkit-background-clip',
          value: 'text'
        },
        {
          _uid: '2',
          component: 'item_key_value',
          key: 'background-image',
          value_color: { rgba: 'rgba(0,0,0,1)' }
        },
        {
          _uid: '3',
          component: 'item_key_value',
          key: '--accent',
          value: 'red'
        },
        { _uid: '4', component: 'item_key_value', key: '', value: 'ignored' },
        { _uid: '5', component: 'item_key_value', key: 'color' }
      ]
    } as StylesStoryblok

    expect(getStyles(content, theme)).toEqual({
      WebkitBackgroundClip: 'text',
      backgroundImage: 'rgba(0,0,0,1)',
      '--accent': 'red'
    })
  })
})

describe('getAdvancedSx', () => {
  const theme = createTheme()
  const styles = (fields: Partial<StylesStoryblok>) =>
    [{ _uid: 'styles', component: 'styles', ...fields }] as StylesStoryblok[]
  const resolve = (sx: ReturnType<typeof getAdvancedSx>) =>
    styleFunctionSx({ sx, theme } as Parameters<typeof styleFunctionSx>[0])

  it('returns false without styles', () => {
    expect(getAdvancedSx({})).toBe(false)
    expect(getAdvancedSx({ props: [] })).toBe(false)
  })

  it('places mobile, tablet and hover styles in their own blocks', () => {
    const sx = getAdvancedSx({
      props: styles({ width: '100%' }),
      propsMobile: styles({ padding: '8px 0px' }),
      propsTablet: styles({ margin: '-5pt' }),
      propsHover: styles({ display: 'inline-block' })
    })
    expect(resolve(sx)).toEqual({
      width: '100% !important',
      [theme.breakpoints.only('xs')]: { padding: '8px 0px !important' },
      [theme.breakpoints.between('sm', 'md')]: { margin: '-5pt !important' },
      '&:hover': { display: 'inline-block !important' }
    })
  })

  it('keeps raw CMS values that match theme keys verbatim', () => {
    const cssProperty = (key: string, value: string) => ({
      _uid: key,
      component: 'item_key_value' as const,
      key,
      value
    })
    const sx = getAdvancedSx({
      props: styles({
        box_shadow: '2',
        css_properties: [
          cssProperty('max-width', 'sm'),
          cssProperty('z-index', 'drawer'),
          cssProperty('-webkit-background-clip', 'text'),
          cssProperty('--column-align', 'center'),
          cssProperty('color', 'grey')
        ]
      })
    })
    expect(resolve(sx)).toEqual({
      'max-width': 'sm',
      'z-index': 'drawer',
      '-webkit-background-clip': 'text',
      '--column-align': 'center',
      color: 'grey',
      'box-shadow': '2'
    })
  })

  it('drops raw values that were invalid CSS but sx would reinterpret', () => {
    const cssProperty = (key: string, value: string) => ({
      _uid: `${key}-${value}`,
      component: 'item_key_value' as const,
      key,
      value
    })
    const sx = getAdvancedSx({
      props: styles({
        css_properties: [
          cssProperty('width', '0.5'),
          cssProperty('height', '1'),
          cssProperty('color', 'primary.main'),
          cssProperty('width', 'fit-content')
        ]
      })
    })
    expect(resolve(sx)).toEqual({ width: 'fit-content' })
    const zero = getAdvancedSx({
      props: styles({ css_properties: [cssProperty('height', '0')] })
    })
    expect(resolve(zero)).toEqual({ height: '0%' })
  })
})
