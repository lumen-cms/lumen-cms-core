import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import { LmRichTextParagraph } from './RichTextParagraph'
import { LmHeadlineCore } from '../headline/HeadlineCore'

describe('CMS typography colors', () => {
  const theme = createTheme({
    ...createTheme(),
    palette: { secondary: { main: '#686e76' }, text: { secondary: '#123456' } }
  })

  it('resolves stored palette paths in rich text, as on Planet pricing', () => {
    const html = renderToStaticMarkup(
      <CacheProvider value={createCache({ key: 'test' })}>
        <ThemeProvider theme={theme}>
          <LmRichTextParagraph
            content={{
              _uid: 'pricing',
              component: 'rich_text_editor',
              color: 'secondary.main' as any,
              body: {
                type: 'doc',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Pricing description' }]
                  }
                ]
              }
            }}
          />
        </ThemeProvider>
      </CacheProvider>
    )
    expect(html).toContain('color:#686e76')
    expect(html).toContain('Pricing description')
  })

  it('preserves legacy headline color aliases', () => {
    const html = renderToStaticMarkup(
      <CacheProvider value={createCache({ key: 'test' })}>
        <ThemeProvider theme={theme}>
          <LmHeadlineCore
            content={{
              _uid: 'heading',
              component: 'headline',
              color: 'textSecondary'
            }}
          >
            Heading
          </LmHeadlineCore>
        </ThemeProvider>
      </CacheProvider>
    )
    expect(html).toContain('color:#123456')
  })
})
