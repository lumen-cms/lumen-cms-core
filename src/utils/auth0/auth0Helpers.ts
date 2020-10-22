import { CONFIG } from '@CONFIG'
import { IClaims } from '../../typings/app'

let userState: any

export function createLoginUrl(redirectTo?: string) {
  if (redirectTo) {
    return `/api/auth0/login?redirectTo=${encodeURIComponent(redirectTo)}`
  }
  return `/api/auth0/login`
}

export const fetchUser = async () => {
  if (userState !== undefined) {
    return userState
  }

  const res = await fetch('/api/auth0/me')
  userState = res.ok ? await res.json() : null
  return userState
}

export const hasAuth0Credentials = (roles: string[], user: IClaims) => {
  const userCurrentRoles =
    user[process.env.NEXT_PUBLIC_AUTH_PERMISSION as string] || []
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
  user: IClaims
) => {
  const currentPath = Array.isArray(routeParams)
    ? routeParams.join('/')
    : routeParams ?? ''
  const needSpecificRole = CONFIG.authPathRequiredRoles?.find((item) =>
    currentPath.includes(item.path)
  )
  if (needSpecificRole) {
    return hasAuth0Credentials(needSpecificRole.roles, user)
  }
  return true
}
