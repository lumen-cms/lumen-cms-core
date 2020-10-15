import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { CreateCSSProperties } from '@material-ui/core/styles/withStyles'
import { StylesStoryblok } from '../../typings/generated/components-schema'

const addImportant = (value?: string) =>
  value ? `${value} !important` : undefined

const getStyles = (
  content: StylesStoryblok,
  theme: Theme
): CreateCSSProperties => ({
  margin: addImportant(content.margin),
  padding: addImportant(content.padding),
  backgroundColor: addImportant(content.background_color?.rgba),
  width: addImportant(content.width),
  height: addImportant(content.height),
  display: addImportant(content.display),
  zIndex: content.z_index,
  position: addImportant(content.position) as any,
  boxShadow: content.elevation
    ? theme.shadows[`${content.elevation}`]
    : undefined,
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
  }
})

export const useStylesAdvanced = makeStyles((theme: Theme) =>
  createStyles({
    advanced: ({
      props
    }: {
      props?: StylesStoryblok[]
      propsTablet?: StylesStoryblok[]
      propsMobile?: StylesStoryblok[]
    }) => {
      if (!props || !props.length) {
        return {} as CreateCSSProperties
      }
      return getStyles(props[0], theme)
    },
    advancedMobile: ({
      propsMobile
    }: {
      props?: StylesStoryblok[]
      propsTablet?: StylesStoryblok[]
      propsMobile?: StylesStoryblok[]
    }) => {
      if (!propsMobile || !propsMobile.length) {
        return {} as CreateCSSProperties
      }
      return {
        [theme.breakpoints.only('xs')]: {
          ...getStyles(propsMobile[0], theme)
        }
      }
    },
    advancedTablet: ({
      propsTablet
    }: {
      props?: StylesStoryblok[]
      propsTablet?: StylesStoryblok[]
      propsMobile?: StylesStoryblok[]
    }) => {
      if (!propsTablet || !propsTablet.length) {
        return {} as CreateCSSProperties
      }
      return {
        [theme.breakpoints.between('sm', 'md')]: {
          ...getStyles(propsTablet[0], theme)
        }
      }
    }
  })
)
