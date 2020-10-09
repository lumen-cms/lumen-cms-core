import { makeStyles, Theme } from '@material-ui/core/styles'
import { CreateCSSProperties } from '@material-ui/core/styles/withStyles'
import { StylesStoryblok } from '../../typings/generated/components-schema'

const addImportant = (value?: string) =>
  value ? `${value} !important` : undefined
export const useStylesAdvanced = makeStyles((theme: Theme) => ({
  advanced: (props?: StylesStoryblok) => {
    if (!props) {
      return {}
    }
    const rules: CreateCSSProperties = {
      margin: addImportant(props.margin),
      padding: addImportant(props.padding),
      backgroundColor: addImportant(props.background_color?.rgba),
      border: props.border_color?.rgba
        ? addImportant(`1px solid ${props.border_color.rgba}`)
        : undefined,
      '&:hover': {
        color: addImportant(props.hover_color?.rgba),
        backgroundColor: addImportant(props.hover_background_color?.rgba)
      },
      [theme.breakpoints.only('xs')]: {
        margin: addImportant(props.margin_mobile),
        padding: addImportant(props.padding_mobile)
      },
      [theme.breakpoints.between('sm', 'md')]: {
        margin: addImportant(props.margin_tablet),
        padding: addImportant(props.padding_tablet)
      }
    }

    return rules
  }
}))
