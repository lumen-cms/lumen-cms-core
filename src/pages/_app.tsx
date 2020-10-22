import { CONFIG } from '@CONFIG'

export { LmDefaultApp as default } from '../components/pages/_appDefault'

CONFIG.authPathRequiredRoles = [
  {
    path: 'auth/offensive-1/',
    roles: ['app-offensive']
  }
]
