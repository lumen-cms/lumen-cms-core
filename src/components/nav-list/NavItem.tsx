import MuiLink from '@mui/material/Link'
import React from 'react'
import { LmNavItemProps } from './navListTypes'
import { getLinkAttrs, LinkType } from '../../utils/linkHandler'
import { LmCoreComponents } from '@CONFIG'
import { LmHeadlineCore } from '../headline/HeadlineCore'

export default function LmNavItem({ content, options }: LmNavItemProps) {
  const getBtnProps = (blok: LmNavItemProps['content']) => {
    const onClickFunc: any =
      typeof content.on_click_function === 'string'
        ? {
            onClick: () => new Function(content.on_click_function || '')()
          }
        : undefined
    const args = blok.link?.linktype
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
