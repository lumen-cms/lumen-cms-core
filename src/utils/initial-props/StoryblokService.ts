import StoryblokClient, { StoriesParams } from 'storyblok-js-client'
import { CONFIG } from '@CONFIG'
import { rootParams } from '../universal/storyblokParamsHelper'

const cv = Date.now()

class StoryblokServiceClass {
  private devMode: boolean

  private cv?: number

  private token: string

  private client: StoryblokClient

  private query: any

  public richTextResolver: any

  constructor() {
    this.token =
      process.env.NODE_ENV === 'production'
        ? CONFIG.publicToken
        : CONFIG.previewToken
    this.devMode = process.env.NODE_ENV !== 'production' // If true it always loads draft
    this.cv = cv
    this.client = new StoryblokClient({
      accessToken: this.token,
      cache: {
        clear: 'auto',
        type: 'memory'
      }
    })
    this.richTextResolver = this.client.richTextResolver

    this.query = {}
  }

  getSearch(slug: string, params: Record<string, unknown>) {
    return this.client.get(slug, { ...params, ...this.getDefaultParams() })
  }

  getCacheVersion() {
    return this.cv
  }

  getDefaultParams() {
    const params: StoriesParams = {}

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

    if (process.env.STORYBOOK) {
      params.version = 'published'
      // params.cv = this.cv
      params.token = CONFIG.publicToken
      this.devMode = false
    } else if (
      this.getQuery('_storyblok') ||
      this.devMode ||
      (typeof window !== 'undefined' && window.StoryblokBridge)
    ) {
      params.version = 'draft'
      params.token = CONFIG.previewToken
    }
    return params
  }

  async getAll(slug: string, params = {}) {
    return this.client.getAll(
      slug,
      {
        ...rootParams,
        ...params,
        ...this.getDefaultParams()
      },
      'stories'
    )
  }

  async get(slug: string, params = {}) {
    const currentParams = {
      ...rootParams,
      ...params,
      ...this.getDefaultParams()
    }
    const page = await this.client.get(slug, currentParams)
    return page
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
