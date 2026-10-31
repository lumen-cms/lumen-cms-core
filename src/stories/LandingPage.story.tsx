import type {
  GlobalStoryblok,
  PageStoryblok
} from '../typings/generated/components-schema'
import { StoryFn } from '@storybook/react'
import { CONFIG } from '../utils/config'
import { INITIAL_VIEWPORTS } from 'storybook/viewport'
import SettingsPageProvider from '../components/provider/SettingsPageProvider'
import GlobalTheme from '../components/global-theme/GlobalTheme'
import AppProvider from '../components/provider/AppProvider'
import { LmAppProvidersContainer } from '../components/layout/LmAppProvidersContainer'
import getPageProps from '../utils/initial-props/getPageProps'
import Layout from '../components/layout/Layout'
import { LmPage } from '../components/page/Page'
import AppSetupProvider from '../components/provider/AppSetupProvider'

const defaultOptions = {
  locale: 'en',
  insideStoryblok: false,
  defaultLocale: 'en',
  locales: ['en', 'de']
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Landing Page/Website',
  parameters: {
    layout: 'fullscreen',
    // 👇 The viewports object from the Essentials addon
    viewport: {
      // 👇 The viewports you want to use
      options: INITIAL_VIEWPORTS
      // 👇 Your own default viewport
      // defaultViewport: 'responsive'
    }
  }
}

type LandingPageData = Awaited<ReturnType<typeof getPageProps>> & {
  formData?: Record<string, unknown>
}

const StoryWrap = (data: LandingPageData) => (
  <AppProvider
    content={{
      allCategories: [],
      listWidgetData: {},
      allStaticContent: [],
      formData: data.formData || {}
    }}
  >
    <SettingsPageProvider
      settings={data.settings || ({} as GlobalStoryblok)}
      page={data.page || ({} as PageStoryblok)}
    >
      <AppSetupProvider>
        <GlobalTheme>
          <LmAppProvidersContainer>
            <Layout>
              <LmPage />
            </Layout>
            {data.settings?.custom_css && (
              <style
                dangerouslySetInnerHTML={{
                  __html: data.settings.custom_css
                }}
              />
            )}
          </LmAppProvidersContainer>
        </GlobalTheme>
      </AppSetupProvider>
    </SettingsPageProvider>
  </AppProvider>
)

const Template: StoryFn = (_args, { loaded }) => {
  const data = loaded.data as LandingPageData
  return <StoryWrap {...data} />
}

export const Studentsgoabroad = Template.bind({})
// @ts-ignore
Studentsgoabroad.loaders = [
  async () => {
    CONFIG.publicToken = 'm85LRUo0sX4yo9Q96VMQlQtt'
    CONFIG.rootDirectory = 'en'
    const data = await getPageProps('home', defaultOptions)
    return { data }
  }
]
Studentsgoabroad.parameters = {
  // Sets the delay for a specific story.
  chromatic: { delay: 15000 }
}

export const StudentsgoabroadMobile = Template.bind({})
// @ts-ignore
StudentsgoabroadMobile.loaders = Studentsgoabroad.loaders
StudentsgoabroadMobile.globals = {
  viewport: { value: 'iphone6', isRotated: false }
}
StudentsgoabroadMobile.parameters = {
  chromatic: { delay: 15000 }
}

export const PlanetTraining = Template.bind({})
// @ts-ignore
PlanetTraining.loaders = [
  async () => {
    CONFIG.publicToken = 'itXwOvXYhANlzgPbwrA2Nwtt'
    CONFIG.rootDirectory = ''
    const data = await getPageProps('', {
      ...defaultOptions,
      locale: 'en',
      defaultLocale: 'en'
    })
    return { data }
  }
]
PlanetTraining.parameters = {
  // Sets the delay for a specific story.
  chromatic: { delay: 15000 }
}

export const UpskillStudy = Template.bind({})
// @ts-ignore
UpskillStudy.loaders = [
  async () => {
    CONFIG.publicToken = 'g2AKoarFAJ3BRbUkuafWwQtt'
    CONFIG.rootDirectory = ''
    const data = await getPageProps('', {
      ...defaultOptions,
      locale: 'en',
      defaultLocale: 'en'
    })
    return { data }
  }
]
UpskillStudy.parameters = {
  // Sets the delay for a specific story.
  chromatic: { delay: 15000 }
}

export const Baliinternships = Template.bind({})
// @ts-ignore
Baliinternships.loaders = [
  async () => {
    CONFIG.publicToken = 'Xzl0aUdUwWqtCsD37fHMmQtt'
    CONFIG.rootDirectory = ''
    const data = await getPageProps('', {
      ...defaultOptions,
      locale: 'en',
      defaultLocale: 'en'
    })
    return { data }
  }
]
Baliinternships.parameters = {
  // Sets the delay for a specific story.
  chromatic: { delay: 15000 }
}

export const BaliinternshipsMobile = Template.bind({})
// @ts-ignore
BaliinternshipsMobile.loaders = Baliinternships.loaders
BaliinternshipsMobile.globals = {
  viewport: { value: 'iphone6', isRotated: false }
}
BaliinternshipsMobile.parameters = {
  // Sets the delay for a specific story.
  chromatic: { delay: 15000 }
}

export const Session = Template.bind({})
// @ts-ignore
Session.loaders = [
  async () => {
    CONFIG.publicToken = 'M6FMSs1PwBZARqJIrI7LDwtt'
    CONFIG.rootDirectory = ''
    const data = await getPageProps('', {
      ...defaultOptions,
      locale: 'de',
      defaultLocale: 'de'
    })
    return { data }
  }
]
Session.parameters = {
  // Sets the delay for a specific story.
  chromatic: { delay: 15000 }
}
export const SessionMobile = Template.bind({})
// @ts-ignore
SessionMobile.loaders = Session.loaders
SessionMobile.globals = { viewport: { value: 'iphone6', isRotated: false } }
SessionMobile.parameters = {
  // Sets the delay for a specific story.
  chromatic: { delay: 15000 }
}

export const GameMarketer = Template.bind({})
// @ts-ignore
GameMarketer.loaders = [
  async () => {
    CONFIG.publicToken = '1N2PMM9b5injDsNfTyn7cQtt'
    CONFIG.rootDirectory = ''
    const data = await getPageProps('', {
      ...defaultOptions,
      locale: 'en',
      locales: ['en'],
      defaultLocale: 'en'
    })
    return { data }
  }
]
GameMarketer.parameters = {
  // Sets the delay for a specific story.
  chromatic: { delay: 15000 }
}
export const GameMarketerMobile = Template.bind({})
// @ts-ignore
GameMarketerMobile.loaders = GameMarketer.loaders
GameMarketerMobile.globals = {
  viewport: { value: 'iphone6', isRotated: false }
}
GameMarketerMobile.parameters = {
  // Sets the delay for a specific story.
  chromatic: { delay: 15000 }
}

export const Chatlabs = Template.bind({})
// @ts-ignore
Chatlabs.loaders = [
  async () => {
    CONFIG.publicToken = 'gfiuPfTDZQPeYwgnhOSSjwtt'
    CONFIG.rootDirectory = ''
    const data = await getPageProps('demo-library/content-mn-001', {
      ...defaultOptions,
      locale: 'en',
      locales: ['en'],
      defaultLocale: 'en'
    })
    return { data }
  }
]
Chatlabs.parameters = {
  // Sets the delay for a specific story.
  chromatic: { delay: 15000 }
}
export const ChatlabsMobile = Template.bind({})
// @ts-ignore
ChatlabsMobile.loaders = Chatlabs.loaders
ChatlabsMobile.globals = { viewport: { value: 'iphone6', isRotated: false } }
ChatlabsMobile.parameters = {
  // Sets the delay for a specific story.
  chromatic: { delay: 15000 }
}
