import { CONFIG } from '@CONFIG'
// import { LmFastSpringProvider } from '../components/ecommerce/fastspring/LmFastspringProvider'
export { Auth0App as default } from '../components/pages/_appAuth0'

// @ts-ignore
// LmDefaultApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext)
//
//   return { ...appProps }
// }
// export default LmDefaultApp
// if (process.env.NEXT_PUBLIC_AUTH_API_ASSIGN_ROLE) {
//   LmCoreComponents.lm_app_providers.push(LmFastSpringProvider)
// }

CONFIG.authPathRequiredRoles = [
  {
    path: 'offensive-1/',
    roles: ['app-offensive']
  }
]
