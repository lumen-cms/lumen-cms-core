type FeedStory = { full_slug: string; name?: string; published_at?: string | null; created_at?: string; content?: { meta_description?: string } }
interface FeedDependencies {
 loadStories(options: { excluding_fields: string; with_tag?: string }): Promise<FeedStory[]>
 loadSettings(): Promise<{ website_title?: string; seo_description?: string }>
}
const xml = (value: unknown) => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;')
const cdata = (value: unknown) => `<![CDATA[${String(value ?? '').replaceAll(']]>', ']]]]><![CDATA[>')}]]>`

export async function feedResponse(request: Request, tags: string | undefined, dependencies: FeedDependencies) {
 const [stories, settings] = await Promise.all([
  dependencies.loadStories({ excluding_fields: 'body,right_body,property,seo_body', with_tag: tags?.split('/').join(',') }),
  dependencies.loadSettings(),
 ])
 const host = request.headers.get('host') || new URL(request.url).host
 let latestPostDate = ''
 const items = stories.map(story => {
  const date = story.published_at || story.created_at || ''
  if (!latestPostDate || Date.parse(date) > Date.parse(latestPostDate)) latestPostDate = date
  // Retain the legacy host-relative links and content serialization contract.
  const href = `${host}/${story.full_slug}`
  return `<item><title>${cdata(story.name || '')}</title><link>${xml(href)}</link><pubDate>${xml(date)}</pubDate><guid isPermaLink="false">${xml(href)}</guid><description>${cdata(story.content?.meta_description || '')}</description><content:encoded>${cdata(String(story.content))}</content:encoded></item>`
 }).join('')
 const body = `<?xml version="1.0" ?><rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0"><channel><title>${cdata(settings.website_title || '')}</title><link>${xml(host)}</link><description>${cdata(settings.seo_description || '')}</description><language></language><lastBuildDate>${xml(latestPostDate)}</lastBuildDate>${items}</channel></rss>`
 return new Response(body, { headers: { 'Content-Type': 'text/xml' } })
}
