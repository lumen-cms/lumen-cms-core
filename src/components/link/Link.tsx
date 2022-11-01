import React from 'react'
import MuiLink from '@mui/material/Link'
import { LmComponentRender } from '@LmComponentRender'
import { LmCoreComponents } from '@CONFIG'
import { getLinkAttrs, LinkType } from '../../utils/linkHandler'
import { LmLinkProps } from './linkTypes'
import clsx from 'clsx'

export function LmLink({ content }: LmLinkProps): JSX.Element {
  const onClickFunc: any =
    typeof content.on_click_function === 'string'
      ? {
          onClick: () => new Function(content.on_click_function || '')()
        }
      : undefined
  const btnProps: any = {
    ...getLinkAttrs(content.link as LinkType, {
      openExternal: !!content.open_external
    }),
    naked: true,
    component: LmCoreComponents.lm_link_render,
    ...onClickFunc
  }
  if (btnProps.href || btnProps.onClick) {
    return (
      <MuiLink
        {...btnProps}
        style={{
          ...(btnProps.onClick && {
            cursor: 'pointer'
          })
        }}
        className={clsx('lm-link__container', content.class_names?.values)}
      >
        {(content.body || []).map((blok) => (
          <LmComponentRender content={blok} key={blok._uid} />
        ))}
      </MuiLink>
    )
  }
  return (
    <span className={clsx(content.class_names?.values)}>
      {(content.body || []).map((blok) => (
        <LmComponentRender content={blok} key={blok._uid} />
      ))}
    </span>
  )
}
