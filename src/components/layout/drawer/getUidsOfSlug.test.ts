import { describe, expect, it } from 'vitest'
import { getUidsOfSlug } from './getUidsOfSlug'

const button = (_uid: string, cached_url: string) => ({
  _uid,
  component: 'button',
  link: { cached_url }
})
const menu = (_uid: string, body: unknown[]) => ({
  _uid,
  component: 'nav_menu',
  body
})

describe('drawer active path', () => {
  const content = [
    menu('sports', [
      button('football', 'sports/football'),
      menu('hockey', [button('training', 'sports/hockey/training')])
    ]),
    button('about', 'about')
  ]
  it.each([
    ['/sports/hockey/training', ['sports', 'hockey', 'training']],
    ['/sports/football', ['sports', 'football']],
    ['/about', ['about']],
    ['/sports', ['sports', 'football']],
    ['/missing', []],
    ['/', []],
    ['', []],
    [undefined, []]
  ])('preserves the first matching path for %s', (slug, expected) => {
    expect(getUidsOfSlug(content, slug)).toEqual(expected)
  })
  it('keeps wrapper UIDs in mega menus and follows the first duplicate link', () => {
    expect(
      getUidsOfSlug(
        [
          menu('menu', [
            {
              _uid: 'row',
              body: [
                {
                  _uid: 'column',
                  body: [button('first', 'target'), button('second', 'target')]
                }
              ]
            }
          ])
        ],
        '/target'
      )
    ).toEqual(['menu', 'row', 'column', 'first'])
  })
  it('does not include sibling UIDs or require a UID on wrappers', () => {
    expect(
      getUidsOfSlug(
        [
          menu('menu', [
            button('unrelated', 'other'),
            { body: [button('target', 'target')] }
          ])
        ],
        '/target'
      )
    ).toEqual(['menu', 'target'])
  })
  it('tolerates null, empty, and missing-link content without mutating it', () => {
    const content = [
      null,
      {},
      [],
      { _uid: 'empty', body: [] },
      menu('parent', [button('target', 'target')])
    ]
    const before = JSON.stringify(content)
    expect(getUidsOfSlug(content, '/target')).toEqual(['parent', 'target'])
    expect(JSON.stringify(content)).toBe(before)
  })
  it('preserves leaf-parent matching when object property order differs', () => {
    const content = [
      { body: [button('child', 'target')], ...button('parent', 'target') }
    ]
    expect(getUidsOfSlug(content, '/target')).toEqual(['parent', 'child'])
  })
})
