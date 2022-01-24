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
import CardListItemActionArea from './CardListItemActionArea'

export default function LmCardListItem(props: CardListItemProps): JSX.Element {
  const { content, options } = props
  const variants = options.variant || []
  const onClickFunc: any =
    typeof content.on_click_function === 'string'
      ? {
          onClick: () => new Function(content.on_click_function || '')()
        }
      : undefined
  const btnProps: LinkHandlerProps = content.link?.linktype
    ? {
        ...getLinkAttrs(content.link as LinkType, {
          openExternal: !!content.open_external
        }),
        naked: true,
        component: LmCoreComponents.lm_link_render,
        ...onClickFunc
      }
    : { ...onClickFunc }

  // without media / text only
  if (!content.image || options.hide_image) {
    return (
      <CardWrap {...props}>
        <CardListItemActionArea buttonProps={btnProps} content={content}>
          <CardContent>
            <CardListActionTitles {...props} />
            <CardDescriptionText {...props} />
          </CardContent>
        </CardListItemActionArea>
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
        <CardListItemActionArea buttonProps={btnProps} content={content}>
          <CardMediaElement {...props} />
          {content.description && (
            <CardContent>
              <CardDescriptionText {...props} />
            </CardContent>
          )}
        </CardListItemActionArea>
        <CardListItemActions {...props} />
      </CardWrap>
    )
  }
  // header over media
  if (variants.includes('over_media')) {
    return (
      <CardWrap {...props}>
        <CardListItemActionArea buttonProps={btnProps} content={content}>
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
        </CardListItemActionArea>
        <CardListItemActions {...props} />
      </CardWrap>
    )
  }
  // content title and description bottom
  return (
    <CardWrap {...props}>
      <CardListItemActionArea buttonProps={btnProps} content={content}>
        <CardMediaElement {...props} />
        {(content.description || content.title || content.subtitle) && (
          <CardContent>
            <CardListActionTitles {...props} />
            <CardDescriptionText {...props} />
          </CardContent>
        )}
      </CardListItemActionArea>
      <CardListItemActions {...props} />
    </CardWrap>
  )
}
