import { createApiClient, type ContentApiClient } from '@storyblok/api-client'
import type { ISbStoriesParams, ISbStoryData } from 'storyblok-js-client'
import { rootParams } from '../universal/storyblokParamsHelper'
import {
  resolveStoryblokPayload,
  type StoryblokPayload,
  type StoryblokResponse
} from '../initial-props/storyblokResponse'
import { timed } from '../initial-props/debugTiming'

type StoryQuery = NonNullable<
  Parameters<ContentApiClient['stories']['list']>[0]
>['query']

// Shared delivery mechanics only. Server caches, preview policy and rich-text
// rendering stay in StoryblokService and are not imported by browser search.
export class StoryblokTransport {
  private clients = new Map<string, ContentApiClient>()
  private versions = new Map<string, Promise<number>>()

  constructor(
    private options: {
      requestsPerSecond: () => number
      onRequest?: () => void
    }
  ) {}

  private client(token: string) {
    let client = this.clients.get(token)
    if (!client) {
      client = createApiClient({
        accessToken: token,
        region: 'eu',
        // Retain our build/settings caches; don't introduce another response
        // cache or allow stale fallback responses to mask fetch failures.
        cache: {
          strategy: ({ loadNetwork }) => loadNetwork(),
          cv: 'manual',
          ttlMs: 0
        },
        inlineRelations: false,
        // Each Next build worker has its own client. Keep nine workers below
        // the shared token's 50 req/s origin limit, with room for editor traffic.
        // `next dev` is a single process; 6 req/s is Storyblok's uncached
        // limit for listings of 75-100 entries.
        rateLimit: {
          requestsPerSecond: this.options.requestsPerSecond(),
          adaptToServerHeaders: false,
          cacheAware: false
        },
        retry: { limit: 5, retryOnTimeout: true }
      })
      this.clients.set(token, client)
    }
    return client
  }

  private async cacheVersion(token: string) {
    let pending = this.versions.get(token)
    if (!pending) {
      pending = (async () => {
        const result = await this.client(token).spaces.get()
        if (result.error) throw result.error
        const version = result.data?.space.version
        if (!version)
          throw new Error('Storyblok space response is missing its version')
        return version
      })()
      this.versions.set(token, pending)
      pending.catch(() => this.versions.delete(token))
    }
    return pending
  }

  async parameters(
    params: ISbStoriesParams,
    token: string,
    version: 'draft' | 'published'
  ): Promise<ISbStoriesParams> {
    const current = { ...rootParams, ...params, token, version }
    if (Array.isArray(current.resolve_relations))
      current.resolve_relations = current.resolve_relations.join(',')
    if (current.resolve_relations !== undefined) current.resolve_level = 2
    if (version === 'published' && !current.cv)
      current.cv = await this.cacheVersion(token)
    return current
  }

  clearCacheVersions() {
    this.versions.clear()
  }

  private requestQuery(params: ISbStoriesParams): StoryQuery {
    const { token: _token, ...query } = params
    // Bridge the existing public parameter type to CAPI's stricter query type.
    // Number/enum differences are normalized here; nested filters are retained.
    return {
      ...query,
      resolve_relations: Array.isArray(query.resolve_relations)
        ? query.resolve_relations.join(',')
        : query.resolve_relations,
      resolve_level: query.resolve_level === 2 ? 2 : undefined,
      resolve_assets: query.resolve_assets === 1 ? 1 : undefined,
      resolve_links:
        query.resolve_links === '0'
          ? undefined
          : query.resolve_links === '1'
          ? 'story'
          : query.resolve_links,
      ...(query.from_release
        ? { from_release: Number(query.from_release) }
        : {})
    } as StoryQuery
  }

  async fetch(
    slug: string | undefined,
    params: ISbStoriesParams
  ): Promise<StoryblokResponse> {
    const client = this.client(params.token!)
    const query = this.requestQuery(params)
    this.options.onRequest?.()
    const result = await timed(
      `storyblok ${slug ?? `list page ${params.page ?? 1}`}`,
      async () =>
        slug === undefined
          ? await client.stories.list({ query })
          : await client.stories.get(slug, { query })
    )
    if (result.error) throw result.error
    if (!result.data) throw new Error('Storyblok returned no response data')
    const data: StoryblokPayload = result.data as StoryblokPayload
    // CAPI separates overflow relation/link UUIDs. Fetch them using the same
    // token, language, release and pinned version as the original request.
    const fetchReferences = async (uuids: string[]) => {
      const stories: ISbStoryData[] = []
      for (let offset = 0; offset < uuids.length; offset += 50) {
        this.options.onRequest?.()
        const related = await client.stories.list({
          query: {
            version: query?.version,
            language: query?.language,
            fallback_lang: query?.fallback_lang,
            cv: query?.cv,
            from_release: query?.from_release,
            per_page: 50,
            by_uuids: uuids.slice(offset, offset + 50).join(',')
          }
        })
        if (related.error) throw related.error
        if (!related.data)
          throw new Error('Storyblok returned no related stories')
        stories.push(...(related.data.stories as ISbStoryData[]))
      }
      return stories
    }
    if (data.rel_uuids?.length && params.resolve_relations) {
      data.rels = await fetchReferences(data.rel_uuids)
      if (data.rels.length) delete data.rel_uuids
    }
    if (data.link_uuids?.length && params.resolve_links) {
      data.links = await fetchReferences(data.link_uuids)
    }
    resolveStoryblokPayload(
      data,
      String(params.resolve_relations || ''),
      !!params.resolve_links && params.resolve_links !== '0'
    )
    return {
      data,
      headers: Object.fromEntries(result.response.headers),
      perPage: Number(result.response.headers.get('per-page') || 0),
      total: Number(result.response.headers.get('total') || 0)
    }
  }
}
