import { getCmsClickProps } from '../../utils/cmsClickActions'
import MuiLink from '@mui/material/Link'
import { LmNavItemProps } from './navListTypes'
import {
  getLinkAttrs,
  LinkType,
  LinkHandlerProps
} from '../../utils/linkHandler'
import { LmCoreComponents } from '../../utils/config'
import { LmHeadlineCore } from '../headline/HeadlineCore'

export default function LmNavItem({ content, options }: LmNavItemProps) {
  const getBtnProps = (blok: LmNavItemProps['content']) => {
    const onClickFunc = getCmsClickProps(content.on_click_function)
    const args: LinkHandlerProps = blok.link?.linktype
      ? {
          ...getLinkAttrs(blok.link as LinkType, {
            openExternal: !!blok.open_external
          }),
          naked: true,
          component: LmCoreComponents.lm_link_render,
          ...onClickFunc
        }
      : { ...onClickFunc }
    return args.href || args.onClick ? args : {}
  }
  return (
    <MuiLink {...getBtnProps(content)} key={content._uid} color={'inherit'}>
      <LmHeadlineCore
        content={{
          ...options,
          _uid: content._uid,
          component: 'headline',
          typography: options?.typography || 'body1',
          tag: options?.tag || 'span'
        }}
      >
        {content.name}
      </LmHeadlineCore>
    </MuiLink>
  )
}
