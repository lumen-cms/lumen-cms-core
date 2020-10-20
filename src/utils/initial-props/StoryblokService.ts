import StoryblokClient, { StoriesParams } from 'storyblok-js-client'
import { CONFIG } from '@CONFIG'

/**
 * Keep in sync with lumen-cms-core
 */
class StoryblokServiceClass {
  private devMode: boolean

  private cv: number

  private token: string

  private client: StoryblokClient

  private query: any

  constructor() {
    this.token =
      process.env.NODE_ENV === 'production'
        ? CONFIG.publicToken
        : CONFIG.previewToken
    this.cv = new Date().getDate()
    this.devMode = process.env.NODE_ENV !== 'production' // If true it always loads draft
    this.client = new StoryblokClient({
      accessToken: this.token,
      cache: {
        clear: 'auto',
        type: 'memory'
      }
    })

    this.query = {}
  }

  setToken(token: string) {
    this.token = token
    this.client.setToken(token)
  }

  getSearch(slug: string, params: Record<string, unknown>) {
    return this.client.get(slug, { ...params, ...this.getDefaultParams() })
  }

  async setCacheVersion() {
    if (!this.cv) {
      const res = await this.get('cdn/spaces/me', {})
      const cacheVersion = res.data.space.version
      this.cv = cacheVersion
    }
  }

  getDefaultParams() {
    const params: StoriesParams = {
      cv: this.cv
    }

    const getFromRelease = this.getQuery('_storyblok_release')
    if (getFromRelease) {
      params.from_release = getFromRelease
    }
    if (this.devMode) {
      params.version = 'draft'
      this.client.setToken(CONFIG.previewToken)
      delete params.cv
    }
    return params
  }

  async getAll(slug: string, params = {}) {
    return this.client.getAll(
      slug,
      {
        ...params,
        ...this.getDefaultParams()
      },
      'stories'
    )
  }

  async get(slug: string, params = {}) {
    return this.client.get(slug, {
      ...params,
      ...this.getDefaultParams()
    })
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
