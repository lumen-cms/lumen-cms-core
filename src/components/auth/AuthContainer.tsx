import React, { FC, PropsWithChildren } from 'react'
import { LmComponentRender } from '@LmComponentRender'
import { useAppContext } from '@context/AppContext'
import { AuthContainerStoryblok } from '../../typings/generated/components-schema'
import { hasAuth0Credentials } from '../../utils/auth0/auth0Helpers'
import { useUserData } from './useAuth'

const LmAuthContainer: FC<
  PropsWithChildren<{ content: AuthContainerStoryblok }>
> = ({ content, children }) => {
  const { insideStoryblok } = useAppContext() || {}
  const user = useUserData()

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

  if (rolesOnHide.length) {
    hideOnRole = user ? !hasAuth0Credentials(rolesOnHide, user) : false
  }
  if (rolesRequired.length) {
    requireRole = user ? !!hasAuth0Credentials(rolesRequired, user) : false
  }

  if (!insideStoryblok && !(hideOnRole && showContent && requireRole)) {
    return <span className="lm-empty__auth" /> // some condition is not matched
  }
  if (content.body?.length) {
    return (
      <>
        {content.body.map((blok) => {
          if (blok.component === 'headline') {
            blok.text = blok.text?.replace('{email}', user?.email ?? '')
            blok.text = blok.text?.replace('{firstName}', user?.firstName ?? '')
            blok.text = blok.text?.replace('{lastName}', user?.lastName ?? '')
          } else if (blok.component === 'button') {
            blok.label = blok.label?.replace('{email}', user?.email ?? '')
            blok.label = blok.label?.replace(
              '{firstName}',
              user?.firstName ?? ''
            )
            blok.label = blok.label?.replace('{lastName}', user?.lastName ?? '')
          }
          return <LmComponentRender content={blok} key={blok._uid} />
        })}
      </>
    )
  }
  return <>{children}</>
}
LmAuthContainer.displayName = 'AuthContainer'

export default LmAuthContainer
