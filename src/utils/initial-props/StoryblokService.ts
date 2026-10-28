import { createApiClient, type ContentApiClient } from '@storyblok/api-client'
import type {
  ISbStoriesParams,
  ISbStoryParams,
  ISbStoryData
} from 'storyblok-js-client'
import { CONFIG } from '@CONFIG'
import { renderRichText } from '@storyblok/richtext'
import { rootParams } from '../universal/storyblokParamsHelper'
import {
  resolveStoryblokPayload,
  storyblokCacheKey,
  type StoryblokPayload,
  type StoryblokResponse
} from './storyblokResponse'
import { timed } from './debugTiming'

type StoryQuery = NonNullable<
  Parameters<ContentApiClient['stories']['list']>[0]
>['query']

export class StoryblokServiceClass {
  private devMode = process.env.NODE_ENV !== 'production'
  private query: Record<string, unknown> = {}
  private clients = new Map<string, ContentApiClient>()
  private versions = new Map<string, Promise<number>>()
  private allCache = new Map<string, ISbStoryData[]>()
  private settingsCache = new Map<string, StoryblokResponse>()
  private inFlight = new Map<string, Promise<ISbStoryData[]>>()
  private draftCache = new Map<string, { expires: number; value: unknown }>()
  public requestCount = 0
  public richTextResolver = { render: renderRichText }

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
          requestsPerSecond: this.devMode ? 6 : 4,
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

  private async parameters(params: ISbStoriesParams = {}) {
    const draft =
      !process.env.STORYBOOK &&
      (params.version === 'draft' ||
        !!this.query._storyblok ||
        this.devMode ||
        (typeof window !== 'undefined' && !!window.StoryblokBridge))
    const token = draft ? CONFIG.previewToken : CONFIG.publicToken
    const current = {
      ...rootParams,
      ...params,
      token,
      version: draft ? ('draft' as const) : ('published' as const)
    }
    if (this.query._storyblok_release)
      current.from_release = String(this.query._storyblok_release)
    if (Array.isArray(current.resolve_relations))
      current.resolve_relations = current.resolve_relations.join(',')
    if (current.resolve_relations !== undefined) current.resolve_level = 2
    if (!draft && !current.cv) current.cv = await this.cacheVersion(token)
    return current
  }

  /**
   * Drafts fetched only because of `next dev` may be reused briefly. Explicit
   * draft/release requests (Storyblok editor, preview) always stay fresh.
   */
  private devDraftTtl(params: ISbStoriesParams = {}) {
    if (
      !this.devMode ||
      typeof window !== 'undefined' ||
      process.env.STORYBOOK ||
      params.version === 'draft' ||
      params.from_release ||
      this.query._storyblok ||
      this.query._storyblok_release
    )
      return 0
    const seconds = Number(process.env.STORYBLOK_DEV_CACHE_TTL ?? 60)
    return Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : 0
  }

  private readDraft<T>(key: string, ttl: number): T | undefined {
    if (!ttl) return undefined
    const entry = this.draftCache.get(key)
    if (!entry) return undefined
    if (entry.expires <= Date.now()) {
      this.draftCache.delete(key)
      return undefined
    }
    return structuredClone(entry.value) as T
  }

  private writeDraft(key: string, ttl: number, value: unknown) {
    if (ttl)
      this.draftCache.set(key, {
        expires: Date.now() + ttl,
        value: structuredClone(value)
      })
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

  private async fetch(
    slug: string | undefined,
    params: ISbStoriesParams
  ): Promise<StoryblokResponse> {
    const client = this.client(params.token!)
    const query = this.requestQuery(params)
    this.requestCount++
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
        this.requestCount++
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

  public async getStory(
    slug: string,
    params?: ISbStoryParams
  ): Promise<StoryblokResponse | null> {
    if (
      !slug ||
      slug.endsWith('.js') ||
      slug.startsWith('_next') ||
      slug === 'favicon.ico'
    )
      return null
    const draftTtl = this.devDraftTtl(params)
    const current = await this.parameters(params)
    const key = storyblokCacheKey({ slug, ...current })
    const draftCached = this.readDraft<StoryblokResponse>(key, draftTtl)
    if (draftCached) return draftCached
    const cacheable =
      current.version === 'published' && slug.split('/').pop() === 'settings'
    const cached = cacheable ? this.settingsCache.get(key) : undefined
    if (cached) return structuredClone(cached)
    try {
      const result = await this.fetch(slug, current)
      if (cacheable) this.settingsCache.set(key, structuredClone(result))
      this.writeDraft(key, draftTtl, result)
      return result
    } catch (error) {
      // Missing pages are expected. Authentication/network errors must fail the
      // build instead of silently publishing an empty page or list.
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        (error.response as { status?: number }).status === 404
      )
        return null
      throw error
    }
  }

  public async getStories(
    params?: ISbStoriesParams
  ): Promise<StoryblokResponse> {
    const draftTtl = this.devDraftTtl(params)
    const current = await this.parameters(params)
    const key = storyblokCacheKey({ method: 'getStories', ...current })
    const draftCached = this.readDraft<StoryblokResponse>(key, draftTtl)
    if (draftCached) return draftCached
    const result = await this.fetch(undefined, current)
    this.writeDraft(key, draftTtl, result)
    return result
  }

  public async getAll(
    slug: string,
    params: ISbStoriesParams = {}
  ): Promise<any[]> {
    if (slug.replace(/^\//, '') !== 'cdn/stories')
      throw new Error('getAll supports cdn/stories only')
    const draftTtl = this.devDraftTtl(params)
    const current = await this.parameters(params)
    const key = storyblokCacheKey({ slug, ...current })
    const cached =
      current.version === 'published'
        ? this.allCache.get(key)
        : this.readDraft<ISbStoryData[]>(key, draftTtl)
    if (cached) return structuredClone(cached)
    const pending = this.inFlight.get(key)
    if (pending) return structuredClone(await pending)
    const request = (async () => {
      const perPage = current.per_page || 100
      const first = await this.fetch(undefined, {
        ...current,
        per_page: perPage,
        page: 1
      })
      const pages = Math.ceil(first.total / (first.perPage || perPage))
      const rest = await Promise.all(
        Array.from({ length: Math.max(0, pages - 1) }, (_, index) =>
          this.fetch(undefined, {
            ...current,
            per_page: perPage,
            page: index + 2
          })
        )
      )
      const stories = [first, ...rest].flatMap(
        (result) => result.data.stories || []
      )
      if (current.version === 'published')
        this.allCache.set(key, structuredClone(stories))
      else this.writeDraft(key, draftTtl, stories)
      return stories
    })()
    this.inFlight.set(key, request)
    try {
      return structuredClone(await request)
    } finally {
      this.inFlight.delete(key)
    }
  }

  public clearCaches() {
    this.draftCache.clear()
    this.allCache.clear()
    this.settingsCache.clear()
    this.versions.clear()
  }

  public setDevMode() {
    this.devMode = true
  }
  public getQuery(param: string) {
    return this.query[param]
  }
  public setQuery(params: Record<string, unknown> = {}) {
    this.query = params
  }
}

export const LmStoryblokService = new StoryblokServiceClass()
