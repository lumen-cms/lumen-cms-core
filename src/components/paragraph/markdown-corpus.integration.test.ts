import { readFileSync, writeFileSync } from 'node:fs'
import { expect, it } from 'vitest'
import { load } from 'cheerio'
import parseMarkdownContent from './markdown-helper'

const baseline = process.env.MARKDOWN_BASELINE
it.skipIf(!baseline)(
  'preserves all captured three-site Markdown documents',
  () => {
    const cases: { source: string; html: string }[] = JSON.parse(
      readFileSync(baseline!, 'utf8')
    )
    const canonical = (html: string) => {
      const $ = load(html, null, false)
      $.root()
        .find('*')
        .addBack()
        .contents()
        .each((_, node) => {
          if (
            node.type === 'text' &&
            !node.data.trim() &&
            ['root', 'ul', 'ol', 'table', 'thead', 'tbody', 'tr'].includes(
              node.parent?.type === 'root'
                ? 'root'
                : node.parent && 'name' in node.parent
                ? node.parent.name
                : ''
            )
          )
            $(node).remove()
        })
      return $.root().html()
    }
    const differences = cases.flatMap((item, index) =>
      canonical(parseMarkdownContent(item.source)) === canonical(item.html)
        ? []
        : [index]
    )
    if (process.env.MARKDOWN_REPORT)
      writeFileSync(
        process.env.MARKDOWN_REPORT,
        JSON.stringify({ documents: cases.length, differences }, null, 2)
      )
    expect(differences).toEqual([])
  }
)
