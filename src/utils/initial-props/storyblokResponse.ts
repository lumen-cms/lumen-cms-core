import type { ISbStoryData } from 'storyblok-js-client'

type JsonRecord = Record<string, unknown>
export type ResolvedLink = { uuid: string; _stopResolving?: boolean }
export type StoryblokPayload = {
  story?: ISbStoryData
  stories?: ISbStoryData[]
  rels?: ISbStoryData[]
  rel_uuids?: string[]
  links?: ResolvedLink[]
  link_uuids?: string[]
  cv: number
}
export type StoryblokResponse = {
  data: StoryblokPayload
  headers?: Record<string, string>
  perPage: number
  total: number
}

const record = (value: unknown): value is JsonRecord =>
  !!value && typeof value === 'object' && !Array.isArray(value)
const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value))

/**
 * Preserve the serializable relation/link shape supplied to existing renderers.
 * The modern client's recursive inlining can produce cycles; Next page props
 * need the previous bounded nested expansion and independent related objects.
 */
export function resolveStoryblokPayload(
  data: StoryblokPayload,
  resolveRelations: string,
  resolveLinks: boolean
) {
  const fields = resolveRelations.split(',').filter(Boolean)
  const links = new Map<string, ResolvedLink>()
  if (resolveLinks)
    for (const link of data.links || []) {
      links.set(link.uuid, { ...link, _stopResolving: true })
    }
  const relations = new Map<
    string,
    ISbStoryData & { _stopResolving?: boolean }
  >()
  if (fields.length)
    for (const relation of data.rels || []) {
      relations.set(relation.uuid, { ...relation, _stopResolving: true })
    }

  const walk = (
    value: unknown,
    references: Map<string, ISbStoryData>,
    withLinks: boolean
  ) => {
    if (Array.isArray(value)) {
      value.forEach((item) => walk(item, references, withLinks))
      return
    }
    if (!record(value) || value._stopResolving) return
    for (const key of Object.keys(value)) {
      if ((value.component && value._uid) || value.type === 'link') {
        // Keep legacy nested-field matching for consumers with shared field names.
        if (
          fields.some(
            (field) =>
              field.endsWith(`.${key}`) || field === `${value.component}.${key}`
          )
        ) {
          const resolve = (item: unknown) =>
            typeof item === 'string' && references.has(item)
              ? copy(references.get(item)!)
              : item
          value[key] = Array.isArray(value[key])
            ? value[key].map(resolve).filter(Boolean)
            : resolve(value[key])
        }
        const node = value[key]
        if (withLinks && record(node) && node.linktype === 'story') {
          const id = node.fieldtype === 'multilink' ? node.id : node.uuid
          if (typeof id === 'string' && links.has(id))
            node.story = copy(links.get(id)!)
        }
      }
      walk(value[key], references, withLinks)
    }
  }
  // First attach links, then expand one nested relation layer from frozen
  // originals. This also makes mutual references finite and serializable.
  for (const relation of relations.values())
    walk(relation.content, new Map(), true)
  const originals = new Map(
    [...relations].map(([id, value]) => [id, copy(value)])
  )
  for (const relation of relations.values())
    walk(relation.content, originals, false)
  for (const story of data.story ? [data.story] : data.stories || [])
    walk(story.content, relations, true)
  return data
}

/** Stable full keys retain nested filters; the old JSON replacer dropped them. */
export function storyblokCacheKey(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(storyblokCacheKey).join(',')}]`
  if (record(value))
    return `{${Object.keys(value)
      .sort()
      .filter((key) => value[key] !== undefined)
      .map((key) => `${JSON.stringify(key)}:${storyblokCacheKey(value[key])}`)
      .join(',')}}`
  return JSON.stringify(value) ?? 'null'
}
