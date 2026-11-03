import { expect, it } from 'vitest'
import { createTheme } from '@mui/material/styles'
import { createGlobalStyles as legacy } from '../../src/utils/hooks/useGlobalStyles'
import { createGlobalStyles } from '../../packages/lumen-cms-shared/src/globalStyles'
import { cmsGlobalCss } from '../../packages/lumen-cms-shared/src/globalCss'
import { createCmsTheme } from '../../packages/lumen-cms-shared/src/theme'

it.each(['light', 'dark'] as const)('preserves every legacy global utility rule in %s mode', mode => {
 const theme = createTheme({ palette: { mode }, breakpoints: { values: { xs: 0, sm: 600, md: 900, lg: 1280, xl: 1920 } } })
 expect(createGlobalStyles(theme)).toEqual(legacy(theme))
})

it('emits legacy spacing, responsive utilities and nested selectors without a UI runtime', () => {
 const css = cmsGlobalCss(createCmsTheme())
 expect(css).toContain('.p-4{padding:32px !important;}')
 expect(css).toContain('.px-sm-2{padding-left:16px !important;padding-right:16px !important;}')
 expect(css).toContain('@media (min-width:900px){')
 expect(css).toContain('.embed-responsive.embed-responsive-16by9{padding-bottom:56.25%;}')
 expect(css).toContain('@keyframes nprogress-pulse{30%{opacity:0.6;}')
})
