import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { CreateCSSProperties } from '@material-ui/core/styles/withStyles'
import { StylesStoryblok } from '../../typings/generated/components-schema'

const addImportant = (value?: string) =>
  value ? `${value} !important` : undefined
export const useStylesAdvanced = makeStyles((theme: Theme) =>
  createStyles({
    // don't know why this not works in build
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    advanced: (props?: StylesStoryblok[]) => {
      if (!props || !props.length) {
        const temp: CreateCSSProperties = {}
        return temp
      }
      const content = props[0]
      const rules: CreateCSSProperties = {
        margin: addImportant(content.margin),
        padding: addImportant(content.padding),
        backgroundColor: addImportant(content.background_color?.rgba),
        width: addImportant(content.width),
        height: addImportant(content.height),
        display: addImportant(content.display),
        position: content.position,
        top: content.top,
        left: content.left,
        bottom: content.bottom,
        right: content.right,
        border: content.border_color?.rgba
          ? addImportant(`1px solid ${content.border_color.rgba}`)
          : undefined,
        '&:hover': {
          color: addImportant(content.hover_color?.rgba),
          backgroundColor: addImportant(content.hover_background_color?.rgba)
        },
        [theme.breakpoints.only('xs')]: {
          margin: addImportant(content.margin_mobile),
          padding: addImportant(content.padding_mobile),
          display: addImportant(content.display_mobile)
        },
        [theme.breakpoints.between('sm', 'md')]: {
          margin: addImportant(content.margin_tablet),
          padding: addImportant(content.padding_tablet),
          display: addImportant(content.display_tablet)
        }
      }
      return rules
    }
  })
)
