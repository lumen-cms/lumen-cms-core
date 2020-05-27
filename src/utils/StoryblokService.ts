import StoryblokClient, { StoriesParams } from 'storyblok-js-client'
import { AppPageProps } from '../typings/app'
import { CONFIG } from './config'

let cv = new Date().getTime()

const publicToken = CONFIG.publicToken
const previewToken = CONFIG.previewToken

class StoryblokServiceClass {
  private devMode: boolean
  private token: string
  private readonly previewToken: string
  private client: StoryblokClient
  private query: any

  constructor() {
    this.devMode = false // If true it always loads draft
    this.token = process.env.NODE_ENV === 'development' ? previewToken : publicToken
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
    console.log('flush cashed triggered. ENV Vars:', this.previewToken, this.token)
    console.log('current token:', this.client.getToken())
    cv = new Date().getTime()
    this.client.flushCache()
    return true
  }

  getCacheVersion() { //1571802881726
    return this.client.cacheVersion
  }

  getToken() {
    return this.client.getToken()
  }

  getSearch(slug: string, params: any) {
    return this.client.get(slug, { ...params, ...this.getDefaultParams() })
  }

  getDefaultParams() {
    const params: StoriesParams = {}
    if (!this.devMode) {
      params.cv = cv
    }
    if (this.getQuery('_storyblok') || this.devMode || (typeof window !== 'undefined' && window.storyblok)) {
      this.token = this.previewToken
      this.client.setToken(this.previewToken)
      params.version = 'draft'
    }

    if (typeof window !== 'undefined' && typeof window.StoryblokCacheVersion !== 'undefined') {
      params.cv = window.StoryblokCacheVersion
    }
    if (this.getQuery('_storyblok_release')) {
      // @ts-ignore
      params.from_release = this.getQuery('_storyblok_release')
    }
    return params
  }

  getAll(slug: string, params = {}) {
    return this.client.getAll(slug, {
      ...params,
      ...this.getDefaultParams()
    }, 'stories')
  }

  get(slug: string, params = {}) {
    params = params || {}
    return this.client.get(slug, {
      ...params,
      ...this.getDefaultParams()
    })
  }

  setDevMode() {
    this.devMode = true
  }

  initEditor({ page, setPage, settings, setSettings }: { page?: AppPageProps['page'], setPage: Function, settings?: AppPageProps['settings'], setSettings: Function }) {
    if (window.storyblok) {
      window.storyblok.init({ accessToken: this.token })
      window.storyblok.on(['change'], () => {
          console.log('change::save triggered')
          location.reload()
        }
      )
      window.storyblok.on(['published', 'unpublished'], () => {
          console.log('published triggered')
          fetch(`${location.protocol}//${location.host}/api/clear-cache`)
            .then(() => {
              console.log('flush cashed successful triggered. ENV Vars:', this.previewToken, this.token)
              console.log('after flush: current token:', this.client.getToken())
              location.reload()
            })
            .catch((e) => {
              console.error('error on flush cache:', e)
            })
        }
      )
      window.storyblok.on('input', (event: any) => {
        // console.log( content, event.story.content)

        // todo if this is still works after rewrite... maybe add one for settings as well..
        const newContent = { ...event.story.content, uuid: event.story.uuid }
        if (event.story.content.component === 'page' && event.story.uuid === page?.uuid) {
          console.log('input::input content changed')
          // @ts-ignore
          setPage(window.storyblok.addComments(newContent, event.story.id))
        }
        if (event.story.content.component === 'global' && event.story.uuid === settings?.uuid) {
          console.log('input::input settings changed')
          // @ts-ignore
          setSettings(window.storyblok.addComments(newContent, event.story.id))
        }
        // if (event.story.content.component === 'static_container') {
        //   const newContainerContent = content.allStaticContent.filter((el:any) => el._uid !== event.story.content._uid)
        //   newContainerContent.push(event.story.content)
        //   console.log('input::input static container changed',newContainerContent)
        //   setContent({
        //     ...content,
        //     allStaticContent: newContainerContent
        //   })
        // }
      })
    }
  }

  insideVisualComposer() {
    return !!this.getQuery('_storyblok')
  }

  setQuery(query: any) {
    this.query = query
  }

  getQuery(param: any) {
    return this.query[param]
  }
}

const StoryblokService = new StoryblokServiceClass()

export default StoryblokService
