import { matchAuthRule, normalizeUser, hasRoles } from './authCore'
import { CONFIG } from '../config'
import { User } from '@auth0/auth0-react'

export const hasAuth0Credentials = (roles: string[], user: User): boolean => {
  const normalized = normalizeUser(
    { ...user, sub: typeof user.sub === 'string' ? user.sub : 'legacy' },
    process.env.NEXT_PUBLIC_AUTH_PERMISSION || 'roles',
    process.env.NEXT_PUBLIC_AUTH_PERMISSION_KEY
  )
  return hasRoles(roles, normalized)
}
export const getAuth0RoleOnPath = (
  routeParams: string | string[] | undefined,
  options: { locale?: string; defaultLocale?: string }
) => {
  let path =
    '/' +
    (Array.isArray(routeParams)
      ? routeParams.join('/')
      : routeParams || ''
    ).replace(/^\/+/, '')
  if (
    options.locale &&
    options.locale !== options.defaultLocale &&
    path !== '/' + options.locale &&
    !path.startsWith('/' + options.locale + '/')
  )
    path = '/' + options.locale + path
  return matchAuthRule(path, CONFIG.authPathRequiredRoles)
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
      ? process.env.NEXT_PUBLIC_AUTH_API
      : 'http://localhost:3001'
}
