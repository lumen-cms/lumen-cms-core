import {
  PlayerStoryblok,
  SectionVideoBgStoryblok
} from '../typings/generated/components-schema'

const map: Record<string, string> = {
  webm: 'video/webm',
  mp4: 'video/mp4',
  ogg: 'video/ogg',
  flv: 'video/x-flv',
  mov: 'video/quicktime',
  avi: 'video/x-msvideo',
  wmv: 'video/x-ms-wmv',
  '3gp': 'video/3gpp'
}

const getVideoType = (path: string): string | undefined =>
  map[path.split('.').pop() || '']

export function selectPlayableSource(
  sources: string[],
  canPlayType?: (type: string) => string
): string {
  if (sources.length < 2) {
    return sources[0] || ''
  }
  const check =
    canPlayType ??
    (typeof document !== 'undefined'
      ? (type: string) => document.createElement('video').canPlayType(type)
      : undefined)
  if (check) {
    const playable = sources.find((source) => {
      const type = getVideoType(source)
      return !type || check(type) !== ''
    })
    if (playable) {
      return playable
    }
  }
  return sources[0]
}

export default function videoUrlHelper(
  content: SectionVideoBgStoryblok | PlayerStoryblok,
  inView?: boolean
): { src: string } {
  if (!inView) {
    return { src: '' }
  }
  if (content.url_internal?.filename || content.url_alternatives?.length) {
    const sources: string[] = []
    if (content.url_internal?.filename) {
      sources.push(content.url_internal.filename)
    }
    content.url_alternatives?.forEach((i) => {
      if (i.filename) {
        sources.push(i.filename)
      }
    })
    return { src: selectPlayableSource(sources) }
  }
  return {
    src: selectPlayableSource(
      (content.url || '')
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean)
    )
  }
}
