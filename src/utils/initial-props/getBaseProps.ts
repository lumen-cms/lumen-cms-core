import { AppPageProps } from '../../typings/app'

export const getBaseProps = (error: any): AppPageProps => ({
  page: { _uid: '', component: 'page' },
  error,
  settings: { _uid: '', component: 'global', theme_base: 'base' },
  allCategories: [],
  allStaticContent: [],
  locale: '',
  listWidgetData: {}
})
