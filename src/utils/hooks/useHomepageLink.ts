import { CONFIG } from '@CONFIG'
import { useAppContext } from '@context/AppContext'

export function useHomepageLink() {
  const { locale, defaultLocale } = useAppContext()
  if (CONFIG.rootDirectory) {
    return '/home'
  }
  return locale !== defaultLocale ? `/${locale}/home` : '/home'
}
