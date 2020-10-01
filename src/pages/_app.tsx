import { LmCoreComponents } from '..'
import { LmGoogleForm } from '../components/google-form/GoogleForm'
import { LmLazyComponents } from '../components/LazyNamedComponents'

Object.keys(LmLazyComponents).forEach(
  (k) => (LmCoreComponents[k] = LmLazyComponents[k])
)
LmCoreComponents.form = LmGoogleForm
export { LmDefaultApp as default, reportWebVitals } from '..'
