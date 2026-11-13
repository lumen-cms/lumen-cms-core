import { matchAuthRule, normalizeUser, hasRoles } from 'lumen-cms-shared/auth'
import { CONFIG } from '../config'
type User = { email?: string; [claim: string]: unknown }

export const hasAuth0Credentials = (roles: string[], user: User): boolean => {
 const normalized = normalizeUser({ ...user, sub: typeof user.sub === 'string' ? user.sub : 'legacy' }, process.env.AUTH_PERMISSION || 'roles', process.env.AUTH_PERMISSION_KEY)
 return hasRoles(roles, normalized)
}
export const getAuth0RoleOnPath = (routeParams: string | string[] | undefined, options: { locale?: string; defaultLocale?: string }) => {
 let path = '/' + (Array.isArray(routeParams) ? routeParams.join('/') : routeParams || '').replace(/^\/+/, '')
 if (options.locale && options.locale !== options.defaultLocale && path !== '/' + options.locale && !path.startsWith('/' + options.locale + '/')) path = '/' + options.locale + path
 const source = process.env.AUTH_PATH_REQUIRED_ROLES
 const rules = source ? JSON.parse(source) as { path: string; roles: string[] }[] : CONFIG.authPathRequiredRoles
 if (rules && (!Array.isArray(rules) || rules.some(rule => typeof rule.path !== 'string' || !Array.isArray(rule.roles) || rule.roles.some(role => typeof role !== 'string')))) throw new Error('AUTH_PATH_REQUIRED_ROLES must be an array of path/roles rules')
 return matchAuthRule(path, rules)
}

export const hasAuth0PathCredentials = (
  routeParams: string | string[] | undefined,
  user: User,
  options: { locale?: string; defaultLocale?: string }
) => {
  const needSpecificRole = getAuth0RoleOnPath(routeParams, options)
  if (needSpecificRole) {
    return hasAuth0Credentials(needSpecificRole.roles, user)
  }
  return true
}
export const auth0Endpoint = {
  api:
    process.env.NODE_ENV === 'production'
      ? process.env.AUTH_API
      : 'http://localhost:3001'
}
