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

  private cacheVersion?: number
  private cacheVersionPromise?: Promise<void>

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
    if (this.cacheVersion) return
    if (this.cacheVersionPromise) return this.cacheVersionPromise

    this.cacheVersionPromise = (async () => {
      try {
        // In dev mode (preview token), we can skip this entirely
        if (this.devMode) {
          console.log('[Storyblok] Dev mode — skipping cache version fetch')
          this.cacheVersion = Date.now() // something unique to prevent stale caching
          return
        }

        console.log('[Storyblok] Fetching cache version from CDN...')
        const space = await this.client.get('cdn/spaces/me')

        if (!space?.data?.space?.version) {
          throw new Error(
            'Invalid response from Storyblok CDN: missing version'
          )
        }

        this.cacheVersion = space.data.space.version
        console.log(`[Storyblok] Cache version set to ${this.cacheVersion}`)
      } catch (error) {
        console.error('[Storyblok] Failed to fetch cache version:', error)
        // Fallback to a timestamp to prevent total failure
        this.cacheVersion = Date.now()
      }
    })()

    await this.cacheVersionPromise
  }

  private async processParamsForCaching(params: ISbStoryParams) {
    if (params.version === 'draft') {
      return params
    }
    await this.ensureCacheVersion()
    params.cv = this.cacheVersion
    return params
  }

  getDefaultParams() {
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

  async getAll(slug: string, params = {}): Promise<any[]> {
    const currentParams = await this.processParamsForCaching({
      ...rootParams,
      ...params,
      ...this.getDefaultParams()
    })
    console.log('getAll', currentParams)
    const res = await this.client.getAll(slug, currentParams, 'stories')
    return res as unknown as any[]
  }

  async getStories(params?: ISbStoriesParams) {
    const currentParams: ISbStoriesParams = await this.processParamsForCaching({
      ...rootParams,
      ...params,
      ...this.getDefaultParams()
    })
    console.log('getStories', currentParams)
    return this.client.getStories(currentParams)
  }

  async getStory(slug: string, params?: ISbStoryParams) {
    const currentParams = await this.processParamsForCaching({
      ...rootParams,
      ...params,
      ...this.getDefaultParams()
    })
    console.log('getStory', currentParams)
    return this.client.getStory(slug, currentParams)
  }

  setDevMode() {
    this.devMode = true
  }

  getQuery(param: StoryblokServiceClass['query']) {
    return this.query[param]
  }

  setQuery(params: any) {
    this.query = params
  }
}

export const LmStoryblokService = new StoryblokServiceClass()
