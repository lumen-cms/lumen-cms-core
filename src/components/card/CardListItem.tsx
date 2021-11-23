import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import { LmCoreComponents } from '@CONFIG'
import CardMediaElement from './CardMediaElement'
import CardWrap from './CardWrap'
import CardListActionTitles from './CardLinkActionTitle'
import CardDescriptionText from './CardDescriptionText'
import CardListItemActions from './CardListItemActions'
import {
  getLinkAttrs,
  LinkHandlerProps,
  LinkType
} from '../../utils/linkHandler'
import { CardListItemProps } from './cardTypes'
import { FC } from 'react'

const ActionArea: FC<{ buttonProps: LinkHandlerProps }> = ({
  children,
  buttonProps
}) =>
  buttonProps.href ? (
    <CardActionArea {...buttonProps}>{children}</CardActionArea>
  ) : (
    <>{children}</>
  )
export default function LmCardListItem(props: CardListItemProps): JSX.Element {
  const { content, options } = props
  const variants = options.variant || []
  let hasLink = content.link?.cached_url || content.link?.url
  const btnProps: any = hasLink
    ? {
        ...getLinkAttrs(content.link as LinkType, {
          openExternal: !!content.open_external
        }),
        naked: true,
        component: LmCoreComponents.lm_link_render
      }
    : {}

  // without media / text only
  if (!content.image || options.hide_image) {
    return (
      <CardWrap {...props}>
        <ActionArea buttonProps={btnProps}>
          <CardContent>
            <CardListActionTitles {...props} />
            <CardDescriptionText {...props} />
          </CardContent>
        </ActionArea>
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
        <ActionArea buttonProps={btnProps}>
          <CardMediaElement {...props} />
          {content.description && (
            <CardContent>
              <CardDescriptionText {...props} />
            </CardContent>
          )}
        </ActionArea>
        <CardListItemActions {...props} />
      </CardWrap>
    )
  }
  // header over media
  if (variants.includes('over_media')) {
    return (
      <CardWrap {...props}>
        <ActionArea buttonProps={btnProps}>
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
        </ActionArea>
        <CardListItemActions {...props} />
      </CardWrap>
    )
  }
  // content title and description bottom
  return (
    <CardWrap {...props}>
      <ActionArea buttonProps={btnProps}>
        <CardMediaElement {...props} />
        {(content.description || content.title || content.subtitle) && (
          <CardContent>
            <CardListActionTitles {...props} />
            <CardDescriptionText {...props} />
          </CardContent>
        )}
      </ActionArea>
      <CardListItemActions {...props} />
    </CardWrap>
  )
}
