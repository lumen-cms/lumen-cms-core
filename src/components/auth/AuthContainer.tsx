import React, { FC } from 'react'
import { LmComponentRender } from '@LmComponentRender'
import { useAppContext } from '@context/AppContext'
import { AuthContainerStoryblok } from '../../typings/generated/components-schema'
import { hasAuth0Credentials } from '../../utils/auth0/auth0Helpers'

export const AuthContainer: FC<{ content: AuthContainerStoryblok }> = ({
  content,
  children
}) => {
  const appContext = useAppContext()
  const { user, insideStoryblok } = appContext
  let hideOnRole = true
  let requireRole = true
  let showContent = true
  if (content.display) {
    if (content.display === 'hide_logged_in' && !!user) {
      showContent = false
    } else if (content.display === 'require_logged_in' && !user) {
      showContent = false
    }
  }
  const rolesRequired = (content.require_role || '')
    .split(',')
    .map((string) => string.trim())
    .filter((i) => i)
  const rolesOnHide = (content.hide_on_role || '')
    .split(',')
    .map((string) => string.trim())
    .filter((i) => i)

  if (user) {
    if (rolesOnHide.length) {
      hideOnRole = !hasAuth0Credentials(rolesOnHide, user)
    }
    if (rolesRequired.length) {
      requireRole = hasAuth0Credentials(rolesRequired, user)
    }
  }

  if (!insideStoryblok && !(hideOnRole && showContent && requireRole)) {
    return <span className="lm-empty__auth" /> // some condition is not matched
  }
  if (content.body?.length) {
    return (
      <>
        {content.body.map((blok) => (
          <LmComponentRender content={blok} key={blok._uid} />
        ))}
      </>
    )
  }
  return <>{children}</>
}
AuthContainer.displayName = 'AuthContainer'

export default AuthContainer
