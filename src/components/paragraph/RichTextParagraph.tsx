import Typography from '@mui/material/Typography'
import { mapTypographyVariant } from '../../utils/muiMapProps'
import { richTextSx } from './richTextStyles'
import { LmRichTextParagraphProps } from './paragraphTypes'
import { getAdvancedSx } from '../../utils/hooks/useStylesAdvanced'
import clsx from 'clsx'
import { renderRichText } from './renderRichText'
import { typographyColor } from '../../utils/themeColor'

export function LmRichTextParagraph({
  content
}: LmRichTextParagraphProps): React.JSX.Element {
  const advancedSx = getAdvancedSx({
    props: content.styles,
    propsMobile: content.styles_mobile,
    propsTablet: content.styles_tablet,
    propsHover: content.styles_hover
  })
  return (
    <Typography
      className={clsx('lm-markup', content.style, content.class_names?.values, {
        enable__speech: !!content.enable_speech,
        [`lm-font-${content.font}`]: !!content.font
      })}
      align={content.align ? content.align : undefined}
      sx={[richTextSx, { color: typographyColor(content.color) }, advancedSx]}
      component="div"
      style={{
        color: content.custom_color?.rgba ?? undefined,
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
      {renderRichText(content.body)}
    </Typography>
  )
}
