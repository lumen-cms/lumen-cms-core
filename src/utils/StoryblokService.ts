import StoryblokClient, { StoriesParams } from 'storyblok-js-client'
import { CONFIG } from './config'

let cv = new Date().getTime()

const { publicToken } = CONFIG
const { previewToken } = CONFIG

/**
 * Keep in sync with lumen-cms-nextjs
 */
class StoryblokServiceClass {
  private devMode: boolean

  private token: string

  private readonly previewToken: string

  private client: StoryblokClient

  private query: any

  constructor() {
    this.devMode = false // If true it always loads draft
    this.token =
      process.env.NODE_ENV === 'development' ? previewToken : publicToken
    this.previewToken = previewToken
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

  flushCache() {
    console.log(
      'flush cashed triggered. ENV Vars:',
      this.previewToken,
      this.token
    )
    console.log('current token:', this.client.getToken())
    cv = new Date().getTime()
    this.client.flushCache()
    return true
  }

  getCacheVersion() {
    // 1571802881726
    return this.client.cacheVersion
  }

  getToken() {
    return this.client.getToken()
  }

  getSearch(slug: string, params: Record<string, unknown>) {
    return this.client.get(slug, { ...params, ...this.getDefaultParams() })
  }

  getDefaultParams() {
    const params: StoriesParams = {}
    if (!this.devMode) {
      params.cv = cv
    }
    if (
      this.getQuery('_storyblok') ||
      this.devMode ||
      (typeof window !== 'undefined' && window.storyblok)
    ) {
      this.token = this.previewToken
      this.client.setToken(this.previewToken)
      params.version = 'draft'
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
    return params
  }

  getAll(slug: string, params = {}) {
    return this.client.getAll(
      slug,
      {
        ...params,
        ...this.getDefaultParams()
      },
      'stories'
    )
  }

  get(slug: string, params = {}) {
    const p = params || {}
    return this.client.get(slug, {
      ...p,
      ...this.getDefaultParams()
    })
  }

  setDevMode() {
    this.devMode = true
  }

  getDevMode() {
    return this.devMode
  }

  insideVisualComposer() {
    return !!this.getQuery('_storyblok')
  }

  setQuery(query: StoryblokServiceClass['query']) {
    this.query = query
  }

  getQuery(param: StoryblokServiceClass['query']) {
    return this.query[param]
  }
}

const StoryblokService = new StoryblokServiceClass()

export default StoryblokService
