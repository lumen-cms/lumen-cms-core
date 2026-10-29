// Adapted from MUI v5.12.3. MIT license: ./LICENSE.
import * as React from 'react'
import { OverridableComponent } from '@mui/types'
import {
  unstable_composeClasses as composeClasses,
  unstable_generateUtilityClass as generateUtilityClass
} from '@mui/utils'
import {
  styled as systemStyled,
  useTheme,
  createTheme,
  useThemeProps as useMaterialThemeProps
} from '@mui/material/styles'
import { unstable_extendSxProp as extendSxProp } from '@mui/system'
import {
  generateGridStyles,
  generateGridSizeStyles,
  generateGridColumnsStyles,
  generateGridColumnSpacingStyles,
  generateGridRowSpacingStyles,
  generateGridDirectionStyles,
  generateGridOffsetStyles,
  generateSizeClassNames,
  generateSpacingClassNames,
  generateDirectionClasses
} from './gridGenerator'
import { GridTypeMap, GridOwnerState, GridProps } from './GridProps'
import type { Breakpoint } from '@mui/system'

const defaultTheme = createTheme()

// widening Theme to any so that the consumer can own the theme structure.
const defaultCreateStyledComponent = systemStyled('div', {
  name: 'MuiGrid2',
  slot: 'Root',
  overridesResolver: (_props, styles) => styles.root
})

function useThemePropsDefault<T extends {}>(props: T) {
  return useMaterialThemeProps({
    props,
    name: 'MuiGrid2'
  })
}

function resolveGridSpacing(
  inProps: GridProps,
  defaults: Pick<
    GridOwnerState,
    'columns' | 'spacing' | 'rowSpacing' | 'columnSpacing'
  >,
  level: number
) {
  const {
    columns: columnsProp,
    spacing: spacingProp,
    rowSpacing: rowSpacingProp,
    columnSpacing: columnSpacingProp
  } = defaults
  const columns = inProps.columns ?? (level ? undefined : columnsProp)
  const spacing = inProps.spacing ?? (level ? undefined : spacingProp)
  const rowSpacing =
    inProps.rowSpacing ??
    inProps.spacing ??
    (level ? undefined : rowSpacingProp)
  const columnSpacing =
    inProps.columnSpacing ??
    inProps.spacing ??
    (level ? undefined : columnSpacingProp)
  return { columns, spacing, rowSpacing, columnSpacing }
}

export default function createGrid(
  options: {
    createStyledComponent?: typeof defaultCreateStyledComponent
    useThemeProps?: typeof useThemePropsDefault
    componentName?: string
  } = {}
) {
  const {
    // This will allow adding custom styled fn (for example for custom sx style function)
    createStyledComponent = defaultCreateStyledComponent,
    useThemeProps = useThemePropsDefault,
    componentName = 'MuiGrid2'
  } = options

  const OverflowContext = React.createContext<boolean | undefined>(undefined)

  const useUtilityClasses = (
    ownerState: GridOwnerState,
    theme: typeof defaultTheme
  ) => {
    const { container, direction, spacing, wrap, gridSize } = ownerState
    const slots = {
      root: [
        'root',
        container && 'container',
        wrap !== 'wrap' && `wrap-xs-${String(wrap)}`,
        ...generateDirectionClasses(direction),
        ...generateSizeClassNames(gridSize),
        ...(container
          ? generateSpacingClassNames(spacing, theme.breakpoints.keys[0])
          : [])
      ]
    }

    return composeClasses(
      slots,
      (slot) => generateUtilityClass(componentName, slot),
      {}
    )
  }

  const GridRoot = createStyledComponent<{
    ownerState: GridOwnerState
  }>(
    generateGridColumnsStyles,
    generateGridColumnSpacingStyles,
    generateGridRowSpacingStyles,
    generateGridSizeStyles,
    generateGridDirectionStyles,
    generateGridStyles,
    generateGridOffsetStyles
  )

  const Grid = React.forwardRef<HTMLDivElement, GridProps>(
    function GridComponent(inProps, ref) {
      const theme = useTheme()
      const themeProps = useThemeProps<
        typeof inProps & { component?: React.ElementType }
      >(inProps)
      const props = extendSxProp(themeProps) as Omit<
        typeof themeProps,
        'color'
      > &
        GridOwnerState // `color` type conflicts with html color attribute.
      const overflow = React.useContext(OverflowContext)
      const {
        className,
        children,
        columns: columnsProp = 12,
        container = false,
        component = 'div',
        direction = 'row',
        wrap = 'wrap',
        spacing: spacingProp = 0,
        rowSpacing: rowSpacingProp = spacingProp,
        columnSpacing: columnSpacingProp = spacingProp,
        disableEqualOverflow: themeDisableEqualOverflow,
        unstable_level: level = 0,
        ...rest
      } = props
      // Because `disableEqualOverflow` can be set from the theme's defaultProps, the **nested** grid should look at the instance props instead.
      let disableEqualOverflow = themeDisableEqualOverflow
      if (level && themeDisableEqualOverflow !== undefined) {
        disableEqualOverflow = inProps.disableEqualOverflow
      }
      // collect breakpoints related props because they can be customized from the theme.
      const gridSize = {} as GridOwnerState['gridSize']
      const gridOffset = {} as GridOwnerState['gridOffset']
      const other: Record<string, any> = {}

      Object.entries(rest).forEach(([key, val]) => {
        if (theme.breakpoints.values[key as Breakpoint] !== undefined) {
          gridSize[key as Breakpoint] = val
        } else if (
          theme.breakpoints.values[key.replace('Offset', '') as Breakpoint] !==
          undefined
        ) {
          gridOffset[key.replace('Offset', '') as Breakpoint] = val
        } else {
          other[key] = val
        }
      })

      const { columns, spacing, rowSpacing, columnSpacing } =
        resolveGridSpacing(
          inProps,
          {
            columns: columnsProp,
            spacing: spacingProp,
            rowSpacing: rowSpacingProp,
            columnSpacing: columnSpacingProp
          },
          level
        )
      const ownerState = {
        ...props,
        level,
        columns,
        container,
        direction,
        wrap,
        spacing,
        rowSpacing,
        columnSpacing,
        gridSize,
        gridOffset,
        disableEqualOverflow: disableEqualOverflow ?? overflow ?? false, // use context value if exists.
        parentDisableEqualOverflow: overflow // for nested grid
      }

      const classes = useUtilityClasses(ownerState, theme)

      let result = (
        <GridRoot
          ref={ref}
          as={component}
          ownerState={ownerState}
          className={[classes.root, className].filter(Boolean).join(' ')}
          {...other}
        >
          {React.Children.map(children, (child) => {
            if (React.isValidElement<GridProps>(child) && child.type === Grid) {
              return React.cloneElement(child, {
                unstable_level: child.props.unstable_level ?? level + 1
              } as GridProps)
            }
            return child
          })}
        </GridRoot>
      )

      if (
        disableEqualOverflow !== undefined &&
        disableEqualOverflow !== (overflow ?? false)
      ) {
        // There are 2 possibilities that should wrap with the OverflowContext to communicate with the nested grids:
        // 1. It is the root grid with `disableEqualOverflow`.
        // 2. It is a nested grid with different `disableEqualOverflow` from the context.
        result = (
          <OverflowContext.Provider value={disableEqualOverflow}>
            {result}
          </OverflowContext.Provider>
        )
      }

      return result
    }
  ) as OverridableComponent<GridTypeMap>

  return Grid
}
