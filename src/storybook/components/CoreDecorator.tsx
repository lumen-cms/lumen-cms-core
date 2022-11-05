import AppProvider from '../../components/provider/AppProvider'
import SettingsPageProvider from '../../components/provider/SettingsPageProvider'
import GlobalTheme from '../../components/global-theme/GlobalTheme'
import { LmAppProvidersContainer } from '../../components/layout/LmAppProvidersContainer'
import { getFontBasedOnSetting } from '../../utils/parseFont'
import { FC, PropsWithChildren } from 'react'
import { GlobalStoryblok } from '../../typings/generated/components-schema'

const CoreDecorator: FC<PropsWithChildren<{ settings: Partial<GlobalStoryblok> }>> = ({
                                                                                        settings,
                                                                                        children,
                                                                                        ...rest
                                                                                      }) => {
  return (
    <AppProvider
      content={{
        allCategories: [],
        listWidgetData: {},
        ...rest
      }}
    >
      <SettingsPageProvider settings={settings as any} page={null}>
        <GlobalTheme>
          <LmAppProvidersContainer>
            <div>{children}</div>
            <link href={getFontBasedOnSetting(settings)} rel='stylesheet' />
          </LmAppProvidersContainer>
        </GlobalTheme>
      </SettingsPageProvider>
    </AppProvider>
  )
}
export default CoreDecorator
