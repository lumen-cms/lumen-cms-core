import {
  ButtonStoryblok,
  HeadlineStoryblok,
  ImageStoryblok,
  MoralisStoryblok
} from '../../typings/generated/components-schema'
import { LmComponentRender } from '@LmComponentRender'
import { useMoralis } from 'react-moralis'

type MoralisProps = {
  content: MoralisStoryblok
}
export default function Moralis({ content }: MoralisProps) {
  const { body, _uid } = content
  const first = body?.[0]
  const { authenticate, isAuthenticating, user, logout, userError } =
    useMoralis()

  if (!first) {
    return null
  }
  if (userError?.message) {
    return <p>{userError.message}</p>
  }
  let username = user?.getUsername()
  if (first.component === 'moralis_button') {
    if (username) {
      let headlineElement = { ...first.user?.[0] }
      let logoutElement = first.logout?.[0]
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            alignContent: 'center'
          }}
        >
          <LmComponentRender
            content={
              {
                component: 'headline',
                _uid: headlineElement?._uid || 'head_' + _uid,
                typography: 'headline6',
                ...headlineElement,
                text:
                  headlineElement?.text?.replace('{user}', username) || username
              } as HeadlineStoryblok
            }
          />
          <LmComponentRender
            content={
              {
                component: 'button',
                _uid: 'head',
                label: 'Logout',
                ...logoutElement
              } as ButtonStoryblok | ImageStoryblok
            }
            disabled={isAuthenticating}
            onClick={() => logout()}
          />
        </div>
      )
    }
    let loginElement = first.login?.[0]
    console.log('is not authenticated', loginElement)
    return (
      <LmComponentRender
        content={
          {
            component: 'button',
            _uid: loginElement?._uid || 'login_' + _uid,
            label: 'My Button',
            ...loginElement
          } as ButtonStoryblok
        }
        onClick={() => authenticate()}
      />
    )
  }
  return <div>moralis</div>
}
