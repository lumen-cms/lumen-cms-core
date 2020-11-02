import { AppPageProps } from '../../typings/app'

export const getBaseProps = (error?: any): AppPageProps => ({
  page: { _uid: '123123', component: 'page' },
  settings: { _uid: '123123', component: 'global', theme_base: 'base' },
  allCategories: [],
  allStaticContent: [],
  locale: '',
  listWidgetData: {},
  ...(error
    ? {
        error
      }
    : {})
})
