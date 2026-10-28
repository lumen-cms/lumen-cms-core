// Synthetic public content: no CMS tokens or captured customer data.
export const story = (
  uuid: string,
  content: Record<string, unknown>,
  slug = uuid
) => ({
  id: Number(uuid.replace(/\D/g, '')) || 1,
  uuid,
  name: slug,
  slug,
  full_slug: slug,
  created_at: '2026-01-01T00:00:00.000Z',
  published_at: '2026-01-01T00:00:00.000Z',
  content,
  alternates: [],
  group_id: 'group',
  lang: 'default',
  parent_id: 0,
  first_published_at: '2026-01-01T00:00:00.000Z',
  sort_by_date: null,
  position: 0,
  tag_list: [],
  is_startpage: false,
  meta_data: null
})
export const link = {
  fieldtype: 'multilink',
  linktype: 'story',
  id: 'target',
  cached_url: 'old-slug',
  url: ''
}
export const target = {
  uuid: 'target',
  name: 'Target',
  id: 7,
  slug: 'target',
  full_slug: 'translated-target',
  url: 'translated-target'
}
export const related = [
  story('shared', {
    component: 'static_container',
    _uid: 'shared',
    body: [
      {
        component: 'headline',
        _uid: 'related-title',
        text: 'Shared content',
        link
      },
      { component: 'static_section', _uid: 'nested', container: 'inner' }
    ]
  }),
  story('inner', {
    component: 'static_container',
    _uid: 'inner',
    body: [
      { component: 'headline', _uid: 'nested-title', text: 'Nested content' }
    ]
  })
]
export const fixturePage = (slug: string) =>
  story(
    'page-10',
    {
      component: 'page',
      _uid: 'page',
      meta_title: slug,
      body: [
        { component: 'headline', _uid: 'title', text: slug, link },
        {
          component: 'static_section',
          _uid: 'shared-section',
          container: 'shared'
        },
        { component: 'list_stories', _uid: 'list', max_items: 2 },
        { component: 'list_widget', _uid: 'legacy-list', maximum_items: 3 }
      ]
    },
    slug
  )
export const fixtureSettings = (slug: string) =>
  story(
    'settings-20',
    {
      component: 'global',
      _uid: 'settings',
      seo_title: slug,
      toolbar: [
        { component: 'button', _uid: 'nav', label: 'Navigation', link }
      ],
      footer: []
    },
    slug
  )
export function fixtureFetch(requests: URL[]) {
  return async (input: RequestInfo | URL) => {
    const url = new URL(input instanceof Request ? input.url : String(input))
    requests.push(url)
    if (url.pathname.endsWith('/spaces/me'))
      return Response.json({ space: { version: 1 } })
    const path = decodeURIComponent(
      url.pathname.replace('/v2/cdn/stories', '')
    ).replace(/^\//, '')
    if (path)
      return Response.json({
        story: path.endsWith('settings')
          ? fixtureSettings(path)
          : fixturePage(path),
        rels: related,
        links: [target],
        cv: 1
      })
    const page = Number(url.searchParams.get('page') || 1)
    const perPage = Number(url.searchParams.get('per_page') || 2)
    const all = [1, 2, 3].map((id) =>
      story(`item-${id}`, {
        component: 'page',
        _uid: `item-${id}`,
        preview_title: `Item ${id}`,
        meta_robots: false
      })
    )
    return Response.json(
      {
        stories: all.slice((page - 1) * perPage, page * perPage),
        rels: [],
        links: [],
        cv: 1
      },
      {
        headers: { 'per-page': String(perPage), total: String(all.length) }
      }
    )
  }
}
