import createGrid from './createGrid'
import type { GridProps } from './GridProps'
import type {
  ComponentsOverrides,
  ComponentsVariants
} from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey {
    MuiGrid2: 'root'
  }
  interface ComponentsPropsList {
    MuiGrid2: GridProps
  }
  interface Components<Theme = unknown> {
    MuiGrid2?: {
      defaultProps?: Partial<GridProps>
      styleOverrides?: ComponentsOverrides<Theme>['MuiGrid2']
      variants?: ComponentsVariants<Theme>['MuiGrid2']
    }
  }
}
export type { GridProps as Grid2Props } from './GridProps'
export default createGrid()
