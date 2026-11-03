import type { ListStoriesData, LmListStoriesProps } from 'lumen-cms-shared/core/components/list-widget/listWidgetTypes'
import { getContentFields } from 'lumen-cms-shared/core/components/list-widget/listUtils/getContentFields'
import { storyMarkers } from '../lib/storyListTemplates'
import { updateStoryImage } from './storyImage'
import { searchLink, type SearchLinkConfig } from 'lumen-cms-shared/search'
import { createRichTextRenderer } from 'lumen-cms-shared/richText'
import { applyRichTextLinkTemplates } from './richTextLinks'
export interface StoryRenderConfig { content: LmListStoriesProps['content']; locale?: string; links: SearchLinkConfig }
const renderListeners = new WeakMap<HTMLElement, AbortController>()
export function renderStoryItems(root: HTMLElement, stories: ListStoriesData[], config: StoryRenderConfig) {
 renderListeners.get(root)?.abort()
 const listeners = new AbortController(); renderListeners.set(root, listeners)
 document.addEventListener('astro:before-swap', () => listeners.abort(), { once: true, signal: listeners.signal })
 const renderRichText = createRichTextRenderer(attrs => ({ href: attrs.linktype === 'story' ? searchLink(String(attrs.href || ''), config.links) : attrs.href, target: attrs.target, ...(attrs.target === '_blank' ? { rel: 'noopener noreferrer' } : {}) }))
 const destination = root.querySelector<HTMLElement>('[data-story-results]')!
 const options = config.content.layout?.[0]
 const empty = root.querySelector<HTMLTemplateElement>('[data-story-template="0"]')!.content.cloneNode(true) as DocumentFragment
 const containerSelector = options?.component === 'card_list' ? '.lm-card-grid' : options?.component === 'nav_list' ? '.lm-nav-items' : options?.component === 'lists' ? '.lm-widget-list' : undefined
 const container = containerSelector ? empty.querySelector(containerSelector)! : empty
 container.replaceChildren()
 for (const story of stories) {
  const fields = getContentFields(story, { locale: config.locale, date_format: options?.component === 'card_list' || options?.component === 'news_list' ? options.date_format : undefined, hide_category: options?.component === 'news_list' ? options.hide_category : undefined })
  const index = (fields.image ? 1 : 0) + (fields.subtitle ? 2 : 0) + (fields.description ? 4 : 0)
  const template = root.querySelector<HTMLTemplateElement>(`[data-story-template="${index}"]`)!
  const item = template.content.querySelector<HTMLElement>('[data-lm-list-item]')!.cloneNode(true) as HTMLElement
  let description = typeof fields.description === 'string' ? fields.description : ''
  if (options?.component === 'card_list' && options.description_max_character && description.length > Number(options.description_max_character)) description = description.slice(0, Math.max(0, Number(options.description_max_character))) + '..'
  const name = [story.content.preview_title, story.content.title, story.content.meta_title, story.name].find(value => typeof value === 'string' && !!value) || ''
  const values = { uuid: story.uuid, title: fields.title || '', name: String(name), subtitle: fields.subtitle, description, link: searchLink(story.full_slug, config.links) }
  const replace = (text: string) => Object.entries(storyMarkers).reduce((result, [field, marker]) => result.replaceAll(marker, String(values[field as keyof typeof values])), text)
  const walker = document.createTreeWalker(item, NodeFilter.SHOW_TEXT)
  const nodes: Text[] = []; while (walker.nextNode()) nodes.push(walker.currentNode as Text)
  for (const node of nodes) {
   if (node.data.includes(storyMarkers.description) && fields.description && typeof fields.description !== 'string') {
    const fragment = document.createRange().createContextualFragment(renderRichText(fields.description))
    applyRichTextLinkTemplates(fragment, root)
    node.replaceWith(fragment)
   } else node.data = replace(node.data)
  }
  for (const element of [item, ...item.querySelectorAll<HTMLElement>('*')]) {
   for (const attribute of [...element.attributes]) {
    if (attribute.name === 'href' && attribute.value.includes(storyMarkers.link)) element.setAttribute('href', values.link)
    else if (attribute.value.includes('__LM_STORY_')) element.setAttribute(attribute.name, replace(attribute.value))
   }
   if (element instanceof HTMLImageElement && element.src.includes('__lm_story_image__') && fields.image) {
    updateStoryImage(element, fields.image)
   }
  }
  container.append(item)
 }
 destination.replaceChildren(empty)
 destination.hidden = !stories.length
 destination.querySelectorAll<HTMLDetailsElement>('[data-mobile-collapse]').forEach(details => {
  const mobile = matchMedia('(max-width:599.95px)')
  const update = () => { details.open = !mobile.matches }
  update(); mobile.addEventListener('change', update, { signal: listeners.signal })
  details.querySelector('summary')?.addEventListener('click', event => { if (!mobile.matches) event.preventDefault() }, { signal: listeners.signal })
 })
}
