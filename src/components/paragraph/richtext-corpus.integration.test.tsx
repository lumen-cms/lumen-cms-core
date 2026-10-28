import { readFileSync } from 'node:fs'
import { it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { renderRichText } from './renderRichText'
const source = process.env.STORYBLOK_RICHTEXT_CORPUS
it.skipIf(!source || !process.env.STORYBLOK_RICHTEXT_BASELINE)(
  'preserves the rich-text corpus HTML',
  () => {
    const corpus = JSON.parse(readFileSync(source!, 'utf8'))
    const result = corpus.map(({ id, document }: any) => ({
      id,
      html: renderToStaticMarkup(renderRichText(document))
    }))
    const baseline = JSON.parse(
      readFileSync(process.env.STORYBLOK_RICHTEXT_BASELINE!, 'utf8')
    )
    const expected = new Map(baseline.map(({ id, html }: any) => [id, html]))
    const differences = result
      .filter(({ id, html }: any) => expected.get(id) !== html)
      .map(({ id }: any) => id)
    expect(differences).toEqual([])
    expect(result.length).toBe(baseline.length)
    expect(result.length).toBeGreaterThan(0)
  },
  120000
)
