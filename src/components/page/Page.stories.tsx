import { boolean } from '@storybook/addon-knobs'
import {
  ButtonStoryblok,
  GlobalStoryblok,
  HeadlineStoryblok,
  PageStoryblok,
  SnackbarStoryblok,
  ToolbarRowSectionStoryblok,
  ToolbarRowStoryblok
} from '../../typings/generated/components-schema'
import {
  darkSectionWithColumns,
  get3ColumnsSection
} from '../../storybook/section'
import { simpleSettings } from '../../storybook/toolbar'
import Layout from '../layout/Layout'
import {
  storyListSearchAutocomplete,
  storyToolbarLogo,
  storyToolbarRow,
  storyToolbarSection
} from '../../storybook/layout/toolbar'
import {
  storyButton,
  storyHeadline,
  storyMenu,
  storyMenuItem,
  storyParagraph
} from '../../storybook/core/various'
import { CONFIG_STORYBOOK } from '../../storybook/components/configStorybook'
import AppSetupProvider from '../provider/AppSetupProvider'
import {
  toggleRightNavigationSelector,
  useNavigationStore
} from '../../utils/state/navigationState'
import SettingsPageProvider from '../provider/SettingsPageProvider'
import { LmPage } from './Page'
import getBasicSettings from '../../storybook/components/basicSettings'
import GlobalTheme from '../global-theme/GlobalTheme'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Design/Layout/Page'
}

const getPropsDrawer = (): PageStoryblok => ({
  _uid: '123',
  component: 'page',
  uuid: '231231',
  property: [],
  body: [
    get3ColumnsSection({
      count: 1,
      knob: 'Body Section 1'
    }),
    get3ColumnsSection({
      count: 2,
      knob: 'Body Section 1'
    })
  ],
  right_body: [
    storyHeadline({ count: 1, knob: 'Right Drawer' }),
    storyHeadline({ count: 2, knob: 'Right Drawer' }),
    storyParagraph({ knob: 'Right Drawer' })
  ]
})

const getToolbarSettings = () => {
  return [
    {
      ...storyToolbarRow({
        options: {
          is_system_bar: true,
          background_color: { rgba: 'rgba(0,0,0,0.3)' }
        },
        knob: CONFIG_STORYBOOK.KNOBS.SYSTEM_BAR
      }),
      body: [
        {
          ...storyToolbarSection({ knob: CONFIG_STORYBOOK.KNOBS.SYSTEM_BAR }),
          body: [
            storyButton({ count: 1, knob: CONFIG_STORYBOOK.KNOBS.SYSTEM_BAR }),
            storyButton({ count: 2, knob: CONFIG_STORYBOOK.KNOBS.SYSTEM_BAR }),
            storyButton({ count: 3, knob: CONFIG_STORYBOOK.KNOBS.SYSTEM_BAR }),
            {
              ...storyMenu({ knob: CONFIG_STORYBOOK.KNOBS.SYSTEM_BAR }),
              body: [
                storyMenuItem({
                  count: 1,
                  knob: CONFIG_STORYBOOK.KNOBS.SYSTEM_BAR
                }),
                storyMenuItem({
                  count: 2,
                  knob: CONFIG_STORYBOOK.KNOBS.SYSTEM_BAR
                }),
                storyMenuItem({
                  count: 3,
                  knob: CONFIG_STORYBOOK.KNOBS.SYSTEM_BAR
                })
              ]
            }
          ]
        }
      ] as ToolbarRowSectionStoryblok[]
    },
    {
      ...storyToolbarRow({ knob: CONFIG_STORYBOOK.KNOBS.TOOLBAR_ROW }),
      body: [
        {
          ...storyToolbarSection({
            count: 1,
            knob: CONFIG_STORYBOOK.KNOBS.TOOLBAR_ROW
          }),
          body: [storyToolbarLogo()]
        },
        {
          ...storyToolbarSection({
            count: 2,
            knob: CONFIG_STORYBOOK.KNOBS.TOOLBAR_ROW
          }),
          body: [
            storyButton({ count: 1, knob: CONFIG_STORYBOOK.KNOBS.TOOLBAR_ROW }),
            storyButton({ count: 2, knob: CONFIG_STORYBOOK.KNOBS.TOOLBAR_ROW }),
            storyButton({ count: 3, knob: CONFIG_STORYBOOK.KNOBS.TOOLBAR_ROW }),
            {
              ...storyMenu({ knob: CONFIG_STORYBOOK.KNOBS.TOOLBAR_ROW }),
              body: [
                storyMenuItem({
                  count: 1,
                  knob: CONFIG_STORYBOOK.KNOBS.TOOLBAR_ROW
                }),
                storyMenuItem({
                  count: 2,
                  knob: CONFIG_STORYBOOK.KNOBS.TOOLBAR_ROW
                }),
                storyMenuItem({
                  count: 3,
                  knob: CONFIG_STORYBOOK.KNOBS.TOOLBAR_ROW
                })
              ]
            },
            storyListSearchAutocomplete({
              knob: CONFIG_STORYBOOK.KNOBS.TOOLBAR_ROW
            })
          ]
        }
      ] as ToolbarRowSectionStoryblok[]
    }
  ] as ToolbarRowStoryblok[]
}

export const Basic = () => (
  <SettingsPageProvider
    settings={simpleSettings}
    page={{
      _uid: '123',
      component: 'page',
      body: [get3ColumnsSection({ knob: 'Body Section 1' })]
    }}
  >
    <GlobalTheme>
      <LmPage />
    </GlobalTheme>
  </SettingsPageProvider>
)
export const WithDrawer = () => {
  const toggleRightNavigation = useNavigationStore(
    toggleRightNavigationSelector
  )
  return (
    <>
      <button type="button" onClick={() => toggleRightNavigation()}>
        open if mobile
      </button>
      <SettingsPageProvider settings={simpleSettings} page={getPropsDrawer()}>
        <GlobalTheme>
          <LmPage />
        </GlobalTheme>
      </SettingsPageProvider>
    </>
  )
}

export const Playground = () => {
  const show = boolean('Show System Bar', true, 'System Bar')
  const customSettingsSystemBar: GlobalStoryblok = {
    ...simpleSettings,
    multi_toolbar: getToolbarSettings(),
    footer: [darkSectionWithColumns]
  }
  if (!show) {
    customSettingsSystemBar.multi_toolbar &&
      customSettingsSystemBar.multi_toolbar.shift()
  }
  const playgroundSettings = {
    ...getBasicSettings(),
    multi_toolbar: customSettingsSystemBar.multi_toolbar,
    footer: customSettingsSystemBar.footer,
    toolbar_main_height: 70,
    toolbar_color: {
      rgba: '#669966'
    },
    toolbar_config: ['fixed'],
    snackbars: [
      {
        component: 'snackbar',
        _uid: '12312',
        width: '98%',
        descriptions: [
          {
            text: 'Hey we are using cookies!!',
            typography: 'body1',
            _uid: 'dsfdfs',
            component: 'headline'
          } as HeadlineStoryblok,
          {
            text: 'As you can see...',
            typography: 'body2',
            _uid: '321',
            component: 'headline'
          } as HeadlineStoryblok
        ],
        close_action: [
          {
            label: 'I understand!',
            component: 'button',
            _uid: '12313'
          } as ButtonStoryblok
        ]
      } as SnackbarStoryblok
    ]
  } as GlobalStoryblok
  return (
    <AppSetupProvider>
      <SettingsPageProvider
        settings={playgroundSettings}
        page={getPropsDrawer()}
      >
        <GlobalTheme>
          <Layout>
            <LmPage />
          </Layout>
        </GlobalTheme>
      </SettingsPageProvider>
    </AppSetupProvider>
  )
}
