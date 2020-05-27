import CardMediaElement from './CardMediaElement'
import CardWrap from './CardWrap'
import CardListActionTitles from './CardLinkActionTitle'
import * as React from 'react'
import { CardListItemProps } from './cards'
import CardDescriptionText from './CardDescriptionText'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import CardListItemActions from './CardListItemActions'

export function LmCardListItem(props: CardListItemProps): JSX.Element {
  const { content, options } = props
  const variants = options.variant || []

  // without media / text only
  if (!content.image || options.hide_image) {
    return (
      <CardWrap {...props}>
        <CardActionArea>
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
        <CardActionArea>
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
        <CardActionArea>
          <CardMediaElement {...props}>
            <CardContent style={{
              padding: variants.includes('overlay_content_no_space') ? 0 : undefined
            }}>
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
      <CardActionArea>
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

