import { CONFIG } from '@CONFIG'
import '../components/ecommerce/shopify/ShopifyComponents'
// import { LmFastSpringProvider } from '../components/ecommerce/fastspring/LmFastspringProvider'
// import { LmShopifySdkProvider } from '../components/ecommerce/shopify/ShopifySdkProvider'

// export { Auth0App as default } from '../components/pages/_appAuth0'
export { LmDefaultApp as default } from '../components/pages/_appDefault'
// export default LmDefaultApp
// if (process.env.NEXT_PUBLIC_AUTH_API_ASSIGN_ROLE) {
//   LmCoreComponents.lm_app_providers.push(LmFastSpringProvider)
// }
// LmCoreComponents.lm_app_providers.push(LmShopifySdkProvider)

CONFIG.authPathRequiredRoles = [
  {
    path: '/offensive-1/',
    roles: ['app-offensive']
  },
  {
    path: '/auth/offensive-1/',
    roles: ['app-offensive']
  },
  {
    path: '/de/auth/offensive-1/',
    roles: ['app-offensive']
  },
  {
    path: '/en/auth/offensive-1/',
    roles: ['app-offensive-en']
  }
]
