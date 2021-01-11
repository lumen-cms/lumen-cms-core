import { useRouter } from 'next/router'
import { CONFIG } from '@CONFIG'

export function useHomepageLink() {
  const { locale, defaultLocale } = useRouter()
  if (CONFIG.rootDirectory) {
    return '/home'
  }
  return locale !== defaultLocale ? `/${locale}/home` : '/home'
}
