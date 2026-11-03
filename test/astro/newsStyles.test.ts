import { expect, it } from 'vitest'
import { collectPageStyles, columnStyles } from '../../packages/lumen-cms-astro/src/lib/blockStyles'
import { createCmsTheme } from '../../packages/lumen-cms-shared/src/theme'

it.each(['news', 'event'])('collects default column sizing for %s before the generated layout renders', component => {
 const news = { component, _uid: 'article', title: 'Article' }
 const expected = columnStyles({ component: 'column', _uid: 'column' }).css
 expect(collectPageStyles({ content: news }, createCmsTheme())).toContain(expected)
})
