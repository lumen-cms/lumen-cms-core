import { CONFIG, LmCoreComponents } from '@CONFIG'
import { LmFastSpringProvider } from '../components/ecommerce/fastspring/LmFastspringProvider'

export { LmDefaultApp as default } from '../components/pages/_appDefault'
if (process.env.NEXT_PUBLIC_AUTH_API_ASSIGN_ROLE) {
  LmCoreComponents.lm_app_providers.push(LmFastSpringProvider)
}

CONFIG.authPathRequiredRoles = [
  {
    path: 'auth/offensive-1/',
    roles: ['app-offensive']
  }
]
