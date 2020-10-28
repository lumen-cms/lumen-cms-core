import { CONFIG, LmCoreComponents } from '@CONFIG'
import { LmFastSpringProvider } from '../components/ecommerce/fastspring/LmFastspringProvider'

import { LmDefaultApp } from '../components/pages/_appDefault'

// @ts-ignore
// LmDefaultApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext)
//
//   return { ...appProps }
// }
export default LmDefaultApp
if (process.env.NEXT_PUBLIC_AUTH_API_ASSIGN_ROLE) {
  LmCoreComponents.lm_app_providers.push(LmFastSpringProvider)
}

CONFIG.authPathRequiredRoles = [
  {
    path: 'auth/offensive-1/',
    roles: ['app-offensive']
  }
]
