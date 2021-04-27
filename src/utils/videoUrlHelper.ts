import { ReactPlayerProps } from 'react-player/lazy'
import {
  PlayerStoryblok,
  SectionVideoBgStoryblok
} from '../typings/generated/components-schema'

const map = {
  webm: 'video/webm',
  mp4: 'video/mp4',
  ogg: 'video/ogg'
}

const getVideoObj = (path: string): string | { src: string; type: string } => {
  const ending = path.split('.').pop() || ''
  const mapped = map[ending]
  return mapped ? { type: mapped, src: path } : path
}

export default function videoUrlHelper(
  content: SectionVideoBgStoryblok | PlayerStoryblok
): ReactPlayerProps['url'] {
  if (content.url_internal?.filename || content.url_alternatives?.length) {
    const source: string[] = []
    if (content.url_internal?.filename) {
      source.push(content.url_internal.filename)
    }
    content.url_alternatives?.forEach((i) => {
      source.push(i.filename)
    })
    return source.map(getVideoObj) as ReactPlayerProps['url']
  }
  return (content.url || '')
    .split(',')
    .map((i) => i.trim())
    .map(getVideoObj) as ReactPlayerProps['url']
}
