import { describe, expect, it } from 'vitest'
import { createTheme } from '@mui/material/styles'
import { unstable_styleFunctionSx as resolveSx } from '@mui/system'
import { getAdvancedSx } from '../../src/utils/hooks/useStylesAdvanced'
import { cmsBreakpoints, compileBlockStyles, getAdvancedRules } from '../../packages/lumen-cms-shared/src/styles'
import type { StylesStoryblok } from '../../src/typings/generated/components-schema'

const legacy = createTheme({ breakpoints: { values: { xs: 0, sm: 600, md: 900, lg: 1280, xl: 1920 } } })
const theme = { palette: { ...legacy.palette }, shadows: legacy.shadows, breakpoints: cmsBreakpoints }
const styles = (fields: Partial<StylesStoryblok>): StylesStoryblok[] => [{ component: 'styles', _uid: 'test', ...fields }]

describe('Astro CMS style compatibility', () => {
  it('matches resolved legacy rules for theme colors, shadows, borders and responsive overrides', () => {
    const props = {
      props: styles({ width: 'calc(100% - 20px)', color_theme: 'primary', elevation: '3', border_color_theme: 'secondary', border_position: ['top', 'left'], css_properties: [{ component: 'item_key_value', _uid: 'var', key: '--accent', value: 'red' }] }),
      propsMobile: styles({ padding: '8px 0', display: 'none' }),
      propsTablet: styles({ margin: '-5pt', background_color_theme: 'primary.dark' }),
      propsHover: styles({ transform: 'scale(1.02)' })
    }
    const rules = getAdvancedRules(props)
    expect(rules && rules(theme)).toEqual(resolveSx({ sx: getAdvancedSx(props), theme: legacy }))
  })

  it('emits real CSS with the original breakpoint edges and hover precedence', () => {
    expect(compileBlockStyles('.lm-test', {
      props: styles({ padding: '16px' }),
      propsMobile: styles({ padding: '4px' }),
      propsTablet: styles({ padding: '8px' }),
      propsHover: styles({ padding: '20px' })
    }, theme)).toBe('.lm-test{padding:16px !important;}@media (min-width:0px) and (max-width:599.95px){.lm-test{padding:4px !important;}}@media (min-width:600px) and (max-width:899.95px){.lm-test{padding:8px !important;}}.lm-test:hover{padding:20px !important;}')
  })

  it('retains vendor properties, variables and literal values without theme coercion', () => {
    const css = compileBlockStyles('.lm-test', { props: styles({ css_properties: [
      { component: 'item_key_value', _uid: 'a', key: '-webkit-background-clip', value: 'text' },
      { component: 'item_key_value', _uid: 'b', key: '--custom', value: '1.5rem' },
      { component: 'item_key_value', _uid: 'c', key: 'max-width', value: 'sm' },
      { component: 'item_key_value', _uid: 'd', key: 'width', value: '0.5' }
    ] }) }, theme)
    expect(css).toBe('.lm-test{-webkit-background-clip:text;--custom:1.5rem;max-width:sm;}')
  })

  it('emits no styles when absent and rejects an untrusted selector', () => {
    expect(compileBlockStyles('.lm-test', {}, theme)).toBe('')
    expect(() => compileBlockStyles('</style>', {}, theme)).toThrow()
  })
})
