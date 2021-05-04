import * as React from 'react'
import { Story } from '@storybook/react'
import { CONFIG } from '@CONFIG'
import { SettingsPageProvider } from '../provider/SettingsPageProvider'
import GlobalTheme from '../global-theme/GlobalTheme'
import AppProvider from '../provider/AppProvider'
import { LmAppProvidersContainer } from '../layout/LmAppProvidersContainer'
import getPageProps from '../../utils/initial-props/getPageProps'
import Layout from '../layout/Layout'
import { LmPage } from './Page'
import AppSetupProvider from '../provider/AppSetupProvider'

const defaultOptions = {
  locale: 'en',
  insideStoryblok: false,
  defaultLocale: 'en',
  locales: ['en', 'de']
}

export default {
  title: 'Landing Page/Website',
  parameters: {
    layout: 'fullscreen'
  }
}

const StoryWrap = (data: any) => (
  <AppProvider
    content={{
      allCategories: data.allCategories || [],
      listWidgetData: data.listWidgetData || {},
      allStaticContent: data.allStaticContent || [],
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
          </LmAppProvidersContainer>
        </GlobalTheme>
      </AppSetupProvider>
    </SettingsPageProvider>
  </AppProvider>
)

const Template: Story<any> = (_args, { loaded: { data } }) => {
  return <StoryWrap {...data} />
}

export const Studentsgoabroad = Template.bind({})
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Studentsgoabroad.loaders = [
  async () => {
    CONFIG.publicToken = 'm85LRUo0sX4yo9Q96VMQlQtt'
    CONFIG.previewToken = 'qASJXPT2cwH76pA9vpJbxAtt'
    CONFIG.rootDirectory = 'en'
    const data = await getPageProps('home', defaultOptions)
    return { data }
  }
]
Studentsgoabroad.parameters = {
  // Sets the delay for a specific story.
  chromatic: { delay: 10000 }
}
export const PlanetTraining = Template.bind({})
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
PlanetTraining.loaders = [
  async () => {
    CONFIG.publicToken = 'itXwOvXYhANlzgPbwrA2Nwtt'
    CONFIG.previewToken = 'MbZE9l5hGQp6BHIMkooB9Qtt'
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
  chromatic: { delay: 10000 }
}

export const UpskillStudy = Template.bind({})
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
UpskillStudy.loaders = [
  async () => {
    CONFIG.publicToken = 'g2AKoarFAJ3BRbUkuafWwQtt'
    CONFIG.previewToken = 'frxOrvW4RwWV5Xcrg4b3awtt'
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
  chromatic: { delay: 10000 }
}

export const Baliinternships = Template.bind({})
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
Baliinternships.loaders = [
  async () => {
    CONFIG.publicToken = 'Xzl0aUdUwWqtCsD37fHMmQtt'
    CONFIG.previewToken = 'IQrhrTP6aL0WYgDXmersbgtt'
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
  chromatic: { delay: 10000 }
}
