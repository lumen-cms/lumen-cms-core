import StoryblokClient, { StoriesParams } from 'storyblok-js-client'
import { CONFIG } from '@CONFIG'

let version: null | number = null

/**
 * Keep in sync with lumen-cms-core
 */
class StoryblokServiceClass {
  private devMode: boolean

  private cv: number

  private token: string

  private readonly previewToken: string

  private client: StoryblokClient

  private query: any

  constructor() {
    this.token = CONFIG.publicToken
    this.previewToken = CONFIG.previewToken
    this.cv = new Date().getDate()
    this.devMode = false // If true it always loads draft
    this.client = new StoryblokClient({
      accessToken:
        process.env.NODE_ENV === 'production' ? this.token : this.previewToken,
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
      console.log('fetch cache version!!', this.cv, version)
      const res = await this.get('cdn/spaces/me', {})
      const cacheVersion = res.data.space.version
      this.cv = cacheVersion
      version = cacheVersion
    } else {
      console.log('set cache version is set!!')
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
      this.client.setToken(this.previewToken)
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