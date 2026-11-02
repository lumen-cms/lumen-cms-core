import type { PropsWithChildren } from 'react'
import { usePage, useSettings } from '../provider/SettingsPageProvider'
import { ConfiguredGlobalTheme } from './ConfiguredGlobalTheme'
import { selectThemeConfig } from './themeConfig'

// Compatibility adapter: preview updates still come from the document provider.
export default function GlobalTheme({ children }: PropsWithChildren) {
  const settings = useSettings()
  const page = usePage()
  return (
    <ConfiguredGlobalTheme config={selectThemeConfig(settings, page)}>
      {children}
    </ConfiguredGlobalTheme>
  )
}
