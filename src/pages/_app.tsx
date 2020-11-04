import { CONFIG } from '@CONFIG'
// import { LmFastSpringProvider } from '../components/ecommerce/fastspring/LmFastspringProvider'
// export { Auth0App as default } from '../components/pages/_appAuth0'
export { LmDefaultApp as default } from '../components/pages/_appDefault'

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
