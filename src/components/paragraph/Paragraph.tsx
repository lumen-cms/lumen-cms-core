import Typography from '@mui/material/Typography'
import parseMarkdownContent from './markdown-helper'
import { mapTypographyVariant } from '../../utils/muiMapProps'
import { richTextSx } from './richTextStyles'
import { LmParagraphProps } from './paragraphTypes'
import clsx from 'clsx'

export default function LmParagraph({
  content
}: LmParagraphProps): React.JSX.Element {
  return (
    <Typography
      sx={richTextSx}
      className={clsx('lm-markup', content.style, content.class_names?.values, {
        [`lm-font-${content.font}`]: !!content.font
      })}
      variant={
        mapTypographyVariant[
          content.typography ? (content.typography as string) : 'body1'
        ]
      }
      component="div"
      dangerouslySetInnerHTML={{
        __html: parseMarkdownContent(content.text as string)
      }}
    />
  )
}
