import { CONFIG } from '../config'
import { useAppContext } from '../../components/provider/context/AppContext'

export function useHomepageLink() {
  const { locale, defaultLocale } = useAppContext()
  if (CONFIG.rootDirectory) {
    return '/home'
  }
  return locale !== defaultLocale ? `/${locale}/home` : '/home'
}
