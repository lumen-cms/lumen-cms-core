let userState: any = undefined

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
