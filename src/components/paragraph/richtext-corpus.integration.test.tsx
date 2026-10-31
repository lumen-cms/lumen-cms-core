import { readFileSync } from 'node:fs'
import { it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { renderRichText } from './renderRichText'
type CorpusEntry = { id: string; document: unknown }
type BaselineEntry = { id: string; html: string }
const source = process.env.STORYBLOK_RICHTEXT_CORPUS
it.skipIf(!source || !process.env.STORYBLOK_RICHTEXT_BASELINE)(
  'preserves the rich-text corpus HTML',
  () => {
    const corpus = JSON.parse(readFileSync(source!, 'utf8')) as CorpusEntry[]
    const result = corpus.map(({ id, document }) => ({
      id,
      html: renderToStaticMarkup(renderRichText(document))
    }))
    const baseline = JSON.parse(
      readFileSync(process.env.STORYBLOK_RICHTEXT_BASELINE!, 'utf8')
    ) as BaselineEntry[]
    const expected = new Map(baseline.map(({ id, html }) => [id, html]))
    const differences = result
      .filter(({ id, html }) => expected.get(id) !== html)
      .map(({ id }) => id)
    expect(differences).toEqual([])
    expect(result.length).toBe(baseline.length)
    expect(result.length).toBeGreaterThan(0)
  },
  120000
)
