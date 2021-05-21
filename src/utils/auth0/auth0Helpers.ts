import { CONFIG } from '@CONFIG'
import { User } from '@auth0/auth0-react'

export const hasAuth0Credentials = (roles: string[], user: User) => {
  const userCurrentRoles =
    user[process.env.NEXT_PUBLIC_AUTH_PERMISSION as string] || []
  if (!userCurrentRoles.length) {
    return false
  }
  if (
    !roles.find((role) =>
      userCurrentRoles.find((item: string | any) =>
        process.env.NEXT_PUBLIC_AUTH_PERMISSION_KEY
          ? item[process.env.NEXT_PUBLIC_AUTH_PERMISSION_KEY] === role
          : item === role
      )
    )
  ) {
    return false
  }
  return true
}

export const hasAuth0PathCredentials = (
  routeParams: string | string[] | undefined,
  user: User,
  options: { locale?: string; defaultLocale?: string }
) => {
  let currentPath = Array.isArray(routeParams)
    ? routeParams.join('/')
    : routeParams ?? ''
  if (options.locale && options.defaultLocale !== options.locale) {
    currentPath = `/${options.locale}${currentPath}`
  }
  const needSpecificRole = CONFIG.authPathRequiredRoles?.find((item) =>
    currentPath.startsWith(item.path)
  )
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
