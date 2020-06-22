import React from 'react'
import { LinkStoryblok } from '../../typings/generated/components-schema'
import { useAppContext } from '../provider/context/AppContext'
import { getLinkAttrs, LinkType } from '../../utils/linkHandler'
import MuiLink from '@material-ui/core/Link'

export type LmLinkProps = { content: LinkStoryblok }

export function LmLink({ content }: LmLinkProps): JSX.Element {
  const { ComponentRender, LinkRender } = useAppContext()
  if (!content.link?.cached_url) {
    return (
      <>
        {(content.body || []).map((blok, i) => ComponentRender({ content: blok, i }))}
      </>
    )
  }
  const btnProps: any = {
    ...getLinkAttrs(content.link as LinkType, { openExternal: !!content.open_external }),
    naked: true,
    component: LinkRender
  }
  return (
    <MuiLink {...btnProps} className={'lm-link__container'}>
      {(content.body || []).map((blok, i) => ComponentRender({ content: blok, i }))}
    </MuiLink>
  )
}

