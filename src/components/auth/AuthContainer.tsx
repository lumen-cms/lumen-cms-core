import { FC, PropsWithChildren } from 'react'
import { LmComponentRender } from '../CoreComponents'
import { useAppContext } from '../provider/context/AppContext'
import { AuthContainerStoryblok } from '../../typings/generated/components-schema'
import { hasAuth0Credentials } from '../../utils/auth0/auth0Helpers'
import { useUserData } from './useAuth'

type AuthUser = ReturnType<typeof useUserData>

function canDisplayAuthContent(
  content: AuthContainerStoryblok,
  user: AuthUser
) {
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

  return hideOnRole && showContent && requireRole
}

function personalizeBlock(
  blok: NonNullable<AuthContainerStoryblok['body']>[number],
  user: AuthUser
) {
  const personalize = (text?: string) =>
    text
      ?.replace('{email}', user?.email ?? '')
      .replace('{firstName}', user?.firstName ?? '')
      .replace('{lastName}', user?.lastName ?? '')
  if (blok.component === 'headline')
    return { ...blok, text: personalize(blok.text) }
  if (blok.component === 'button')
    return { ...blok, label: personalize(blok.label) }
  return blok
}

const LmAuthContainer: FC<
  PropsWithChildren<{ content: AuthContainerStoryblok }>
> = ({ content, children }) => {
  const { insideStoryblok } = useAppContext() || {}
  const user = useUserData()

  if (!insideStoryblok && !canDisplayAuthContent(content, user)) {
    return <span className="lm-empty__auth" /> // some condition is not matched
  }
  if (content.body?.length) {
    return (
      <>
        {content.body.map((blok) => {
          return (
            <LmComponentRender
              content={personalizeBlock(blok, user)}
              key={blok._uid}
            />
          )
        })}
      </>
    )
  }
  return <>{children}</>
}
LmAuthContainer.displayName = 'AuthContainer'

export default LmAuthContainer
