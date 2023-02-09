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

  constructor() {
    // this.token =
    //   process.env.NODE_ENV === 'production'
    //     ? CONFIG.publicToken
    //     : CONFIG.previewToken
    this.devMode = process.env.NODE_ENV !== 'production' // If true it always loads draft

    this.client = new StoryblokClient({
      accessToken: CONFIG.previewToken,
      cache: {
        clear: 'auto',
        type: 'memory'
      }
    })
    // regression: check https://github.com/storyblok/storyblok-js-client/issues/416
    this.client.resolveNestedRelations = true
    this.richTextResolver = this.client.richTextResolver

    this.query = {}
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
    let getAllParams = {
      ...rootParams,
      ...params,
      ...this.getDefaultParams()
    }
    const res = await this.client.getAll(slug, getAllParams, 'stories')
    return res as unknown as any[]
  }

  async getStories(params?: ISbStoriesParams) {
    const currentParams: ISbStoriesParams = {
      ...rootParams,
      ...params,
      ...this.getDefaultParams()
    }
    return this.client.getStories(currentParams)
  }

  async getStory(slug: string, params?: ISbStoryParams) {
    const currentParams = {
      ...rootParams,
      ...params,
      ...this.getDefaultParams()
    }
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
