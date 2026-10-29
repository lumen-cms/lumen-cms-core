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

const StoryWrap = (data: any) => (
  <AppProvider
    content={{
      allCategories: [],
      listWidgetData: {},
      allStaticContent: [],
      formData: data.formData || {}
    }}
  >
    <SettingsPageProvider settings={data.settings || {}} page={data.page || {}}>
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

const Template: StoryFn<any> = (_args, { loaded: { data } }) => {
  return <StoryWrap {...data} />
}

export const Studentsgoabroad = Template.bind({})
// eslint-disable-next-line
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
// eslint-disable-next-line
// @ts-ignore
StudentsgoabroadMobile.loaders = Studentsgoabroad.loaders
StudentsgoabroadMobile.globals = {
  viewport: { value: 'iphone6', isRotated: false }
}
StudentsgoabroadMobile.parameters = {
  chromatic: { delay: 15000 }
}

export const PlanetTraining = Template.bind({})
// eslint-disable-next-line
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
// eslint-disable-next-line
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
// eslint-disable-next-line
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
// eslint-disable-next-line
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
// eslint-disable-next-line
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
// eslint-disable-next-line
// @ts-ignore
SessionMobile.loaders = Session.loaders
SessionMobile.globals = { viewport: { value: 'iphone6', isRotated: false } }
SessionMobile.parameters = {
  // Sets the delay for a specific story.
  chromatic: { delay: 15000 }
}

export const GameMarketer = Template.bind({})
// eslint-disable-next-line
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
// eslint-disable-next-line
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
// eslint-disable-next-line
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
// eslint-disable-next-line
// @ts-ignore
ChatlabsMobile.loaders = Chatlabs.loaders
ChatlabsMobile.globals = { viewport: { value: 'iphone6', isRotated: false } }
ChatlabsMobile.parameters = {
  // Sets the delay for a specific story.
  chromatic: { delay: 15000 }
}
