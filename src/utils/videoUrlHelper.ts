import { ReactPlayerProps } from 'react-player/lazy'
import {
  PlayerStoryblok,
  SectionVideoBgStoryblok
} from '../typings/generated/components-schema'
import { ImageDataUriFallback } from '../components/image/ImageDataUri'

const map = {
  webm: 'video/webm',
  mp4: 'video/mp4',
  ogg: 'video/ogg',
  flv: 'video/x-flv',
  mov: 'video/quicktime',
  avi: 'video/x-msvideo',
  wmv: 'video/x-ms-wmv',
  '3gp': 'video/3gpp'
}

const getVideoObj = (path: string): string | { src: string; type: string } => {
  const ending = path.split('.').pop() || ''
  const mapped = map[ending]
  return mapped ? { type: mapped, src: path } : path
}

// const blurred =
//   'data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAADAAQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAeEAABBQACAwAAAAAAAAAAAAADAAECBBEFBwgiYf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCu8U6AeT63u2LUrDEblDQwFggY40B56wkzb9zUREH/2Q=='
export default function videoUrlHelper(
  content: SectionVideoBgStoryblok | PlayerStoryblok,
  inView?: boolean
): Partial<ReactPlayerProps> {
  if (content.url_internal?.filename || content.url_alternatives?.length) {
    const source: string[] = []
    if (content.url_internal?.filename) {
      source.push(content.url_internal.filename)
    }
    content.url_alternatives?.forEach((i) => {
      source.push(i.filename)
    })
    return {
      url: inView ? (source.map(getVideoObj) as ReactPlayerProps['url']) : '',
      config: {
        file: {
          attributes: {
            poster: ImageDataUriFallback
          }
        }
      }
    }
  }
  return {
    config: {
      file: {
        attributes: {
          poster: ImageDataUriFallback
        }
      }
    },
    url: inView
      ? ((content.url || '')
          .split(',')
          .map((i) => i.trim())
          .map(getVideoObj) as ReactPlayerProps['url'])
      : ''
  }
}
