import { expect, it } from 'vitest'
import { shadowEffectSx } from '../../src/components/jss/shadowStyles'
import { shadowEffects, shadowEffectsCss } from '../../packages/lumen-cms-shared/src/shadowEffects'

it('preserves every legacy card shadow and hover effect', () => {
 expect(shadowEffects).toEqual(shadowEffectSx)
 const css = shadowEffectsCss()
 expect(css).toContain('.lm-shadow-bouncy:hover{box-shadow:0 4px 20px 0 rgba(0,0,0,0.12);transform:scale(1.04);}')
 expect(css).toContain('.lm-shadow-flowUp:hover{transform:translateY(-.5rem);')
})
