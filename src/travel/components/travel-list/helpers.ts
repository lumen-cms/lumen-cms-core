import { useSyncExternalStore } from 'react'
import { getCurrency } from 'locale-currency'

type Currency = 'usd' | 'eur' | 'aus' | 'gbp'

export function parseCurrency(lang: 'de' | 'en'): Currency {
  const allowed: Currency[] = ['usd', 'aus', 'eur', 'gbp']
  if (lang === 'de') return 'eur'
  if (typeof window === 'undefined') return 'eur'
  const currency =
    (getCurrency(
      window.navigator?.language || lang || 'en_US'
    )?.toLowerCase() as Currency) || 'usd'

  return allowed.includes(currency) ? currency : 'eur'
}

const subscribe = () => () => {}

// Hydrate with the server currency before applying the browser preference.
export function useCurrency(lang: 'de' | 'en'): Currency {
  return useSyncExternalStore(
    subscribe,
    () => parseCurrency(lang),
    () => 'eur'
  )
}
