import '../NamedComponents'
import '../LazyNamedComponents'
import { NextWebVitalsMetric } from 'next/app'

export { LmApp as LmDefaultApp } from './_app'

export function reportWebVitals({
  value,
  id,
  name,
  label
}: NextWebVitalsMetric) {
  gtag &&
    gtag('event', name, {
      event_category:
        label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
      value: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers
      event_label: id, // id unique to current page load
      non_interaction: true // avoids affecting bounce rate.
    })
}
