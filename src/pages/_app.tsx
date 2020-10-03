import { LmCoreComponents } from '@CONFIG'
import { LmLazyComponents } from '../components/LazyNamedComponents'

Object.keys(LmLazyComponents).forEach(
  (k) => (LmCoreComponents[k] = LmLazyComponents[k])
)
export { LmDefaultApp as default, reportWebVitals } from '..'
