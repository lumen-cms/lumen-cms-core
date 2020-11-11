import { CONFIG } from '@CONFIG'
import { useRouter } from 'next/router'

export function useHomepageLink() {
  const { locale, defaultLocale } = useRouter()
  if (CONFIG.rootDirectory) {
    return '/home'
  }
  return locale !== defaultLocale ? `/${locale}/home` : '/home'
}
