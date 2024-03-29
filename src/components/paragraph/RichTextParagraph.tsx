import clsx from 'clsx'
import React from 'react'
import Typography from '@material-ui/core/Typography'
import { render } from 'storyblok-rich-text-react-renderer-ts'
import { LmCoreComponents } from '@CONFIG'
import MuiLink from '@material-ui/core/Link'
import { mapTypographyVariant } from '../../utils/muiMapProps'
import { useRichTextStyles } from './richTextStyles'
import { LmRichTextParagraphProps } from './paragraphTypes'
import { useStylesAdvanced } from '../../utils/hooks/useStylesAdvanced'
import { getLinkAttrs } from '../../utils/linkHandler'

export function LmRichTextParagraph({
  content
}: LmRichTextParagraphProps): JSX.Element {
  const classes = useRichTextStyles()
  const advancedClasses = useStylesAdvanced({
    props: content.styles,
    propsMobile: content.styles_mobile,
    propsTablet: content.styles_tablet,
    propsHover: content.styles_hover
  })
  return (
    <Typography
      className={clsx(
        'lm-markup',
        classes.richText,
        content.style,
        content.class_names && content.class_names.values,
        {
          enable__speech: content.enable_speech,
          [advancedClasses.advanced]: content.styles?.length,
          [advancedClasses.advancedTablet]: content.styles_tablet?.length,
          [advancedClasses.advancedMobile]: content.styles_mobile?.length,
          [advancedClasses.advancedHover]: content.styles_hover?.length,
          [`lm-font-${content.font}`]: content.font
        }
      )}
      align={content.align ? content.align : undefined}
      color={content.color ? content.color : undefined}
      component="div"
      style={{
        color:
          content.custom_color && content.custom_color.rgba
            ? content.custom_color.rgba
            : undefined,
        lineHeight: content.line_height ? content.line_height : undefined,
        fontSize: content.font_size ? content.font_size : undefined,
        letterSpacing: content.letter_spacing
          ? content.letter_spacing
          : undefined
      }}
      variant={
        mapTypographyVariant[
          content.typography ? (content.typography as string) : 'body1'
        ]
      }
    >
      {render(content.body, {
        markResolvers: {
          link: function RichtTextLink(children, props) {
            const { href, linktype } = props
            const btnProps: any = {
              ...getLinkAttrs(
                {
                  cached_url: href,
                  linktype
                },
                {}
              ),
              naked: true,
              component: LmCoreComponents.lm_link_render
            }
            return <MuiLink {...btnProps}>{children}</MuiLink>
          }
        }
      })}
    </Typography>
  )
}
