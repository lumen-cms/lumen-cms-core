import { AvatarStoryblok } from '../../typings/generated/components-schema'

export type LmAvatarProps = {
  content: AvatarStoryblok
}
export type LmMuiAvatarProps = {
  src: string
  size: 'small' | 'large' | 'xlarge' | 'xsmall' | 'xmall' | 'medium' | undefined
}
