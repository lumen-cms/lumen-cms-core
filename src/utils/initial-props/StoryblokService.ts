import { StoryblokTransport } from '../storyblok/StoryblokTransport'
import type {
  ISbStoriesParams,
  ISbStoryParams,
  ISbStoryData
} from 'storyblok-js-client'
import { CONFIG } from '../config'
import { renderRichText } from '@storyblok/richtext'
import { storyblokCacheKey, type StoryblokResponse } from './storyblokResponse'

export class StoryblokServiceClass {
  private devMode = process.env.NODE_ENV !== 'production'
  private query: Record<string, unknown> = {}
  private transport = new StoryblokTransport({
    requestsPerSecond: () => (this.devMode ? 6 : 4),
    onRequest: () => {
      this.requestCount++
    }
  })
  private allCache = new Map<string, ISbStoryData[]>()
  private settingsCache = new Map<string, StoryblokResponse>()
  private inFlight = new Map<string, Promise<ISbStoryData[]>>()
  private draftCache = new Map<string, { expires: number; value: unknown }>()
  public requestCount = 0
  public richTextResolver = { render: renderRichText }

  private async parameters(params: ISbStoriesParams = {}) {
    const draft =
      typeof window === 'undefined' &&
      !process.env.STORYBOOK &&
      (params.version === 'draft' || !!this.query._storyblok || this.devMode)
    const token = draft ? CONFIG.previewToken : CONFIG.publicToken
    return this.transport.parameters(
      {
        ...params,
        ...(this.query._storyblok_release
          ? { from_release: String(this.query._storyblok_release) }
          : {})
      },
      token,
      draft ? 'draft' : 'published'
    )
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
      const result = await this.transport.fetch(slug, current)
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
    const result = await this.transport.fetch(undefined, current)
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
      const first = await this.transport.fetch(undefined, {
        ...current,
        per_page: perPage,
        page: 1
      })
      const pages = Math.ceil(first.total / (first.perPage || perPage))
      const rest = await Promise.all(
        Array.from({ length: Math.max(0, pages - 1) }, (_, index) =>
          this.transport.fetch(undefined, {
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
    this.transport.clearCacheVersions()
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
