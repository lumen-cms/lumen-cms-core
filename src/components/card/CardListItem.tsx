import React from 'react'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import CardMediaElement from './CardMediaElement'
import CardWrap from './CardWrap'
import CardListActionTitles from './CardLinkActionTitle'
import { CardListItemProps } from './cards'
import CardDescriptionText from './CardDescriptionText'
import CardListItemActions from './CardListItemActions'
import { useAppContext } from '../provider/context/AppContext'
import { getLinkAttrs, LinkType } from '../../utils/linkHandler'

export function LmCardListItem(props: CardListItemProps): JSX.Element {
  const { content, options } = props
  const variants = options.variant || []
  const { LinkRender } = useAppContext()
  const btnProps: any = content.link?.cached_url
    ? {
        ...getLinkAttrs(content.link as LinkType, {
          openExternal: !!content.open_external
        }),
        naked: true,
        component: LinkRender
      }
    : {}

  // without media / text only
  if (!content.image || options.hide_image) {
    return (
      <CardWrap {...props}>
        <CardActionArea {...btnProps}>
          <CardContent>
            <CardListActionTitles {...props} />
            <CardDescriptionText {...props} />
          </CardContent>
        </CardActionArea>
        <CardListItemActions {...props} />
      </CardWrap>
    )
  }

  // header on top
  if (variants.includes('header_top')) {
    return (
      <CardWrap {...props}>
        <CardContent>
          <CardListActionTitles {...props} />
        </CardContent>
        <CardActionArea {...btnProps}>
          <CardMediaElement {...props} />
          {content.description && (
            <CardContent>
              <CardDescriptionText {...props} />
            </CardContent>
          )}
        </CardActionArea>
        <CardListItemActions {...props} />
      </CardWrap>
    )
  }
  // header over media
  if (variants.includes('over_media')) {
    return (
      <CardWrap {...props}>
        <CardActionArea {...btnProps}>
          <CardMediaElement {...props}>
            <CardContent
              style={{
                padding: variants.includes('overlay_content_no_space')
                  ? 0
                  : undefined
              }}
            >
              <CardListActionTitles {...props} />
            </CardContent>
          </CardMediaElement>
          {content.description && (
            <CardContent>
              <CardDescriptionText {...props} />
            </CardContent>
          )}
        </CardActionArea>
        <CardListItemActions {...props} />
      </CardWrap>
    )
  }
  // content title and description bottom
  return (
    <CardWrap {...props}>
      <CardActionArea {...btnProps}>
        <CardMediaElement {...props} />
        {(content.description || content.title || content.subtitle) && (
          <CardContent>
            <CardListActionTitles {...props} />
            <CardDescriptionText {...props} />
          </CardContent>
        )}
      </CardActionArea>
      <CardListItemActions {...props} />
    </CardWrap>
  )
}
