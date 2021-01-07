import { DrawerProps } from '@material-ui/core/Drawer'
import { createContext, useContext } from 'react'

export type AppSetupProps = {
  drawerVariant: DrawerProps['variant']
}

const defaultValue: AppSetupProps = {
  drawerVariant: 'temporary'
}

export const AppSetupContext = createContext(defaultValue)
export const useAppSetup = () => useContext(AppSetupContext)
