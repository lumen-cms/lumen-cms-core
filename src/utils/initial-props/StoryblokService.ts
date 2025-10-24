import StoryblokClient, {
  ISbStoriesParams,
  ISbStoryParams
} from 'storyblok-js-client'
import { CONFIG } from '@CONFIG'
import { rootParams } from '../universal/storyblokParamsHelper'

class StoryblokServiceClass {
  private devMode: boolean

  // private token: string

  private client: StoryblokClient

  private query: any

  public richTextResolver: any

  private static cacheVersion?: number
  private static cacheVersionPromise?: Promise<void>

  // deduplication + retry helpers
  private responseCache = new Map<string, any>()
  // 🔒 Define which keys should be permanently cached across pages
  private cacheableKeys = ['settings:published']

  constructor() {
    // this.token =
    //   process.env.NODE_ENV === 'production'
    //     ? CONFIG.publicToken
    //     : CONFIG.previewToken
    this.devMode = process.env.NODE_ENV !== 'production' // If true it always loads draft

    this.client = new StoryblokClient({
      accessToken: CONFIG.previewToken,
      cache: {
        clear: 'manual',
        type: 'none'
      }
    })
    // regression: check https://github.com/storyblok/storyblok-js-client/issues/416
    this.client.resolveNestedRelations = true
    this.richTextResolver = this.client.richTextResolver

    this.query = {}
  }

  private async ensureCacheVersion() {
    // Avoid duplicate requests (important if pages fetch in parallel)
    if (StoryblokServiceClass.cacheVersion) return
    if (StoryblokServiceClass.cacheVersionPromise)
      return StoryblokServiceClass.cacheVersionPromise

    StoryblokServiceClass.cacheVersionPromise = (async () => {
      try {
        // In dev mode (preview token), we can skip this entirely
        if (this.devMode) {
          StoryblokServiceClass.cacheVersion = Date.now() // something unique to prevent stale caching
          return
        }

        const space = await this.client.get('cdn/spaces/me')

        if (!space?.data?.space?.version) {
          throw new Error(
            'Invalid response from Storyblok CDN: missing version'
          )
        }

        StoryblokServiceClass.cacheVersion = space.data.space.version
        console.log(
          `[Storyblok] Cache version set to ${StoryblokServiceClass.cacheVersion}`
        )
      } catch (error) {
        console.error('[Storyblok] Failed to fetch cache version:', error)
        // Fallback to a timestamp to prevent total failure
        StoryblokServiceClass.cacheVersion = Date.now()
      }
    })()

    await StoryblokServiceClass.cacheVersionPromise
  }

  private async processParamsForCaching(params: ISbStoryParams) {
    if (params.version === 'draft') {
      return params
    }
    await this.ensureCacheVersion()
    params.cv = StoryblokServiceClass.cacheVersion
    return params
  }

  private getDefaultParams() {
    const params: ISbStoryParams = {
      version: 'published',
      token: CONFIG.publicToken
    }

    const getFromRelease = this.getQuery('_storyblok_release')
    if (getFromRelease) {
      params.from_release = getFromRelease
    }

    if (process.env.STORYBOOK) {
      params.version = 'published'
      params.token = CONFIG.publicToken
      this.devMode = false
    } else if (
      this.getQuery('_storyblok') ||
      this.devMode ||
      (typeof window !== 'undefined' && window.StoryblokBridge) ||
      params.version === 'draft'
    ) {
      params.version = 'draft'
      params.token = CONFIG.previewToken
      // this.token = params.token
    }
    return params
  }

  private async safeFetch<T>(
    fn: () => Promise<T>,
    fallback: T | (() => T),
    label: string,
    cacheKey?: string,
    retries = 3,
    delayMs = 500
  ): Promise<T> {
    const key = cacheKey || label
    const shouldCache = this.cacheableKeys.some((k) => key.includes(k))

    if (shouldCache && this.responseCache.has(key)) {
      // console.log(`[Storyblok] Reusing cached response for ${key}`)
      return this.responseCache.get(key)
    }

    const isFunction = <U>(val: U | (() => U)): val is () => U =>
      typeof val === 'function'

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const result = await fn()
        if (shouldCache) this.responseCache.set(key, result)
        return result
      } catch (error: any) {
        const transient =
          error?.message?.includes('ECONNRESET') ||
          error?.message?.includes('429') ||
          error?.message?.includes('503')

        if (!transient || attempt === retries) {
          console.error(`[Storyblok] ${label} ultimately failed`, error)
          const fallbackValue = isFunction(fallback) ? fallback() : fallback
          if (shouldCache) this.responseCache.set(key, fallbackValue)
          return fallbackValue
        }

        await new Promise((r) => setTimeout(r, delayMs * attempt))
      }
    }

    throw new Error(`[Storyblok] ${label} failed all retries`)
  }

  public async getStory(slug: string, params?: ISbStoryParams) {
    // Skip requests for service worker, static files, or empty slugs
    if (
      !slug ||
      slug.endsWith('.js') ||
      slug.startsWith('_next') ||
      slug === 'favicon.ico'
    ) {
      // console.warn(`[Storyblok] Skipping getStory for static asset: ${slug}`)
      return null
    }
    const currentParams = await this.processParamsForCaching({
      ...rootParams,
      ...params,
      ...this.getDefaultParams()
    })
    const key = `getStory:${slug}:${currentParams.version}:${
      currentParams.cv ?? 'noCV'
    }`

    return this.safeFetch(
      () => this.client.getStory(slug, currentParams),
      { data: null } as any,
      `getStory(${slug})`,
      key
    )
  }

  public async getStories(params?: ISbStoriesParams) {
    const currentParams: ISbStoriesParams = await this.processParamsForCaching({
      ...rootParams,
      ...params,
      ...this.getDefaultParams()
    })
    const key = `getStories:${JSON.stringify(currentParams)}`

    return this.safeFetch(
      () => this.client.getStories(currentParams),
      { data: { stories: [] } } as any,
      'getStories',
      key
    )
  }

  public async getAll(slug: string, params = {}): Promise<any[]> {
    const currentParams = await this.processParamsForCaching({
      ...rootParams,
      ...params,
      ...this.getDefaultParams()
    })
    const key = `getAll:${slug}:${currentParams.version}:${
      currentParams.cv ?? 'noCV'
    }`

    return this.safeFetch(
      () => this.client.getAll(slug, currentParams, 'stories'),
      [],
      `getAll(${slug})`,
      key
    )
    // const res = await this.client.getAll(slug, currentParams, 'stories')
    // return res as unknown as any[]
  }

  public setDevMode() {
    this.devMode = true
  }

  public getQuery(param: StoryblokServiceClass['query']) {
    return this.query[param]
  }

  public setQuery(params: any) {
    this.query = params
  }
}

export const LmStoryblokService = new StoryblokServiceClass()
