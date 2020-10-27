import StoryblokClient, { StoriesParams } from 'storyblok-js-client'
import { CONFIG } from '@CONFIG'

const cacheStamp = new Date().getDate()

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
    this.cv = cacheStamp
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

  getSearch(slug: string, params: Record<string, unknown>) {
    return this.client.get(slug, { ...params, ...this.getDefaultParams() })
  }

  getCacheVersion() {
    return this.client.cacheVersion
  }

  getDefaultParams() {
    const params: StoriesParams = {
      cv: this.cv
    }

    if (
      typeof window !== 'undefined' &&
      typeof window.StoryblokCacheVersion !== 'undefined'
    ) {
      params.cv = window.StoryblokCacheVersion
    }

    const getFromRelease = this.getQuery('_storyblok_release')
    if (getFromRelease) {
      params.from_release = getFromRelease
    }
    if (
      this.getQuery('_storyblok') ||
      this.devMode ||
      (typeof window !== 'undefined' && window.storyblok)
    ) {
      params.version = 'draft'
      this.client.setToken(CONFIG.previewToken)
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
    const defaultParams = {
      resolve_links: 'url',
      ...params
    }
    return this.client.get(slug, {
      ...defaultParams,
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
